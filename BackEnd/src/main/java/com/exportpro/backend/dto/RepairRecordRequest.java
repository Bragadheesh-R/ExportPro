package com.exportpro.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class RepairRecordRequest {
    private String description;
    private BigDecimal cost;
    private LocalDate repairDate;
    private String performedBy;
}