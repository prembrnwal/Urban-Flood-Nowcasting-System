package com.floodnowcast.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "critical_infrastructure")
public class CriticalInfrastructure {
    public enum InfraType { HOSPITAL, FIRE_STATION, POLICE_STATION, RAILWAY_STATION, METRO_STATION, SCHOOL, SHELTER, SAFE_POINT, RELIEF_CAMP, HIGH_GROUND }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String name;
    @Enumerated(EnumType.STRING) private InfraType type;
    private Double latitude;
    private Double longitude;
    private String address;
    private Integer capacity;
    @Enumerated(EnumType.STRING) private FloodPrediction.RiskLevel currentRiskLevel;
    private String nearestStreetIds;

    public CriticalInfrastructure() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public InfraType getType() { return type; }
    public void setType(InfraType type) { this.type = type; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public FloodPrediction.RiskLevel getCurrentRiskLevel() { return currentRiskLevel; }
    public void setCurrentRiskLevel(FloodPrediction.RiskLevel currentRiskLevel) { this.currentRiskLevel = currentRiskLevel; }
    public String getNearestStreetIds() { return nearestStreetIds; }
    public void setNearestStreetIds(String nearestStreetIds) { this.nearestStreetIds = nearestStreetIds; }
}
