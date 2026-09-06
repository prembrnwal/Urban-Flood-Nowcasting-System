package com.floodnowcast.service;

import com.floodnowcast.dto.DrainageNodeDto;
import com.floodnowcast.entity.DrainageEdge;
import com.floodnowcast.entity.DrainageNode;
import com.floodnowcast.repository.DrainageEdgeRepository;
import com.floodnowcast.repository.DrainageNodeRepository;
import com.floodnowcast.simulation.DrainageGraphEngine;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DrainageService {

    private final DrainageNodeRepository nodeRepository;
    private final DrainageEdgeRepository edgeRepository;
    private final DrainageGraphEngine graphEngine;
    private final RainfallService rainfallService;
    private volatile double globalBlockage = 0.0;

    public DrainageService(DrainageNodeRepository nodeRepository,
                            DrainageEdgeRepository edgeRepository,
                            DrainageGraphEngine graphEngine,
                            RainfallService rainfallService) {
        this.nodeRepository = nodeRepository;
        this.edgeRepository = edgeRepository;
        this.graphEngine = graphEngine;
        this.rainfallService = rainfallService;
    }

    public void setGlobalBlockage(double blockage) {
        this.globalBlockage = Math.max(0.0, Math.min(1.0, blockage));
    }

    public List<DrainageNodeDto> getAllNodes() {
        double rainfall = rainfallService.getCurrentRainfall();
        Map<String, DrainageGraphEngine.NodeFlowResult> results = graphEngine.simulate(rainfall, globalBlockage);
        return nodeRepository.findAll().stream()
                .map(node -> toDto(node, results.get(node.getId())))
                .collect(Collectors.toList());
    }

    public List<DrainageEdge> getAllEdges() {
        return edgeRepository.findAll();
    }

    public Optional<DrainageNodeDto> getNodeById(String id) {
        double rainfall = rainfallService.getCurrentRainfall();
        Map<String, DrainageGraphEngine.NodeFlowResult> results = graphEngine.simulate(rainfall, globalBlockage);
        return nodeRepository.findById(id).map(node -> toDto(node, results.get(node.getId())));
    }

    public List<DrainageNodeDto> getNodesWithScenario(double rainfall, double blockageFraction) {
        Map<String, DrainageGraphEngine.NodeFlowResult> results = graphEngine.simulate(rainfall, blockageFraction);
        return nodeRepository.findAll().stream()
                .map(node -> toDto(node, results.get(node.getId())))
                .collect(Collectors.toList());
    }

    private DrainageNodeDto toDto(DrainageNode node, DrainageGraphEngine.NodeFlowResult flowResult) {
        double flow, capacity, utilization, overflow, blockage;
        DrainageNode.NodeStatus status;
        boolean surcharging;

        if (flowResult != null) {
            flow = flowResult.totalFlow();
            capacity = flowResult.designCapacity();
            utilization = flowResult.utilizationPct();
            overflow = flowResult.overflowVolume();
            blockage = flowResult.blockagePct();
            status = flowResult.status();
            surcharging = flowResult.surcharging();
        } else {
            flow = node.getCurrentFlow() != null ? node.getCurrentFlow() : 1.5;
            capacity = node.getCapacity() != null ? node.getCapacity() : 5.0;
            utilization = capacity > 0 ? (flow / capacity) * 100.0 : 0.0;
            overflow = 0.0;
            blockage = node.getBlockagePercentage() != null ? node.getBlockagePercentage() : 0.0;
            status = node.getStatus() != null ? node.getStatus() : DrainageNode.NodeStatus.NORMAL;
            surcharging = false;
        }

        String backflowRisk = utilization > 100 ? "HIGH" : utilization > 85 ? "MODERATE" : "LOW";

        return DrainageNodeDto.builder()
                .id(node.getId())
                .name(node.getName())
                .latitude(node.getLatitude())
                .longitude(node.getLongitude())
                .flow(Math.round(flow * 10.0) / 10.0)
                .capacity(Math.round(capacity * 10.0) / 10.0)
                .utilization(Math.round(utilization * 10.0) / 10.0)
                .blockage(Math.round(blockage * 10.0) / 10.0)
                .overflow(Math.round(overflow * 10.0) / 10.0)
                .status(status)
                .backflowRisk(backflowRisk)
                .surcharging(surcharging)
                .build();
    }
}
