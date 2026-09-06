package com.floodnowcast.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "drainage_edge")
public class DrainageEdge {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String sourceNodeId;
    private String destinationNodeId;
    private Double length;
    private Double diameter;
    private Double slope;
    private Double capacity;
    private String pipeType;

    public DrainageEdge() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSourceNodeId() { return sourceNodeId; }
    public void setSourceNodeId(String sourceNodeId) { this.sourceNodeId = sourceNodeId; }
    public String getDestinationNodeId() { return destinationNodeId; }
    public void setDestinationNodeId(String destinationNodeId) { this.destinationNodeId = destinationNodeId; }
    public Double getLength() { return length; }
    public void setLength(Double length) { this.length = length; }
    public Double getDiameter() { return diameter; }
    public void setDiameter(Double diameter) { this.diameter = diameter; }
    public Double getSlope() { return slope; }
    public void setSlope(Double slope) { this.slope = slope; }
    public Double getCapacity() { return capacity; }
    public void setCapacity(Double capacity) { this.capacity = capacity; }
    public String getPipeType() { return pipeType; }
    public void setPipeType(String pipeType) { this.pipeType = pipeType; }
}
