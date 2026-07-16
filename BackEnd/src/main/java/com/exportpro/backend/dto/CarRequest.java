package com.exportpro.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CarRequest {
    private String make;
    private String model;
    private Integer year;
    private BigDecimal price;
    private Integer mileage;
    private String condition;
    private String vin;
    private Long portId;
}