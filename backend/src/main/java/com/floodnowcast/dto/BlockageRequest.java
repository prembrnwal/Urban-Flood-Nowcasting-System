package com.floodnowcast.dto;

import jakarta.validation.constraints.NotBlank;

public class BlockageRequest {
    @NotBlank private String nodeId;
    private double blockagePercentage;
    private double rainfallIntensity;

    public BlockageRequest() {}
    public String getNodeId() { return nodeId; }
    public void setNodeId(String v) { this.nodeId = v; }
    public double getBlockagePercentage() { return blockagePercentage; }
    public void setBlockagePercentage(double v) { this.blockagePercentage = v; }
    public double getRainfallIntensity() { return rainfallIntensity; }
    public void setRainfallIntensity(double v) { this.rainfallIntensity = v; }
}
