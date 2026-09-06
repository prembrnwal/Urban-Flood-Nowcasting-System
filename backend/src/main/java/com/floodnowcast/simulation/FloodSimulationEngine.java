package com.floodnowcast.simulation;

import com.floodnowcast.entity.DrainageNode;
import com.floodnowcast.entity.FloodPrediction;
import com.floodnowcast.entity.Street;
import org.springframework.stereotype.Component;

/**
 * Core Urban Flood Simulation Engine (HYDRO-DEMO MODEL)
 *
 * Mathematical urban hydrology model:
 *   Runoff Rate (m³/s) = Rainfall(mm/hr) / 3,600,000 × Imperviousness × SurfaceArea(m²)
 *   Terrain Inflow Rate = Runoff Rate × TerrainFactor(elevation, slope) + Overland Flow Concentration
 *   Effective Drain Rate = DrainInletCapacity × (1 - BlockageFraction)
 *   Net Surface Accumulation Rate = max(0, Terrain Inflow Rate - Effective Drain Rate)
 *   Surface Water Volume (m³) = PreviousWater × 0.75 + Net Accumulation Rate × TimeStepSeconds
 *   Water Depth (cm) = (Surface Water Volume / SurfaceArea) × 100
 */
@Component
public class FloodSimulationEngine {

    private static final double SAFE_MAX = 2.0;
    private static final double LOW_MAX = 10.0;
    private static final double MODERATE_MAX = 25.0;
    private static final double HIGH_MAX = 50.0;
    private static final double MAX_ELEVATION = 40.0;
    private static final double MIN_ELEVATION = 1.5;
    private static final double ELEV_RANGE = MAX_ELEVATION - MIN_ELEVATION;

    public FloodSimulationEngine() {}

    public FloodResult calculate(Street street,
                                  double rainfallMmPerHour,
                                  double blockagePct,
                                  double drainCapacityM3s,
                                  int timeStepMinutes,
                                  double previousWaterM3) {

        double surfaceArea = street.getSurfaceArea() != null ? street.getSurfaceArea() : 7000.0;
        double imperviousness = street.getImperviousness() != null ? street.getImperviousness() : 0.85;
        double elevation = street.getElevation() != null ? street.getElevation() : 10.0;
        double slope = street.getSlope() != null ? street.getSlope() : 1.0;

        // Rainfall runoff rate in m³/s
        double rainfallMs = rainfallMmPerHour / (1000.0 * 3600.0);
        double rawRunoffRate = rainfallMs * imperviousness * surfaceArea;

        // Terrain factor — lower elevation & flatter slope accumulate more runoff
        double terrainFactor = computeTerrainFactor(elevation, slope);
        
        // Overland flow concentration into low elevation streets (< 15m) — scales with rainfall intensity
        double overlandConcentrationRate = (rainfallMmPerHour > 15.0 && elevation < 15.0)
                ? (15.0 - elevation) * (rainfallMmPerHour / 100.0) * 0.02
                : 0.0;
        double surfaceInflowRate = (rawRunoffRate * terrainFactor) + overlandConcentrationRate;

        // Effective local drain discharge rate in m³/s
        double effectiveDrainRate = drainCapacityM3s * (1.0 - Math.min(0.95, blockagePct));

        // Net rate of water accumulation on surface in m³/s
        double netAccumulationRate = Math.max(0.0, surfaceInflowRate - effectiveDrainRate);

        // Accumulation volume over timestep (m³)
        double timeStepSeconds = Math.max(1, timeStepMinutes) * 60.0;
        double newWaterVolume = netAccumulationRate * timeStepSeconds;
        // 25% natural recession/percolation per timestep
        double totalSurfaceWaterM3 = previousWaterM3 * 0.75 + newWaterVolume;

        // Calculate depth in cm
        double depthCm = (surfaceArea > 0) ? (totalSurfaceWaterM3 / surfaceArea) * 100.0 : 0.0;

        // Compute drain utilization %
        double drainUtil = (effectiveDrainRate > 0)
                ? (surfaceInflowRate / effectiveDrainRate) * 100.0
                : 999.0;

        double floodProb = computeFloodProbability(depthCm, drainUtil);
        FloodPrediction.RiskLevel riskLevel = classifyRisk(depthCm);

        return new FloodResult(depthCm, totalSurfaceWaterM3, riskLevel, floodProb, drainUtil, terrainFactor);
    }

    public double computeTerrainFactor(double elevation, double slope) {
        double elevNorm = (ELEV_RANGE > 0) ? (MAX_ELEVATION - elevation) / ELEV_RANGE : 0.5;
        elevNorm = Math.max(0.0, Math.min(1.0, elevNorm));
        double slopeEffect = slope < 1.0 ? 0.40 : slope < 3.0 ? 0.20 : slope < 6.0 ? 0.0 : -0.2;
        return 0.80 + (elevNorm * 1.2) + slopeEffect;
    }

    public double computeFloodProbability(double depthCm, double drainUtilPct) {
        double depthFactor = depthCm > HIGH_MAX ? 95.0 : depthCm > MODERATE_MAX ? 75.0 :
                depthCm > LOW_MAX ? 50.0 : depthCm > SAFE_MAX ? 30.0 : 5.0;
        double utilFactor = Math.min(drainUtilPct * 0.25, 30.0);
        return Math.min(100.0, depthFactor + utilFactor);
    }

    public FloodPrediction.RiskLevel classifyRisk(double depthCm) {
        if (depthCm <= SAFE_MAX) return FloodPrediction.RiskLevel.SAFE;
        if (depthCm <= LOW_MAX) return FloodPrediction.RiskLevel.LOW;
        if (depthCm <= MODERATE_MAX) return FloodPrediction.RiskLevel.MODERATE;
        if (depthCm <= HIGH_MAX) return FloodPrediction.RiskLevel.HIGH;
        return FloodPrediction.RiskLevel.CRITICAL;
    }

    public DrainageNode.NodeStatus classifyNodeStatus(double utilization, double blockage) {
        if (blockage > 70) return DrainageNode.NodeStatus.BLOCKED;
        if (utilization > 120) return DrainageNode.NodeStatus.OVERLOADED;
        if (utilization > 85) return DrainageNode.NodeStatus.WARNING;
        return DrainageNode.NodeStatus.NORMAL;
    }

    public record FloodResult(
            double depthCm,
            double surfaceWaterM3,
            FloodPrediction.RiskLevel riskLevel,
            double floodProbability,
            double drainUtilization,
            double terrainFactor
    ) {}
}
