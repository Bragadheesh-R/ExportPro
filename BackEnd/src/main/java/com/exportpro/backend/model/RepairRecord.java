package com.exportpro.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "repair_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RepairRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    private BigDecimal cost;

    private LocalDate repairDate;

    private String performedBy;

    @ManyToOne
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;
}