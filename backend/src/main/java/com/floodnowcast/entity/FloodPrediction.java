package com.floodnowcast.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "flood_prediction")
public class FloodPrediction {
    public enum RiskLevel { SAFE, LOW, MODERATE, HIGH, CRITICAL }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private Long streetId;
    private Integer forecastMinute;
    private Double waterDepthCm;
    private Double waterVolume;
    @Enumerated(EnumType.STRING) private RiskLevel riskLevel;
    private Double floodProbability;
    private Double drainUtilization;
    private Double rainfallIntensity;
    private Double blockagePercentage;

    public FloodPrediction() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStreetId() { return streetId; }
    public void setStreetId(Long streetId) { this.streetId = streetId; }
    public Integer getForecastMinute() { return forecastMinute; }
    public void setForecastMinute(Integer forecastMinute) { this.forecastMinute = forecastMinute; }
    public Double getWaterDepthCm() { return waterDepthCm; }
    public void setWaterDepthCm(Double waterDepthCm) { this.waterDepthCm = waterDepthCm; }
    public Double getWaterVolume() { return waterVolume; }
    public void setWaterVolume(Double waterVolume) { this.waterVolume = waterVolume; }
    public RiskLevel getRiskLevel() { return riskLevel; }
    public void setRiskLevel(RiskLevel riskLevel) { this.riskLevel = riskLevel; }
    public Double getFloodProbability() { return floodProbability; }
    public void setFloodProbability(Double floodProbability) { this.floodProbability = floodProbability; }
    public Double getDrainUtilization() { return drainUtilization; }
    public void setDrainUtilization(Double drainUtilization) { this.drainUtilization = drainUtilization; }
    public Double getRainfallIntensity() { return rainfallIntensity; }
    public void setRainfallIntensity(Double rainfallIntensity) { this.rainfallIntensity = rainfallIntensity; }
    public Double getBlockagePercentage() { return blockagePercentage; }
    public void setBlockagePercentage(Double blockagePercentage) { this.blockagePercentage = blockagePercentage; }
}
