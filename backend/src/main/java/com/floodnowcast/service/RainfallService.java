package com.floodnowcast.service;

import com.floodnowcast.dto.RainfallDto;
import com.floodnowcast.entity.RainfallForecast;
import com.floodnowcast.repository.RainfallForecastRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RainfallService {

    private final RainfallForecastRepository rainfallForecastRepository;
    private volatile double currentRainfall = 0.0;

    public RainfallService(RainfallForecastRepository rainfallForecastRepository) {
        this.rainfallForecastRepository = rainfallForecastRepository;
    }

    public double getCurrentRainfall() { return currentRainfall; }

    public void setCurrentRainfall(double rainfall) {
        this.currentRainfall = Math.max(0, Math.min(300, rainfall));
    }

    public RainfallDto getRainfallData() {
        List<RainfallForecast> forecasts = rainfallForecastRepository.findAll().stream()
                .filter(f -> f != null && f.getMinute() != null)
                .sorted((a, b) -> Integer.compare(a.getMinute(), b.getMinute()))
                .collect(Collectors.toList());

        List<RainfallDto.ForecastPoint> points = forecasts.stream()
                .map(f -> RainfallDto.ForecastPoint.builder()
                        .minute(f.getMinute())
                        .rainfall(f.getRainfall())
                        .uncertainty(f.getUncertainty())
                        .build())
                .collect(Collectors.toList());

        return RainfallDto.builder()
                .current(currentRainfall)
                .unit("mm/hr")
                .forecast(points)
                .build();
    }

    public double getRainfallAtMinute(int minute) {
        List<RainfallForecast> forecasts = rainfallForecastRepository.findAll().stream()
                .filter(f -> f != null && f.getMinute() != null && f.getRainfall() != null)
                .sorted((a, b) -> Integer.compare(a.getMinute(), b.getMinute()))
                .collect(Collectors.toList());

        if (forecasts.isEmpty()) return currentRainfall;

        RainfallForecast prev = null, next = null;
        for (RainfallForecast f : forecasts) {
            if (f.getMinute() <= minute) prev = f;
            if (f.getMinute() >= minute && next == null) next = f;
        }

        if (prev == null) return forecasts.get(0).getRainfall();
        if (next == null) return forecasts.get(forecasts.size() - 1).getRainfall();
        if (prev.getMinute().equals(next.getMinute())) return prev.getRainfall();

        double ratio = (double)(minute - prev.getMinute()) / (next.getMinute() - prev.getMinute());
        return prev.getRainfall() + ratio * (next.getRainfall() - prev.getRainfall());
    }
}
