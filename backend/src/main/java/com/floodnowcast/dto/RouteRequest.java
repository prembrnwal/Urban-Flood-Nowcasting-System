package com.floodnowcast.dto;

public class RouteRequest {
    private String source;
    private String destination;
    private String vehicleType;
    private Integer forecastMinute;

    public RouteRequest() {}
    public String getSource() { return source; }
    public void setSource(String v) { this.source = v; }
    public String getDestination() { return destination; }
    public void setDestination(String v) { this.destination = v; }
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String v) { this.vehicleType = v; }
    public Integer getForecastMinute() { return forecastMinute; }
    public void setForecastMinute(Integer v) { this.forecastMinute = v; }
}
