package com.floodnowcast.repository;

import com.floodnowcast.entity.Street;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StreetRepository extends JpaRepository<Street, Long> {
    List<Street> findByZone(String zone);
    List<Street> findByElevationLessThan(Double elevation);
}
