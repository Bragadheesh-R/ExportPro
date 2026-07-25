package com.exportpro.backend.controller;

import com.exportpro.backend.dto.RepairRecordRequest;
import com.exportpro.backend.model.Car;
import com.exportpro.backend.model.RepairRecord;
import com.exportpro.backend.repository.CarRepository;
import com.exportpro.backend.repository.RepairRecordRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/cars/{carId}/repairs")
public class AdminRepairController {

    private final RepairRecordRepository repairRecordRepository;
    private final CarRepository carRepository;

    public AdminRepairController(RepairRecordRepository repairRecordRepository, CarRepository carRepository) {
        this.repairRecordRepository = repairRecordRepository;
        this.carRepository = carRepository;
    }

    @PostMapping
    public ResponseEntity<?> addRepair(@PathVariable Long carId, @RequestBody RepairRecordRequest request) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        RepairRecord repair = new RepairRecord();
        repair.setDescription(request.getDescription());
        repair.setCost(request.getCost());
        repair.setRepairDate(request.getRepairDate());
        repair.setPerformedBy(request.getPerformedBy());
        repair.setCar(car);

        return ResponseEntity.ok(repairRecordRepository.save(repair));
    }

    @GetMapping
    public ResponseEntity<List<RepairRecord>> getRepairs(@PathVariable Long carId) {
        return ResponseEntity.ok(repairRecordRepository.findByCarId(carId));
    }

    @DeleteMapping("/{repairId}")
    public ResponseEntity<?> deleteRepair(@PathVariable Long carId, @PathVariable Long repairId) {
        repairRecordRepository.deleteById(repairId);
        return ResponseEntity.ok(Map.of("message", "Repair record deleted"));
    }
}