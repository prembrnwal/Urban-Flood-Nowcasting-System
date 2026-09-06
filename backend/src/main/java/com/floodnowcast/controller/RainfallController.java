package com.floodnowcast.controller;

import com.floodnowcast.dto.RainfallDto;
import com.floodnowcast.service.RainfallService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rainfall")
@Tag(name = "Rainfall", description = "Rainfall nowcast and forecast APIs")
public class RainfallController {

    private final RainfallService rainfallService;

    public RainfallController(RainfallService rainfallService) {
        this.rainfallService = rainfallService;
    }

    @GetMapping("/current")
    @Operation(summary = "Get current rainfall intensity")
    public ResponseEntity<RainfallDto> getCurrent() {
        return ResponseEntity.ok(rainfallService.getRainfallData());
    }

    @GetMapping("/forecast")
    @Operation(summary = "Get rainfall forecast for 0-180 minutes")
    public ResponseEntity<RainfallDto> getForecast() {
        return ResponseEntity.ok(rainfallService.getRainfallData());
    }

    @PostMapping("/set")
    @Operation(summary = "Override current rainfall intensity (simulation control)")
    public ResponseEntity<String> setRainfall(@RequestParam double intensity) {
        rainfallService.setCurrentRainfall(intensity);
        return ResponseEntity.ok("Rainfall set to " + intensity + " mm/hr");
    }
}
