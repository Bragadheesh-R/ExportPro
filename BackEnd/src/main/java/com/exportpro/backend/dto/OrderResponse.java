package com.exportpro.backend.dto;

import com.exportpro.backend.model.Order;
import com.exportpro.backend.model.OrderStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderResponse {
    private Long id;
    private String carMake;
    private String carModel;
    private Integer carYear;
    private String customerUsername;
    private String customerEmail;
    private BigDecimal priceAtPurchase;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public OrderResponse(Order order) {
        this.id = order.getId();
        this.carMake = order.getCar().getMake();
        this.carModel = order.getCar().getModel();
        this.carYear = order.getCar().getYear();
        this.customerUsername = order.getCustomer().getUsername();
        this.customerEmail = order.getCustomer().getEmail();
        this.priceAtPurchase = order.getPriceAtPurchase();
        this.status = order.getStatus();
        this.createdAt = order.getCreatedAt();
        this.completedAt = order.getCompletedAt();
    }
}