package com.floodnowcast.simulation;

import com.floodnowcast.entity.DrainageEdge;
import com.floodnowcast.entity.DrainageNode;
import com.floodnowcast.repository.DrainageEdgeRepository;
import com.floodnowcast.repository.DrainageNodeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Drainage Graph Engine — directed graph flow simulation.
 * Propagates runoff from upstream inlets to downstream outfalls.
 */
@Component
public class DrainageGraphEngine {

    private static final Logger log = LoggerFactory.getLogger(DrainageGraphEngine.class);

    private final DrainageNodeRepository nodeRepository;
    private final DrainageEdgeRepository edgeRepository;

    public DrainageGraphEngine(DrainageNodeRepository nodeRepository, DrainageEdgeRepository edgeRepository) {
        this.nodeRepository = nodeRepository;
        this.edgeRepository = edgeRepository;
    }

    public Map<String, NodeFlowResult> simulate(double rainfallMmPerHour, double globalBlockagePct) {
        List<DrainageNode> nodes = nodeRepository.findAll();
        List<DrainageEdge> edges = edgeRepository.findAll();

        Map<String, List<DrainageEdge>> adjacency = new HashMap<>();
        Map<String, List<DrainageEdge>> inboundEdges = new HashMap<>();
        for (DrainageNode n : nodes) {
            adjacency.put(n.getId(), new ArrayList<>());
            inboundEdges.put(n.getId(), new ArrayList<>());
        }
        for (DrainageEdge e : edges) {
            adjacency.computeIfAbsent(e.getSourceNodeId(), k -> new ArrayList<>()).add(e);
            inboundEdges.computeIfAbsent(e.getDestinationNodeId(), k -> new ArrayList<>()).add(e);
        }

        List<String> order = topologicalSort(nodes, inboundEdges, adjacency);
        Map<String, Double> accumulatedFlow = new HashMap<>();
        Map<String, NodeFlowResult> results = new LinkedHashMap<>();

        double rainfallContributionPerNode = rainfallMmPerHour / 3600.0 * 500.0;

        for (String nodeId : order) {
            DrainageNode node = nodes.stream()
                    .filter(n -> n.getId().equals(nodeId))
                    .findFirst().orElse(null);
            if (node == null) continue;

            double localInflow = rainfallContributionPerNode;
            double upstreamFlow = 0.0;
            for (DrainageEdge inbound : inboundEdges.getOrDefault(nodeId, Collections.emptyList())) {
                upstreamFlow += accumulatedFlow.getOrDefault(inbound.getSourceNodeId(), 0.0);
            }

            double totalFlow = localInflow + upstreamFlow;
            double nodeBlockageFraction = (node.getBlockagePercentage() != null
                    ? node.getBlockagePercentage() / 100.0 : 0.0) + globalBlockagePct;
            nodeBlockageFraction = Math.min(nodeBlockageFraction, 0.98);

            double capacity = node.getCapacity() != null ? node.getCapacity() : 5.0;
            double effectiveCapacity = capacity * (1.0 - nodeBlockageFraction);

            double outflow = Math.min(totalFlow, effectiveCapacity);
            double overflow = Math.max(0.0, totalFlow - effectiveCapacity);
            double utilization = (capacity > 0) ? (totalFlow / capacity) * 100.0 : 999.0;

            DrainageNode.NodeStatus status;
            if (nodeBlockageFraction > 0.7) status = DrainageNode.NodeStatus.BLOCKED;
            else if (utilization > 120) status = DrainageNode.NodeStatus.OVERLOADED;
            else if (utilization > 85) status = DrainageNode.NodeStatus.WARNING;
            else status = DrainageNode.NodeStatus.NORMAL;

            accumulatedFlow.put(nodeId, outflow);
            results.put(nodeId, new NodeFlowResult(
                    nodeId, totalFlow, effectiveCapacity, capacity,
                    overflow, utilization, nodeBlockageFraction * 100.0, status, overflow > 0
            ));
        }
        return results;
    }

    private List<String> topologicalSort(List<DrainageNode> nodes,
                                          Map<String, List<DrainageEdge>> inbound,
                                          Map<String, List<DrainageEdge>> adjacency) {
        Map<String, Integer> inDegree = new HashMap<>();
        for (DrainageNode n : nodes) {
            inDegree.put(n.getId(), inbound.getOrDefault(n.getId(), Collections.emptyList()).size());
        }
        Queue<String> queue = new LinkedList<>();
        for (Map.Entry<String, Integer> e : inDegree.entrySet()) {
            if (e.getValue() == 0) queue.add(e.getKey());
        }
        List<String> sorted = new ArrayList<>();
        while (!queue.isEmpty()) {
            String cur = queue.poll();
            sorted.add(cur);
            for (DrainageEdge edge : adjacency.getOrDefault(cur, Collections.emptyList())) {
                String dest = edge.getDestinationNodeId();
                int newDeg = inDegree.getOrDefault(dest, 0) - 1;
                inDegree.put(dest, newDeg);
                if (newDeg == 0) queue.add(dest);
            }
        }
        for (DrainageNode n : nodes) {
            if (!sorted.contains(n.getId())) sorted.add(n.getId());
        }
        return sorted;
    }

    public record NodeFlowResult(
            String nodeId,
            double totalFlow,
            double effectiveCapacity,
            double designCapacity,
            double overflowVolume,
            double utilizationPct,
            double blockagePct,
            DrainageNode.NodeStatus status,
            boolean surcharging
    ) {}
}
