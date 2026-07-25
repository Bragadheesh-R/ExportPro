package com.exportpro.backend.controller;

import com.exportpro.backend.model.Car;
import com.exportpro.backend.model.CarImage;
import com.exportpro.backend.model.CarStatus;
import com.exportpro.backend.repository.CarImageRepository;
import com.exportpro.backend.repository.CarRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/public/cars")
public class PublicCarController {

    private final CarRepository carRepository;
    private final CarImageRepository carImageRepository;

    public PublicCarController(CarRepository carRepository, CarImageRepository carImageRepository) {
        this.carRepository = carRepository;
        this.carImageRepository = carImageRepository;
    }

    @GetMapping
    public ResponseEntity<List<Car>> getAvailableCars() {
        return ResponseEntity.ok(carRepository.findByStatus(CarStatus.AVAILABLE));
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