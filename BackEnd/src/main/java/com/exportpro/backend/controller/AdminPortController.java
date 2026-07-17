package com.exportpro.backend.controller;

import com.exportpro.backend.model.Port;
import com.exportpro.backend.repository.PortRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/ports")
public class AdminPortController {

    private final PortRepository portRepository;

    public AdminPortController(PortRepository portRepository) {
        this.portRepository = portRepository;
    }

    @PostMapping
    public ResponseEntity<Port> createPort(@RequestBody Port port) {
        return ResponseEntity.ok(portRepository.save(port));
    }

    @GetMapping
    public ResponseEntity<List<Port>> getAllPorts() {
        return ResponseEntity.ok(portRepository.findAll());
    }
}