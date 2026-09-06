package com.floodnowcast.controller;

import com.floodnowcast.dto.RouteRequest;
import com.floodnowcast.dto.RouteResponse;
import com.floodnowcast.service.RoutingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routes")
@Tag(name = "Routing", description = "Flood-aware safe routing APIs")
public class RoutingController {

    private final RoutingService routingService;

    public RoutingController(RoutingService routingService) {
        this.routingService = routingService;
    }

    @PostMapping("/safe")
    @Operation(summary = "Find flood-safe route between two locations")
    public ResponseEntity<RouteResponse> findSafeRoute(@RequestBody RouteRequest request) {
        return ResponseEntity.ok(routingService.findSafeRoute(request));
    }
}
