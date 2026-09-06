package com.floodnowcast.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "drainage_node")
public class DrainageNode {
    public enum NodeStatus { NORMAL, WARNING, OVERLOADED, BLOCKED }

    @Id private String id;
    @Column(nullable = false) private String name;
    private Double latitude;
    private Double longitude;
    private Double capacity;
    private Double currentFlow;
    private Double blockagePercentage;
    private Double invert;
    @Enumerated(EnumType.STRING) private NodeStatus status;
    private String connectedStreets;
    private String nodeType;

    public DrainageNode() {}
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Double getCapacity() { return capacity; }
    public void setCapacity(Double capacity) { this.capacity = capacity; }
    public Double getCurrentFlow() { return currentFlow; }
    public void setCurrentFlow(Double currentFlow) { this.currentFlow = currentFlow; }
    public Double getBlockagePercentage() { return blockagePercentage; }
    public void setBlockagePercentage(Double blockagePercentage) { this.blockagePercentage = blockagePercentage; }
    public Double getInvert() { return invert; }
    public void setInvert(Double invert) { this.invert = invert; }
    public NodeStatus getStatus() { return status; }
    public void setStatus(NodeStatus status) { this.status = status; }
    public String getConnectedStreets() { return connectedStreets; }
    public void setConnectedStreets(String connectedStreets) { this.connectedStreets = connectedStreets; }
    public String getNodeType() { return nodeType; }
    public void setNodeType(String nodeType) { this.nodeType = nodeType; }
}
