package com.floodnowcast.repository;

import com.floodnowcast.entity.CriticalInfrastructure;
import com.floodnowcast.entity.FloodPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CriticalInfrastructureRepository extends JpaRepository<CriticalInfrastructure, Long> {
    List<CriticalInfrastructure> findByType(CriticalInfrastructure.InfraType type);
    List<CriticalInfrastructure> findByCurrentRiskLevelIn(List<FloodPrediction.RiskLevel> levels);
}

