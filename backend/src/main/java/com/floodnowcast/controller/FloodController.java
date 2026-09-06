package com.floodnowcast.controller;

import com.floodnowcast.dto.FloodZoneDto;
import com.floodnowcast.service.AlertService;
import com.floodnowcast.service.FloodSimulationService;
import com.floodnowcast.service.RainfallService;
import com.floodnowcast.simulation.DrainageGraphEngine;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flood")
@Tag(name = "Flood", description = "Flood prediction and zone APIs")
public class FloodController {

    private final FloodSimulationService floodSimulationService;
    private final AlertService alertService;
    private final RainfallService rainfallService;
    private final DrainageGraphEngine drainageGraphEngine;

    @org.springframework.beans.factory.annotation.Autowired
    public FloodController(FloodSimulationService floodSimulationService,
                            AlertService alertService,
                            RainfallService rainfallService,
                            DrainageGraphEngine drainageGraphEngine) {
        this.floodSimulationService = floodSimulationService;
        this.alertService = alertService;
        this.rainfallService = rainfallService;
        this.drainageGraphEngine = drainageGraphEngine;
    }

    @GetMapping("/zones")
    @Operation(summary = "Get flood zones for all streets at forecast minute")
    public ResponseEntity<List<FloodZoneDto>> getFloodZones(@RequestParam(defaultValue = "0") int minute) {
        List<FloodZoneDto> zones = floodSimulationService.getFloodZones(minute);
        alertService.generateAlerts(zones, drainageGraphEngine, rainfallService.getCurrentRainfall(), 0.0);
        return ResponseEntity.ok(zones);
    }

    @GetMapping("/forecast")
    @Operation(summary = "Get aggregated flood forecast")
    public ResponseEntity<Map<String, Object>> getFloodForecast(@RequestParam(defaultValue = "60") int minute) {
        List<FloodZoneDto> zones = floodSimulationService.getFloodZones(minute);
        long flooded = zones.stream().filter(z -> z.getWaterDepthCm() > 5.0).count();
        long critical = zones.stream().filter(z -> z.getRiskLevel() != null &&
                (z.getRiskLevel().name().equals("HIGH") || z.getRiskLevel().name().equals("CRITICAL"))).count();
        double maxDepth = zones.stream().mapToDouble(FloodZoneDto::getWaterDepthCm).max().orElse(0.0);
        return ResponseEntity.ok(Map.of(
                "forecastMinute", minute,
                "floodedStreets", flooded,
                "criticalZones", critical,
                "maximumDepthCm", Math.round(maxDepth * 10.0) / 10.0,
                "populationAtRisk", flooded * 450L,
                "zonesCount", zones.size()
        ));
    }

    @GetMapping("/streets/{streetId}")
    @Operation(summary = "Get detailed flood forecast for a specific street")
    public ResponseEntity<Map<String, Object>> getStreetForecast(@PathVariable Long streetId) {
        return ResponseEntity.ok(floodSimulationService.getStreetForecast(streetId));
    }

    @PostMapping("/update-params")
    @Operation(summary = "Update simulation parameters")
    public ResponseEntity<String> updateParams(@RequestParam(required = false) Double blockage,
                                                @RequestParam(required = false) Double imperviousness) {
        if (blockage != null) floodSimulationService.setCurrentBlockage(blockage / 100.0);
        if (imperviousness != null) floodSimulationService.setCurrentImperviousness(imperviousness);
        return ResponseEntity.ok("Parameters updated");
    }
}
