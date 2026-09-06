package com.floodnowcast.service;

import com.floodnowcast.dto.FloodZoneDto;
import com.floodnowcast.dto.RouteRequest;
import com.floodnowcast.dto.RouteResponse;
import com.floodnowcast.entity.FloodPrediction;
import com.floodnowcast.routing.RoutingEngine;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RoutingService {

    private final RoutingEngine routingEngine;
    private final FloodSimulationService floodSimulationService;

    public RoutingService(RoutingEngine routingEngine, FloodSimulationService floodSimulationService) {
        this.routingEngine = routingEngine;
        this.floodSimulationService = floodSimulationService;
    }

    public RouteResponse findSafeRoute(RouteRequest request) {
        int minute = request.getForecastMinute() != null ? request.getForecastMinute() : 0;
        List<FloodZoneDto> floodZones = floodSimulationService.getFloodZones(minute);
        Map<Long, FloodPrediction.RiskLevel> floodRisks = floodZones.stream()
                .collect(Collectors.toMap(FloodZoneDto::getStreetId, FloodZoneDto::getRiskLevel, (a, b) -> a));

        RoutingEngine.RouteResult result = routingEngine.findSafeRoute(
                request.getSource(), request.getDestination(), request.getVehicleType(), floodRisks);

        List<RouteResponse.RouteSegment> segments = new ArrayList<>();
        List<String> route = result.route();
        for (int i = 0; i < route.size() - 1; i++) {
            String to = route.get(i + 1);
            String risk = floodZones.stream()
                    .filter(z -> z.getStreetName().equals(to))
                    .map(z -> z.getRiskLevel().name())
                    .findFirst().orElse("SAFE");
            segments.add(RouteResponse.RouteSegment.builder()
                    .from(route.get(i)).to(to)
                    .distanceKm(Math.round(result.distanceKm() / Math.max(route.size() - 1, 1) * 10.0) / 10.0)
                    .riskLevel(risk).build());
        }

        return RouteResponse.builder()
                .route(result.route())
                .distanceKm(result.distanceKm())
                .estimatedTimeMinutes(result.estimatedTimeMinutes())
                .floodExposure(result.floodExposure())
                .avoidedFloodedRoads(result.avoidedFloodedRoads())
                .segments(segments)
                .build();
    }
}
