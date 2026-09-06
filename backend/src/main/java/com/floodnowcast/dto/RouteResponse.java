package com.floodnowcast.dto;

import java.util.List;

public class RouteResponse {
    private List<String> route;
    private Double distanceKm;
    private Integer estimatedTimeMinutes;
    private String floodExposure;
    private Integer avoidedFloodedRoads;
    private List<RouteSegment> segments;

    public RouteResponse() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final RouteResponse d = new RouteResponse();
        public Builder route(List<String> v) { d.route = v; return this; }
        public Builder distanceKm(Double v) { d.distanceKm = v; return this; }
        public Builder estimatedTimeMinutes(Integer v) { d.estimatedTimeMinutes = v; return this; }
        public Builder floodExposure(String v) { d.floodExposure = v; return this; }
        public Builder avoidedFloodedRoads(Integer v) { d.avoidedFloodedRoads = v; return this; }
        public Builder segments(List<RouteSegment> v) { d.segments = v; return this; }
        public RouteResponse build() { return d; }
    }

    public List<String> getRoute() { return route; }
    public Double getDistanceKm() { return distanceKm; }
    public Integer getEstimatedTimeMinutes() { return estimatedTimeMinutes; }
    public String getFloodExposure() { return floodExposure; }
    public Integer getAvoidedFloodedRoads() { return avoidedFloodedRoads; }
    public List<RouteSegment> getSegments() { return segments; }

    public static class RouteSegment {
        private String from;
        private String to;
        private Double distanceKm;
        private String riskLevel;

        public RouteSegment() {}

        public static RSBuilder builder() { return new RSBuilder(); }
        public static class RSBuilder {
            private final RouteSegment s = new RouteSegment();
            public RSBuilder from(String v) { s.from = v; return this; }
            public RSBuilder to(String v) { s.to = v; return this; }
            public RSBuilder distanceKm(Double v) { s.distanceKm = v; return this; }
            public RSBuilder riskLevel(String v) { s.riskLevel = v; return this; }
            public RouteSegment build() { return s; }
        }

        public String getFrom() { return from; }
        public String getTo() { return to; }
        public Double getDistanceKm() { return distanceKm; }
        public String getRiskLevel() { return riskLevel; }
    }
}
