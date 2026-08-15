package com.exportpro.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exportpro.backend.model.Port;
import com.exportpro.backend.repository.CarRepository;
import com.exportpro.backend.repository.PortRepository;

@RestController
@RequestMapping("/api/admin/ports")
public class AdminPortController {

    private final PortRepository portRepository;
    private final CarRepository carRepository;

    public AdminPortController(PortRepository portRepository, CarRepository carRepository) {
        this.portRepository = portRepository;
        this.carRepository = carRepository;
    }

    @PostMapping
    public ResponseEntity<Port> createPort(@RequestBody Port port) {
        return ResponseEntity.ok(portRepository.save(port));
    }

    @GetMapping
    public ResponseEntity<List<Port>> getAllPorts() {
        return ResponseEntity.ok(portRepository.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePort(@PathVariable Long id) {
        boolean inUse = carRepository.findAll().stream()
                .anyMatch(car -> car.getShippingPort() != null && car.getShippingPort().getId().equals(id));

        if (inUse) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Cannot delete: one or more cars are still using this port"));
        }

        try {
            portRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Port deleted"));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Cannot delete: this port is still referenced elsewhere"));
        }
    }
}