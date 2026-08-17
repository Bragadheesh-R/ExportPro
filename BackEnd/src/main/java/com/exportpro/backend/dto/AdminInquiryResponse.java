package com.exportpro.backend.dto;

import com.exportpro.backend.model.Inquiry;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AdminInquiryResponse {
    private Long id;
    private String carMake;
    private String carModel;
    private Integer carYear;
    private String customerUsername;
    private String customerEmail;
    private String message;
    private String reply;
    private LocalDateTime createdAt;
    private LocalDateTime repliedAt;

    public AdminInquiryResponse(Inquiry inquiry) {
        this.id = inquiry.getId();
        this.carMake = inquiry.getCar().getMake();
        this.carModel = inquiry.getCar().getModel();
        this.carYear = inquiry.getCar().getYear();
        this.customerUsername = inquiry.getCustomer().getUsername();
        this.customerEmail = inquiry.getCustomer().getEmail();
        this.message = inquiry.getMessage();
        this.reply = inquiry.getReply();
        this.createdAt = inquiry.getCreatedAt();
        this.repliedAt = inquiry.getRepliedAt();
    }
}