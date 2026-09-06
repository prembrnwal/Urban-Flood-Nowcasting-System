package com.floodnowcast.repository;

import com.floodnowcast.entity.FloodPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface FloodPredictionRepository extends JpaRepository<FloodPrediction, Long> {
    List<FloodPrediction> findByForecastMinute(Integer forecastMinute);
    Optional<FloodPrediction> findByStreetIdAndForecastMinute(Long streetId, Integer forecastMinute);
    List<FloodPrediction> findByStreetId(Long streetId);
    List<FloodPrediction> findByRiskLevelIn(List<FloodPrediction.RiskLevel> levels);
}
