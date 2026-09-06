package com.floodnowcast.controller;

import com.floodnowcast.dto.BlockageRequest;
import com.floodnowcast.dto.SimulationRequest;
import com.floodnowcast.service.DrainageService;
import com.floodnowcast.service.FloodSimulationService;
import com.floodnowcast.service.RainfallService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/simulation")
@Tag(name = "Simulation", description = "What-if scenario simulation APIs")
public class SimulationController {

    private final FloodSimulationService floodSimulationService;
    private final RainfallService rainfallService;
    private final DrainageService drainageService;

    public SimulationController(FloodSimulationService floodSimulationService,
                                  RainfallService rainfallService,
                                  DrainageService drainageService) {
        this.floodSimulationService = floodSimulationService;
        this.rainfallService = rainfallService;
        this.drainageService = drainageService;
    }

    @PostMapping("/run")
    @Operation(summary = "Run a what-if flood simulation scenario")
    public ResponseEntity<Map<String, Object>> runSimulation(@Valid @RequestBody SimulationRequest request) {
        rainfallService.setCurrentRainfall(request.getRainfallIntensity());
        floodSimulationService.setCurrentBlockage(request.getDrainageBlockage() / 100.0);
        if (request.getImperviousness() > 0) floodSimulationService.setCurrentImperviousness(request.getImperviousness());
        drainageService.setGlobalBlockage(request.getDrainageBlockage() / 100.0);

        Map<String, Object> result = floodSimulationService.runScenario(
                request.getRainfallIntensity(), request.getRainfallDuration(),
                request.getDrainageBlockage(),
                request.getImperviousness() > 0 ? request.getImperviousness() : 80.0
        );
        return ResponseEntity.ok(result);
    }

    @PostMapping("/blockage")
    @Operation(summary = "Simulate blockage at a specific drainage node")
    public ResponseEntity<Map<String, Object>> simulateBlockage(@Valid @RequestBody BlockageRequest request) {
        return ResponseEntity.ok(floodSimulationService.runBlockageScenario(
                request.getNodeId(), request.getBlockagePercentage(), request.getRainfallIntensity()));
    }

    @PostMapping("/reset")
    @Operation(summary = "Reset simulation to default SIH demo scenario")
    public ResponseEntity<String> resetToDefault() {
        rainfallService.setCurrentRainfall(42.0);
        floodSimulationService.setCurrentBlockage(0.0);
        floodSimulationService.setCurrentImperviousness(-100.0);
        drainageService.setGlobalBlockage(0.0);
        return ResponseEntity.ok("Reset to default scenario");
    }
}
