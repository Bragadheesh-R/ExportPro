package com.exportpro.backend.repository;

import com.exportpro.backend.model.CarImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CarImageRepository extends JpaRepository<CarImage, Long> {
    List<CarImage> findByCarId(Long carId);
}