package com.floodnowcast.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "street")
public class Street {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false) private String name;
    @Column(columnDefinition = "TEXT") private String geometry;
    private Double latitude;
    private Double longitude;
    private Double elevation;
    private Double slope;
    private Double imperviousness;
    private Double surfaceArea;
    private String zone;
    private Integer population;
    private String ward;

    public Street() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGeometry() { return geometry; }
    public void setGeometry(String geometry) { this.geometry = geometry; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Double getElevation() { return elevation; }
    public void setElevation(Double elevation) { this.elevation = elevation; }
    public Double getSlope() { return slope; }
    public void setSlope(Double slope) { this.slope = slope; }
    public Double getImperviousness() { return imperviousness; }
    public void setImperviousness(Double imperviousness) { this.imperviousness = imperviousness; }
    public Double getSurfaceArea() { return surfaceArea; }
    public void setSurfaceArea(Double surfaceArea) { this.surfaceArea = surfaceArea; }
    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }
    public Integer getPopulation() { return population; }
    public void setPopulation(Integer population) { this.population = population; }
    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }
}
