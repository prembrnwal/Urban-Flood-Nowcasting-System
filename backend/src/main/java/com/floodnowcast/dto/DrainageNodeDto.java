package com.floodnowcast.dto;

import com.floodnowcast.entity.DrainageNode;

public class DrainageNodeDto {
    private String id;
    private String name;
    private Double latitude;
    private Double longitude;
    private Double flow;
    private Double capacity;
    private Double utilization;
    private Double blockage;
    private Double overflow;
    private DrainageNode.NodeStatus status;
    private String backflowRisk;
    private Boolean surcharging;

    public DrainageNodeDto() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final DrainageNodeDto d = new DrainageNodeDto();
        public Builder id(String v) { d.id = v; return this; }
        public Builder name(String v) { d.name = v; return this; }
        public Builder latitude(Double v) { d.latitude = v; return this; }
        public Builder longitude(Double v) { d.longitude = v; return this; }
        public Builder flow(Double v) { d.flow = v; return this; }
        public Builder capacity(Double v) { d.capacity = v; return this; }
        public Builder utilization(Double v) { d.utilization = v; return this; }
        public Builder blockage(Double v) { d.blockage = v; return this; }
        public Builder overflow(Double v) { d.overflow = v; return this; }
        public Builder status(DrainageNode.NodeStatus v) { d.status = v; return this; }
        public Builder backflowRisk(String v) { d.backflowRisk = v; return this; }
        public Builder surcharging(Boolean v) { d.surcharging = v; return this; }
        public DrainageNodeDto build() { return d; }
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public Double getFlow() { return flow; }
    public Double getCapacity() { return capacity; }
    public Double getUtilization() { return utilization; }
    public Double getBlockage() { return blockage; }
    public Double getOverflow() { return overflow; }
    public DrainageNode.NodeStatus getStatus() { return status; }
    public String getBackflowRisk() { return backflowRisk; }
    public Boolean getSurcharging() { return surcharging; }
}
