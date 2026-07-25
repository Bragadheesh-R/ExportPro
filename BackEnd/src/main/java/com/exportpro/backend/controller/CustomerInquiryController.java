package com.exportpro.backend.controller;

import com.exportpro.backend.dto.InquiryRequest;
import com.exportpro.backend.model.Car;
import com.exportpro.backend.model.Inquiry;
import com.exportpro.backend.model.User;
import com.exportpro.backend.repository.CarRepository;
import com.exportpro.backend.repository.InquiryRepository;
import com.exportpro.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer/inquiries")
public class CustomerInquiryController {

    private final InquiryRepository inquiryRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public CustomerInquiryController(InquiryRepository inquiryRepository,
                                      CarRepository carRepository,
                                      UserRepository userRepository) {
        this.inquiryRepository = inquiryRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createInquiry(@RequestBody InquiryRequest request, Authentication authentication) {
        String email = authentication.getName();
        User customer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        Inquiry inquiry = new Inquiry();
        inquiry.setCar(car);
        inquiry.setCustomer(customer);
        inquiry.setMessage(request.getMessage());

        return ResponseEntity.ok(inquiryRepository.save(inquiry));
    }
}