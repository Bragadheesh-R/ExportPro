package com.exportpro.backend.controller;

import com.exportpro.backend.model.Inquiry;
import com.exportpro.backend.repository.InquiryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/inquiries")
public class AdminInquiryController {

    private final InquiryRepository inquiryRepository;

    public AdminInquiryController(InquiryRepository inquiryRepository) {
        this.inquiryRepository = inquiryRepository;
    }

    @GetMapping
    public ResponseEntity<List<Inquiry>> getAllInquiries() {
        return ResponseEntity.ok(inquiryRepository.findAll());
    }

    @GetMapping("/car/{carId}")
    public ResponseEntity<List<Inquiry>> getInquiriesForCar(@PathVariable Long carId) {
        return ResponseEntity.ok(inquiryRepository.findByCarId(carId));
    }
}