package com.floodnowcast.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rainfall_forecast")
public class RainfallForecast {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "forecast_minute")
    private Integer minute;
    private Double rainfall;
    private Double uncertainty;
    private String forecastType;
    private LocalDateTime createdAt;

    public RainfallForecast() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getMinute() { return minute; }
    public void setMinute(Integer minute) { this.minute = minute; }
    public Double getRainfall() { return rainfall; }
    public void setRainfall(Double rainfall) { this.rainfall = rainfall; }
    public Double getUncertainty() { return uncertainty; }
    public void setUncertainty(Double uncertainty) { this.uncertainty = uncertainty; }
    public String getForecastType() { return forecastType; }
    public void setForecastType(String forecastType) { this.forecastType = forecastType; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
