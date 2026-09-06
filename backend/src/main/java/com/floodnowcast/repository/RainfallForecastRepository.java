package com.floodnowcast.repository;

import com.floodnowcast.entity.RainfallForecast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RainfallForecastRepository extends JpaRepository<RainfallForecast, Long> {
    Optional<RainfallForecast> findByMinute(Integer minute);
}
