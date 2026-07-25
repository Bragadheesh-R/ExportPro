package com.exportpro.backend.dto;

import lombok.Data;

@Data
public class CarImageRequest {
    private String imageUrl;
    private Boolean isMain;
}