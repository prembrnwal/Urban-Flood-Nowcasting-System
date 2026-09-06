package com.floodnowcast.dto;

public class SimulationResponse {
    private Double maximumDepth;
    private Integer affectedRoads;
    private Integer criticalZones;
    private Integer drainOverflows;
    private Integer populationAtRisk;
    private Integer warningLeadTime;
    private Double totalRunoffM3;
    private String scenarioDescription;

    public SimulationResponse() {}
    public Double getMaximumDepth() { return maximumDepth; }
    public void setMaximumDepth(Double v) { this.maximumDepth = v; }
    public Integer getAffectedRoads() { return affectedRoads; }
    public void setAffectedRoads(Integer v) { this.affectedRoads = v; }
    public Integer getCriticalZones() { return criticalZones; }
    public void setCriticalZones(Integer v) { this.criticalZones = v; }
    public Integer getDrainOverflows() { return drainOverflows; }
    public void setDrainOverflows(Integer v) { this.drainOverflows = v; }
    public Integer getPopulationAtRisk() { return populationAtRisk; }
    public void setPopulationAtRisk(Integer v) { this.populationAtRisk = v; }
    public Integer getWarningLeadTime() { return warningLeadTime; }
    public void setWarningLeadTime(Integer v) { this.warningLeadTime = v; }
    public Double getTotalRunoffM3() { return totalRunoffM3; }
    public void setTotalRunoffM3(Double v) { this.totalRunoffM3 = v; }
    public String getScenarioDescription() { return scenarioDescription; }
    public void setScenarioDescription(String v) { this.scenarioDescription = v; }
}
