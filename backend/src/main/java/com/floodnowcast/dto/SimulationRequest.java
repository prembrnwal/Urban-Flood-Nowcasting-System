package com.floodnowcast.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class SimulationRequest {
    @Min(0) @Max(300) private double rainfallIntensity;
    @Min(0) @Max(180) private int rainfallDuration;
    @Min(0) @Max(100) private double drainageBlockage;
    @Min(0) @Max(100) private double imperviousness;

    public SimulationRequest() {}
    public double getRainfallIntensity() { return rainfallIntensity; }
    public void setRainfallIntensity(double v) { this.rainfallIntensity = v; }
    public int getRainfallDuration() { return rainfallDuration; }
    public void setRainfallDuration(int v) { this.rainfallDuration = v; }
    public double getDrainageBlockage() { return drainageBlockage; }
    public void setDrainageBlockage(double v) { this.drainageBlockage = v; }
    public double getImperviousness() { return imperviousness; }
    public void setImperviousness(double v) { this.imperviousness = v; }
}
