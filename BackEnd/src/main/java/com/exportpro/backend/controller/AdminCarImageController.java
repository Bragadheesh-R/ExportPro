package com.exportpro.backend.controller;

import com.exportpro.backend.dto.CarImageRequest;
import com.exportpro.backend.model.Car;
import com.exportpro.backend.model.CarImage;
import com.exportpro.backend.repository.CarImageRepository;
import com.exportpro.backend.repository.CarRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/cars/{carId}/images")
public class AdminCarImageController {

    private final CarImageRepository carImageRepository;
    private final CarRepository carRepository;

    public AdminCarImageController(CarImageRepository carImageRepository, CarRepository carRepository) {
        this.carImageRepository = carImageRepository;
        this.carRepository = carRepository;
    }

    @PostMapping
    public ResponseEntity<?> addImage(@PathVariable Long carId, @RequestBody CarImageRequest request) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        CarImage image = new CarImage();
        image.setImageUrl(request.getImageUrl());
        image.setIsMain(request.getIsMain() != null ? request.getIsMain() : false);
        image.setCar(car);

        return ResponseEntity.ok(carImageRepository.save(image));
    }

    @GetMapping
    public ResponseEntity<List<CarImage>> getImages(@PathVariable Long carId) {
        return ResponseEntity.ok(carImageRepository.findByCarId(carId));
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable Long carId, @PathVariable Long imageId) {
        carImageRepository.deleteById(imageId);
        return ResponseEntity.ok(Map.of("message", "Image deleted"));
    }
}