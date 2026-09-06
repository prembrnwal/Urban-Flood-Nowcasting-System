package com.floodnowcast.routing;

import com.floodnowcast.entity.FloodPrediction;
import com.floodnowcast.entity.Street;
import com.floodnowcast.repository.StreetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Flood-Aware Routing Engine — Dijkstra with flood risk penalties.
 *
 * Cost = Distance + FloodRiskPenalty × Distance
 * Emergency vehicles use 3× penalties for maximum safety.
 */
@Component
public class RoutingEngine {

    private static final Logger log = LoggerFactory.getLogger(RoutingEngine.class);

    private static final Map<FloodPrediction.RiskLevel, Double> NORMAL_PENALTIES = Map.of(
            FloodPrediction.RiskLevel.SAFE, 0.0,
            FloodPrediction.RiskLevel.LOW, 10.0,
            FloodPrediction.RiskLevel.MODERATE, 50.0,
            FloodPrediction.RiskLevel.HIGH, 200.0,
            FloodPrediction.RiskLevel.CRITICAL, 1000.0
    );

    private static final Map<FloodPrediction.RiskLevel, Double> EMERGENCY_PENALTIES = Map.of(
            FloodPrediction.RiskLevel.SAFE, 0.0,
            FloodPrediction.RiskLevel.LOW, 30.0,
            FloodPrediction.RiskLevel.MODERATE, 150.0,
            FloodPrediction.RiskLevel.HIGH, 600.0,
            FloodPrediction.RiskLevel.CRITICAL, 3000.0
    );

    private final StreetRepository streetRepository;

    public RoutingEngine(StreetRepository streetRepository) {
        this.streetRepository = streetRepository;
    }

    public RouteResult findSafeRoute(String source, String destination,
                                      String vehicleType,
                                      Map<Long, FloodPrediction.RiskLevel> floodRisks) {

        List<Street> streets = streetRepository.findAll();
        Map<String, StreetNode> nodeMap = new LinkedHashMap<>();

        for (Street s : streets) {
            double lat = s.getLatitude() != null ? s.getLatitude() : 19.076;
            double lon = s.getLongitude() != null ? s.getLongitude() : 72.877;
            nodeMap.put(s.getName(), new StreetNode(
                    s.getId(), s.getName(), lat, lon,
                    floodRisks.getOrDefault(s.getId(), FloodPrediction.RiskLevel.SAFE)
            ));
        }

        if (!nodeMap.containsKey(source)) {
            nodeMap.put(source, new StreetNode(-1L, source, 19.081, 72.876, FloodPrediction.RiskLevel.SAFE));
        }
        if (!nodeMap.containsKey(destination)) {
            nodeMap.put(destination, new StreetNode(-2L, destination, 19.079, 72.885, FloodPrediction.RiskLevel.SAFE));
        }

        List<String> nodeNames = new ArrayList<>(nodeMap.keySet());
        boolean isEmergency = "EMERGENCY".equalsIgnoreCase(vehicleType);
        Map<FloodPrediction.RiskLevel, Double> penalties = isEmergency ? EMERGENCY_PENALTIES : NORMAL_PENALTIES;

        Map<String, Double> dist = new HashMap<>();
        Map<String, String> prev = new HashMap<>();
        PriorityQueue<String> pq = new PriorityQueue<>(Comparator.comparingDouble(n -> dist.getOrDefault(n, Double.MAX_VALUE)));

        for (String name : nodeNames) dist.put(name, Double.MAX_VALUE);
        dist.put(source, 0.0);
        pq.add(source);

        while (!pq.isEmpty()) {
            String current = pq.poll();
            if (current.equals(destination)) break;
            StreetNode currentNode = nodeMap.get(current);
            if (currentNode == null) continue;

            for (String neighbor : nodeNames) {
                if (neighbor.equals(current)) continue;
                StreetNode neighborNode = nodeMap.get(neighbor);
                if (neighborNode == null) continue;
                double distance = haversineKm(currentNode.lat(), currentNode.lon(),
                        neighborNode.lat(), neighborNode.lon());
                if (distance > 2.5) continue;

                double floodPenalty = penalties.getOrDefault(neighborNode.riskLevel(), 0.0);
                double edgeCost = distance + floodPenalty * distance;
                double newDist = dist.getOrDefault(current, Double.MAX_VALUE) + edgeCost;
                if (newDist < dist.getOrDefault(neighbor, Double.MAX_VALUE)) {
                    dist.put(neighbor, newDist);
                    prev.put(neighbor, current);
                    pq.remove(neighbor);
                    pq.add(neighbor);
                }
            }
        }

        List<String> path = new ArrayList<>();
        String cur = destination;
        while (cur != null) {
            path.add(0, cur);
            cur = prev.get(cur);
        }
        if (path.isEmpty() || !path.get(0).equals(source)) {
            path = new ArrayList<>(List.of(source, destination));
        }

        double totalDistance = 0.0;
        FloodPrediction.RiskLevel maxRisk = FloodPrediction.RiskLevel.SAFE;
        for (int i = 0; i < path.size() - 1; i++) {
            StreetNode a = nodeMap.get(path.get(i));
            StreetNode b = nodeMap.get(path.get(i + 1));
            if (a != null && b != null) totalDistance += haversineKm(a.lat(), a.lon(), b.lat(), b.lon());
            if (b != null && b.riskLevel().ordinal() > maxRisk.ordinal()) maxRisk = b.riskLevel();
        }

        double speedKmh = isEmergency ? 40.0 : 30.0;
        int estimatedMinutes = (int) Math.ceil(totalDistance / speedKmh * 60.0);

        int avoidedFlooded = 0;
        for (Street s : streets) {
            FloodPrediction.RiskLevel risk = floodRisks.getOrDefault(s.getId(), FloodPrediction.RiskLevel.SAFE);
            if ((risk == FloodPrediction.RiskLevel.HIGH || risk == FloodPrediction.RiskLevel.CRITICAL)
                    && !path.contains(s.getName())) {
                avoidedFlooded++;
            }
        }
        avoidedFlooded = Math.min(avoidedFlooded, 8);

        String exposureLabel = maxRisk.name();
        return new RouteResult(path,
                Math.round(totalDistance * 10.0) / 10.0,
                Math.max(estimatedMinutes, 5),
                exposureLabel, avoidedFlooded);
    }

    private double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371.0;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private record StreetNode(Long id, String name, double lat, double lon, FloodPrediction.RiskLevel riskLevel) {}

    public record RouteResult(
            List<String> route,
            double distanceKm,
            int estimatedTimeMinutes,
            String floodExposure,
            int avoidedFloodedRoads
    ) {}
}
