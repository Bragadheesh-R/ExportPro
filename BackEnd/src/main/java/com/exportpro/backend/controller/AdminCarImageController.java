package com.exportpro.backend.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.exportpro.backend.dto.CarImageRequest;
import com.exportpro.backend.model.Car;
import com.exportpro.backend.model.CarImage;
import com.exportpro.backend.repository.CarImageRepository;
import com.exportpro.backend.repository.CarRepository;
import com.exportpro.backend.service.FileStorageService;

@RestController
@RequestMapping("/api/admin/cars/{carId}/images")
public class AdminCarImageController {

    private final CarImageRepository carImageRepository;
    private final CarRepository carRepository;
    private final FileStorageService fileStorageService;

    public AdminCarImageController(CarImageRepository carImageRepository, CarRepository carRepository,
                                    FileStorageService fileStorageService) {
        this.carImageRepository = carImageRepository;
        this.carRepository = carRepository;
        this.fileStorageService = fileStorageService;
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

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@PathVariable Long carId,
                                          @RequestParam("file") MultipartFile file,
                                          @RequestParam(value = "isMain", defaultValue = "false") Boolean isMain) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        try {
            String path = fileStorageService.store(file);

            CarImage image = new CarImage();
            image.setImageUrl(path);
            image.setIsMain(isMain);
            image.setCar(car);

            return ResponseEntity.ok(carImageRepository.save(image));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to upload image"));
        }
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