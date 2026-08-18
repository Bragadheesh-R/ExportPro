package com.exportpro.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SiteContentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content body is required")
    private String body;
}