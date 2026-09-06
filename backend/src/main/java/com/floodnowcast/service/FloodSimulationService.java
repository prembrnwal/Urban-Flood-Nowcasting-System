package com.floodnowcast.service;

import com.floodnowcast.dto.FloodZoneDto;
import com.floodnowcast.entity.FloodPrediction;
import com.floodnowcast.entity.Street;
import com.floodnowcast.repository.DrainageNodeRepository;
import com.floodnowcast.repository.FloodPredictionRepository;
import com.floodnowcast.repository.StreetRepository;
import com.floodnowcast.simulation.DrainageGraphEngine;
import com.floodnowcast.simulation.FloodSimulationEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class FloodSimulationService {

    private static final Logger log = LoggerFactory.getLogger(FloodSimulationService.class);

    private final StreetRepository streetRepository;
    private final FloodPredictionRepository floodPredictionRepository;
    private final DrainageNodeRepository drainageNodeRepository;
    private final FloodSimulationEngine simulationEngine;
    private final DrainageGraphEngine drainageGraphEngine;
    private final RainfallService rainfallService;

    private volatile double currentBlockage = 0.0;
    private volatile double currentImperviousness = -1.0;
    private final Map<String, List<FloodZoneDto>> resultCache = new ConcurrentHashMap<>();

    @org.springframework.beans.factory.annotation.Autowired
    public FloodSimulationService(StreetRepository streetRepository,
                                   FloodPredictionRepository floodPredictionRepository,
                                   DrainageNodeRepository drainageNodeRepository,
                                   FloodSimulationEngine simulationEngine,
                                   DrainageGraphEngine drainageGraphEngine,
                                   RainfallService rainfallService) {
        this.streetRepository = streetRepository;
        this.floodPredictionRepository = floodPredictionRepository;
        this.drainageNodeRepository = drainageNodeRepository;
        this.simulationEngine = simulationEngine;
        this.drainageGraphEngine = drainageGraphEngine;
        this.rainfallService = rainfallService;
    }

    public void setCurrentBlockage(double blockage) {
        this.currentBlockage = Math.max(0.0, Math.min(1.0, blockage));
        resultCache.clear();
    }

    public void setCurrentImperviousness(double imp) {
        this.currentImperviousness = imp < 0 ? -1.0 : imp / 100.0;
        resultCache.clear();
    }

    public List<FloodZoneDto> getFloodZones(int forecastMinute) {
        List<Street> streets = streetRepository.findAll();
        Map<String, DrainageGraphEngine.NodeFlowResult> drainageResults =
                drainageGraphEngine.simulate(rainfallService.getCurrentRainfall(), currentBlockage);

        // Simulate cumulative water accumulation up to forecastMinute
        Map<Long, Double> waterAccumulation = new HashMap<>();
        int[] steps = {0, 30, 60, 90, 120, 150, 180};
        for (int step : steps) {
            if (step > forecastMinute) break;
            double stepRainfall = rainfallService.getRainfallAtMinute(step);
            for (Street street : streets) {
                double imp = currentImperviousness >= 0 ? currentImperviousness : safeImp(street);
                Street adj = adjustedStreet(street, imp);
                double drainCap = getDrainCap(street, drainageResults);
                double prev = waterAccumulation.getOrDefault(street.getId(), 0.0);
                FloodSimulationEngine.FloodResult r = simulationEngine.calculate(adj, stepRainfall, currentBlockage, drainCap, 30, prev);
                waterAccumulation.put(street.getId(), r.surfaceWaterM3());
            }
        }

        double finalRainfall = rainfallService.getRainfallAtMinute(forecastMinute);
        List<FloodZoneDto> results = new ArrayList<>();
        for (Street street : streets) {
            double imp = currentImperviousness >= 0 ? currentImperviousness : safeImp(street);
            Street adj = adjustedStreet(street, imp);
            double drainCap = getDrainCap(street, drainageResults);
            double prev = waterAccumulation.getOrDefault(street.getId(), 0.0);

            FloodSimulationEngine.FloodResult r = simulationEngine.calculate(adj, finalRainfall, currentBlockage, drainCap, 30, prev);

            results.add(FloodZoneDto.builder()
                    .streetId(street.getId())
                    .streetName(street.getName())
                    .forecastMinute(forecastMinute)
                    .waterDepthCm(Math.round(r.depthCm() * 10.0) / 10.0)
                    .riskLevel(r.riskLevel())
                    .floodProbability(Math.round(r.floodProbability() * 10.0) / 10.0)
                    .drainUtilization(Math.round(r.drainUtilization() * 10.0) / 10.0)
                    .elevation(street.getElevation())
                    .imperviousness(imp * 100.0)
                    .latitude(street.getLatitude())
                    .longitude(street.getLongitude())
                    .geometry(street.getGeometry())
                    .build());
        }
        return results;
    }

    public Map<String, Object> getStreetForecast(Long streetId) {
        Street street = streetRepository.findById(streetId)
                .orElseThrow(() -> new IllegalArgumentException("Street not found: " + streetId));

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("streetId", street.getId());
        response.put("streetName", street.getName());
        response.put("elevation", street.getElevation());
        response.put("imperviousness", safeImp(street) * 100.0);
        response.put("slope", street.getSlope());

        Map<String, DrainageGraphEngine.NodeFlowResult> drainageResults =
                drainageGraphEngine.simulate(rainfallService.getCurrentRainfall(), currentBlockage);
        double drainCap = getDrainCap(street, drainageResults);

        List<Map<String, Object>> forecast = new ArrayList<>();
        int[] minutes = {0, 30, 60, 90, 120, 150, 180};
        double accWater = 0.0;
        double imp = currentImperviousness >= 0 ? currentImperviousness : safeImp(street);

        for (int minute : minutes) {
            double rainfall = rainfallService.getRainfallAtMinute(minute);
            Street adj = adjustedStreet(street, imp);
            FloodSimulationEngine.FloodResult r = simulationEngine.calculate(adj, rainfall, currentBlockage, drainCap, 30, accWater);
            accWater = r.surfaceWaterM3();

            Map<String, Object> point = new LinkedHashMap<>();
            point.put("minute", minute);
            point.put("waterDepthCm", Math.round(r.depthCm() * 10.0) / 10.0);
            point.put("riskLevel", r.riskLevel().name());
            point.put("floodProbability", (int) Math.round(r.floodProbability()));
            point.put("drainUtilization", (int) Math.round(r.drainUtilization()));
            point.put("rainfall", Math.round(rainfall * 10.0) / 10.0);
            forecast.add(point);
        }

        response.put("forecast", forecast);
        if (!forecast.isEmpty()) {
            Map<String, Object> current = forecast.get(0);
            response.put("currentDepthCm", current.get("waterDepthCm"));
            response.put("currentRisk", current.get("riskLevel"));
            response.put("floodProbability", current.get("floodProbability"));
            response.put("drainUtilization", current.get("drainUtilization"));
        }
        return response;
    }

    public Map<String, Object> runScenario(double rainfallMmHr, int durationMin,
                                            double blockagePct, double imperviousnessPct) {
        List<Street> streets = streetRepository.findAll();
        double blockageFraction = blockagePct / 100.0;
        double impFraction = imperviousnessPct / 100.0;

        Map<String, DrainageGraphEngine.NodeFlowResult> drainageResults =
                drainageGraphEngine.simulate(rainfallMmHr, blockageFraction);

        long drainOverflows = drainageResults.values().stream().filter(r -> r.surcharging()).count();

        double maxDepth = 0.0;
        int affectedRoads = 0;
        int criticalZones = 0;
        long totalPopAtRisk = 0;

        for (Street street : streets) {
            Street adj = adjustedStreet(street, impFraction);
            double drainCap = getDrainCap(street, drainageResults);
            FloodSimulationEngine.FloodResult r = simulationEngine.calculate(adj, rainfallMmHr, blockageFraction, drainCap, durationMin, 0.0);
            if (r.depthCm() > 5.0) {
                affectedRoads++;
                totalPopAtRisk += (street.getPopulation() != null ? street.getPopulation() : 300);
            }
            if (r.riskLevel() == FloodPrediction.RiskLevel.CRITICAL || r.riskLevel() == FloodPrediction.RiskLevel.HIGH) {
                criticalZones++;
            }
            maxDepth = Math.max(maxDepth, r.depthCm());
        }

        int warningLeadTime = Math.max(10, 60 - (int)(rainfallMmHr / 3.0) - (int)(blockagePct / 2.0));
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("maximumDepth", Math.round(maxDepth * 10.0) / 10.0);
        response.put("affectedRoads", affectedRoads);
        response.put("criticalZones", criticalZones);
        response.put("drainOverflows", (int) drainOverflows);
        response.put("populationAtRisk", (int) Math.min(totalPopAtRisk, 50000));
        response.put("warningLeadTime", warningLeadTime);
        response.put("totalRunoffM3", Math.round(rainfallMmHr * impFraction * 200000 * durationMin / 60000.0));
        return response;
    }

    public Map<String, Object> runBlockageScenario(String nodeId, double blockagePct, double rainfallMmHr) {
        return runScenario(rainfallMmHr, 60, blockagePct, 80.0);
    }

    // ── helpers ──────────────────────────────────────────────

    private double safeImp(Street s) {
        return s.getImperviousness() != null ? s.getImperviousness() : 0.85;
    }

    private Street adjustedStreet(Street street, double imp) {
        if (Math.abs(imp - safeImp(street)) < 0.001) return street;
        Street copy = new Street();
        copy.setId(street.getId()); copy.setName(street.getName());
        copy.setGeometry(street.getGeometry());
        copy.setLatitude(street.getLatitude()); copy.setLongitude(street.getLongitude());
        copy.setElevation(street.getElevation()); copy.setSlope(street.getSlope());
        copy.setImperviousness(imp); copy.setSurfaceArea(street.getSurfaceArea());
        copy.setZone(street.getZone()); copy.setPopulation(street.getPopulation());
        copy.setWard(street.getWard());
        return copy;
    }

    private double getDrainCap(Street street, Map<String, DrainageGraphEngine.NodeFlowResult> drainageResults) {
        // Local street curb inlet capacity (0.015 to 0.035 m³/s per street segment)
        double baseCap = 0.025;
        double elev = street.getElevation() != null ? street.getElevation() : 10.0;
        // Lower elevation streets (<10m) have reduced gravity outlet discharge
        double elevFactor = Math.max(0.30, Math.min(1.2, elev / 12.0));
        double areaFactor = (street.getSurfaceArea() != null) ? street.getSurfaceArea() / 7500.0 : 1.0;
        return baseCap * elevFactor * areaFactor;
    }
}
