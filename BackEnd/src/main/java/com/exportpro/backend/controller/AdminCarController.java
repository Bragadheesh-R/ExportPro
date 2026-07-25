package com.exportpro.backend.controller;

import com.exportpro.backend.dto.CarRequest;
import com.exportpro.backend.model.Car;
import com.exportpro.backend.model.CarStatus;
import com.exportpro.backend.model.Port;
import com.exportpro.backend.repository.CarRepository;
import com.exportpro.backend.repository.PortRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/cars")
public class AdminCarController {

    private final CarRepository carRepository;
    private final PortRepository portRepository;

    public AdminCarController(CarRepository carRepository, PortRepository portRepository) {
        this.carRepository = carRepository;
        this.portRepository = portRepository;
    }

    @PostMapping
    public ResponseEntity<?> createCar(@RequestBody CarRequest request) {
        Port port = portRepository.findById(request.getPortId())
                .orElseThrow(() -> new RuntimeException("Port not found"));

        Car car = new Car();
        car.setMake(request.getMake());
        car.setModel(request.getModel());
        car.setYear(request.getYear());
        car.setPrice(request.getPrice());
        car.setMileage(request.getMileage());
        car.setCondition(request.getCondition());
        car.setVin(request.getVin());
        car.setStatus(CarStatus.AVAILABLE);
        car.setShippingPort(port);

        Car saved = carRepository.save(car);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Car>> getAllCars() {
        return ResponseEntity.ok(carRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCar(@PathVariable Long id) {
        return carRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCar(@PathVariable Long id, @RequestBody CarRequest request) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        Port port = portRepository.findById(request.getPortId())
                .orElseThrow(() -> new RuntimeException("Port not found"));

        car.setMake(request.getMake());
        car.setModel(request.getModel());
        car.setYear(request.getYear());
        car.setPrice(request.getPrice());
        car.setMileage(request.getMileage());
        car.setCondition(request.getCondition());
        car.setVin(request.getVin());
        car.setShippingPort(port);

        return ResponseEntity.ok(carRepository.save(car));
    }

    @PutMapping("/{id}/mark-sold")
    public ResponseEntity<?> markSold(@PathVariable Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));
        car.setStatus(CarStatus.SOLD);
        return ResponseEntity.ok(carRepository.save(car));
    }

    @PutMapping("/{id}/mark-available")
    public ResponseEntity<?> markAvailable(@PathVariable Long id) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));
        car.setStatus(CarStatus.AVAILABLE);
        return ResponseEntity.ok(carRepository.save(car));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCar(@PathVariable Long id) {
        carRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Car deleted"));
    }
}