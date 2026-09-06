package com.floodnowcast.repository;

import com.floodnowcast.entity.DrainageEdge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DrainageEdgeRepository extends JpaRepository<DrainageEdge, Long> {
    List<DrainageEdge> findBySourceNodeId(String sourceNodeId);
    List<DrainageEdge> findByDestinationNodeId(String destNodeId);
}
