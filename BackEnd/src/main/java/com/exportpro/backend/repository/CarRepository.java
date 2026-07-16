package com.exportpro.backend.repository;

import com.exportpro.backend.model.Car;
import com.exportpro.backend.model.CarStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByStatus(CarStatus status);
}