package com.floodnowcast.controller;

import com.floodnowcast.dto.DrainageNodeDto;
import com.floodnowcast.entity.DrainageEdge;
import com.floodnowcast.service.DrainageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drainage")
@Tag(name = "Drainage", description = "Drainage network APIs")
public class DrainageController {

    private final DrainageService drainageService;

    public DrainageController(DrainageService drainageService) {
        this.drainageService = drainageService;
    }

    @GetMapping("/nodes")
    @Operation(summary = "Get all drainage nodes with current flow status")
    public ResponseEntity<List<DrainageNodeDto>> getNodes() {
        return ResponseEntity.ok(drainageService.getAllNodes());
    }

    @GetMapping("/edges")
    @Operation(summary = "Get all drainage pipes/edges")
    public ResponseEntity<List<DrainageEdge>> getEdges() {
        return ResponseEntity.ok(drainageService.getAllEdges());
    }

    @GetMapping("/nodes/{id}")
    @Operation(summary = "Get single drainage node hydraulic data")
    public ResponseEntity<DrainageNodeDto> getNode(@PathVariable String id) {
        return drainageService.getNodeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
