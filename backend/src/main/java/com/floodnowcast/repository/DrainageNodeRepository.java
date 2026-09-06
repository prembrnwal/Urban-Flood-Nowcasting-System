package com.floodnowcast.repository;

import com.floodnowcast.entity.DrainageNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DrainageNodeRepository extends JpaRepository<DrainageNode, String> {
    List<DrainageNode> findByStatus(DrainageNode.NodeStatus status);
    List<DrainageNode> findByBlockagePercentageGreaterThan(Double blockage);
}
