package com.floodnowcast.controller;

import com.floodnowcast.entity.CriticalInfrastructure;
import com.floodnowcast.repository.CriticalInfrastructureRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/infrastructure")
@Tag(name = "Infrastructure", description = "Critical infrastructure APIs")
public class InfrastructureController {

    private final CriticalInfrastructureRepository infraRepository;

    public InfrastructureController(CriticalInfrastructureRepository infraRepository) {
        this.infraRepository = infraRepository;
    }

    @GetMapping
    @Operation(summary = "Get all critical infrastructure locations")
    public ResponseEntity<List<CriticalInfrastructure>> getAll() {
        return ResponseEntity.ok(infraRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific infrastructure by ID")
    public ResponseEntity<CriticalInfrastructure> getById(@PathVariable Long id) {
        return infraRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}
