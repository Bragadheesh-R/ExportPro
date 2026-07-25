package com.exportpro.backend.controller;

import com.exportpro.backend.model.Car;
import com.exportpro.backend.model.CarImage;
import com.exportpro.backend.model.CarStatus;
import com.exportpro.backend.repository.CarImageRepository;
import com.exportpro.backend.repository.CarRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.exportpro.backend.model.RepairRecord;
import com.exportpro.backend.repository.RepairRecordRepository;

@RestController
@RequestMapping("/api/public/cars")
public class PublicCarController {

    private final CarRepository carRepository;
    private final CarImageRepository carImageRepository;
    private final RepairRecordRepository repairRecordRepository;

    public PublicCarController(CarRepository carRepository, CarImageRepository carImageRepository,
            RepairRecordRepository repairRecordRepository) {
        this.carRepository = carRepository;
        this.carImageRepository = carImageRepository;
        this.repairRecordRepository = repairRecordRepository;
    }

    @GetMapping
    public ResponseEntity<List<Car>> getAvailableCars() {
        return ResponseEntity.ok(carRepository.findByStatus(CarStatus.AVAILABLE));
    }

    @GetMapping("/{id}/repairs")
    public ResponseEntity<List<RepairRecord>> getCarRepairs(@PathVariable Long id) {
        return ResponseEntity.ok(repairRecordRepository.findByCarId(id));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCarDetails(@PathVariable Long id) {
        return carRepository.findById(id)
                .filter(car -> car.getStatus() == CarStatus.AVAILABLE)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<CarImage>> getCarImages(@PathVariable Long id) {
        return ResponseEntity.ok(carImageRepository.findByCarId(id));
    }
}