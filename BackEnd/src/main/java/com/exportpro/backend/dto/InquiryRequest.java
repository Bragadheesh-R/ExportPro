package com.exportpro.backend.dto;

import lombok.Data;

@Data
public class InquiryRequest {
    private Long carId;
    private String message;
}