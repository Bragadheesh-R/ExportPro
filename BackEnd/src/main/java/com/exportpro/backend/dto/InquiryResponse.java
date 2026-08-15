package com.exportpro.backend.dto;

import java.time.LocalDateTime;

import com.exportpro.backend.model.Inquiry;

import lombok.Data;

@Data
public class InquiryResponse {
    private Long id;
    private String carMake;
    private String carModel;
    private Integer carYear;
    private String message;
    private LocalDateTime createdAt;

    public InquiryResponse(Inquiry inquiry) {
        this.id = inquiry.getId();
        this.carMake = inquiry.getCar().getMake();
        this.carModel = inquiry.getCar().getModel();
        this.carYear = inquiry.getCar().getYear();
        this.message = inquiry.getMessage();
        this.createdAt = inquiry.getCreatedAt();
    }
}