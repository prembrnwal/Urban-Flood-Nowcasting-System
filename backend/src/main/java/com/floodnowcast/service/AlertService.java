package com.floodnowcast.service;

import com.floodnowcast.dto.FloodZoneDto;
import com.floodnowcast.entity.Alert;
import com.floodnowcast.entity.CriticalInfrastructure;
import com.floodnowcast.entity.FloodPrediction;
import com.floodnowcast.repository.AlertRepository;
import com.floodnowcast.repository.CriticalInfrastructureRepository;
import com.floodnowcast.repository.DrainageNodeRepository;
import com.floodnowcast.simulation.DrainageGraphEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AlertService {

    private static final Logger log = LoggerFactory.getLogger(AlertService.class);

    private final AlertRepository alertRepository;
    private final CriticalInfrastructureRepository infraRepository;

    public AlertService(AlertRepository alertRepository,
                         CriticalInfrastructureRepository infraRepository,
                         DrainageNodeRepository drainageNodeRepository) {
        this.alertRepository = alertRepository;
        this.infraRepository = infraRepository;
    }

    public List<Alert> getActiveAlerts() {
        return alertRepository.findByActiveTrueOrderByTimestampDesc();
    }

    public List<Alert> generateAlerts(List<FloodZoneDto> floodZones,
                                       DrainageGraphEngine drainageGraphEngine,
                                       double rainfall, double blockage) {
        alertRepository.findByActiveTrue().forEach(a -> { a.setActive(false); alertRepository.save(a); });

        List<Alert> newAlerts = new ArrayList<>();

        for (FloodZoneDto zone : floodZones) {
            Alert alert = null;
            if (zone.getRiskLevel() == FloodPrediction.RiskLevel.CRITICAL) {
                alert = Alert.builder()
                        .severity(Alert.AlertSeverity.CRITICAL)
                        .title("CRITICAL FLOOD ALERT")
                        .location(zone.getStreetName())
                        .message(String.format("Water depth %d cm on %s. ROAD CLOSED.",
                                (int) Math.round(zone.getWaterDepthCm()), zone.getStreetName()))
                        .expectedTime("IMMEDIATE")
                        .timestamp(LocalDateTime.now()).active(true)
                        .streetId(zone.getStreetId()).build();
            } else if (zone.getRiskLevel() == FloodPrediction.RiskLevel.HIGH) {
                alert = Alert.builder()
                        .severity(Alert.AlertSeverity.HIGH)
                        .title("HIGH FLOOD ALERT")
                        .location(zone.getStreetName())
                        .message(String.format("Water depth %d cm on %s. Risk to vehicles.",
                                (int) Math.round(zone.getWaterDepthCm()), zone.getStreetName()))
                        .expectedTime("NOW")
                        .timestamp(LocalDateTime.now()).active(true)
                        .streetId(zone.getStreetId()).build();
            } else if (zone.getDrainUtilization() != null && zone.getDrainUtilization() > 100.0) {
                alert = Alert.builder()
                        .severity(Alert.AlertSeverity.WARNING)
                        .title("DRAINAGE OVERFLOW")
                        .location(zone.getStreetName())
                        .message(String.format("Drain utilization %d%% on %s.",
                                (int) Math.round(zone.getDrainUtilization()), zone.getStreetName()))
                        .expectedTime("15-30 min")
                        .timestamp(LocalDateTime.now()).active(true)
                        .streetId(zone.getStreetId()).build();
            }
            if (alert != null) newAlerts.add(alertRepository.save(alert));
        }

        if (rainfall > 80) {
            newAlerts.add(alertRepository.save(Alert.builder()
                    .severity(Alert.AlertSeverity.CRITICAL).title("EXTREME RAINFALL WARNING")
                    .location("City-wide")
                    .message(String.format("Rainfall %.0f mm/hr — flash flood risk.", rainfall))
                    .expectedTime("IMMEDIATE").timestamp(LocalDateTime.now()).active(true).build()));
        } else if (rainfall > 50) {
            newAlerts.add(alertRepository.save(Alert.builder()
                    .severity(Alert.AlertSeverity.HIGH).title("HEAVY RAINFALL WARNING")
                    .location("City-wide")
                    .message(String.format("Rainfall %.0f mm/hr — flood risk in low-lying areas.", rainfall))
                    .expectedTime("30-60 min").timestamp(LocalDateTime.now()).active(true).build()));
        }

        for (CriticalInfrastructure ci : infraRepository.findAll()) {
            if (ci.getCurrentRiskLevel() != null &&
                    (ci.getCurrentRiskLevel() == FloodPrediction.RiskLevel.HIGH ||
                     ci.getCurrentRiskLevel() == FloodPrediction.RiskLevel.CRITICAL)) {
                newAlerts.add(alertRepository.save(Alert.builder()
                        .severity(Alert.AlertSeverity.HIGH)
                        .title("CRITICAL INFRASTRUCTURE AT RISK")
                        .location(ci.getName())
                        .message(String.format("%s is in HIGH flood zone. Initiate emergency protocols.", ci.getName()))
                        .expectedTime("30 min").timestamp(LocalDateTime.now()).active(true).build()));
            }
        }

        log.info("Generated {} active alerts", newAlerts.size());
        return newAlerts;
    }
}
