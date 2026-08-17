package com.exportpro.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReplyRequest {

    @NotBlank(message = "Reply cannot be empty")
    private String reply;
}