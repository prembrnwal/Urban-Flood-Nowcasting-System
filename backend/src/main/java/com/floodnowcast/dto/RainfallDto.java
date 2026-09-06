package com.floodnowcast.dto;

import java.util.List;

public class RainfallDto {
    private Double current;
    private String unit;
    private List<ForecastPoint> forecast;

    public RainfallDto() {}

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final RainfallDto d = new RainfallDto();
        public Builder current(Double v) { d.current = v; return this; }
        public Builder unit(String v) { d.unit = v; return this; }
        public Builder forecast(List<ForecastPoint> v) { d.forecast = v; return this; }
        public RainfallDto build() { return d; }
    }

    public Double getCurrent() { return current; }
    public String getUnit() { return unit; }
    public List<ForecastPoint> getForecast() { return forecast; }

    public static class ForecastPoint {
        private Integer minute;
        private Double rainfall;
        private Double uncertainty;

        public ForecastPoint() {}

        public static FPBuilder builder() { return new FPBuilder(); }
        public static class FPBuilder {
            private final ForecastPoint p = new ForecastPoint();
            public FPBuilder minute(Integer v) { p.minute = v; return this; }
            public FPBuilder rainfall(Double v) { p.rainfall = v; return this; }
            public FPBuilder uncertainty(Double v) { p.uncertainty = v; return this; }
            public ForecastPoint build() { return p; }
        }

        public Integer getMinute() { return minute; }
        public Double getRainfall() { return rainfall; }
        public Double getUncertainty() { return uncertainty; }
    }
}
