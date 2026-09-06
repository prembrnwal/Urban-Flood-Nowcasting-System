package com.floodnowcast.dto;

import com.floodnowcast.entity.FloodPrediction;

public class FloodZoneDto {
    private Long streetId;
    private String streetName;
    private Integer forecastMinute;
    private Double waterDepthCm;
    private FloodPrediction.RiskLevel riskLevel;
    private Double floodProbability;
    private Double drainUtilization;
    private Double elevation;
    private Double imperviousness;
    private Double latitude;
    private Double longitude;
    private String geometry;

    public FloodZoneDto() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final FloodZoneDto d = new FloodZoneDto();
        public Builder streetId(Long v) { d.streetId = v; return this; }
        public Builder streetName(String v) { d.streetName = v; return this; }
        public Builder forecastMinute(Integer v) { d.forecastMinute = v; return this; }
        public Builder waterDepthCm(Double v) { d.waterDepthCm = v; return this; }
        public Builder riskLevel(FloodPrediction.RiskLevel v) { d.riskLevel = v; return this; }
        public Builder floodProbability(Double v) { d.floodProbability = v; return this; }
        public Builder drainUtilization(Double v) { d.drainUtilization = v; return this; }
        public Builder elevation(Double v) { d.elevation = v; return this; }
        public Builder imperviousness(Double v) { d.imperviousness = v; return this; }
        public Builder latitude(Double v) { d.latitude = v; return this; }
        public Builder longitude(Double v) { d.longitude = v; return this; }
        public Builder geometry(String v) { d.geometry = v; return this; }
        public FloodZoneDto build() { return d; }
    }

    public Long getStreetId() { return streetId; }
    public String getStreetName() { return streetName; }
    public Integer getForecastMinute() { return forecastMinute; }
    public Double getWaterDepthCm() { return waterDepthCm; }
    public FloodPrediction.RiskLevel getRiskLevel() { return riskLevel; }
    public Double getFloodProbability() { return floodProbability; }
    public Double getDrainUtilization() { return drainUtilization; }
    public Double getElevation() { return elevation; }
    public Double getImperviousness() { return imperviousness; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public String getGeometry() { return geometry; }
}
