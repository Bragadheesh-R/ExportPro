package com.exportpro.backend.controller;

import com.exportpro.backend.dto.AdminInquiryResponse;
import com.exportpro.backend.dto.ReplyRequest;
import com.exportpro.backend.model.Inquiry;
import com.exportpro.backend.repository.InquiryRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/inquiries")
public class AdminInquiryController {

    private final InquiryRepository inquiryRepository;

    public AdminInquiryController(InquiryRepository inquiryRepository) {
        this.inquiryRepository = inquiryRepository;
    }

    @GetMapping
    public ResponseEntity<List<AdminInquiryResponse>> getAllInquiries() {
        return ResponseEntity.ok(
            inquiryRepository.findAll().stream()
                .map(AdminInquiryResponse::new)
                .toList()
        );
    }

    @GetMapping("/car/{carId}")
    public ResponseEntity<List<AdminInquiryResponse>> getInquiriesForCar(@PathVariable Long carId) {
        return ResponseEntity.ok(
            inquiryRepository.findByCarId(carId).stream()
                .map(AdminInquiryResponse::new)
                .toList()
        );
    }

    @PutMapping("/{id}/reply")
    public ResponseEntity<?> replyToInquiry(@PathVariable Long id, @Valid @RequestBody ReplyRequest request) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inquiry not found"));

        inquiry.setReply(request.getReply());
        inquiry.setRepliedAt(LocalDateTime.now());

        return ResponseEntity.ok(new AdminInquiryResponse(inquiryRepository.save(inquiry)));
    }
}