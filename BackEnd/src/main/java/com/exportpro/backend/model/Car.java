package com.exportpro.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "cars")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String make;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private BigDecimal price;

    private Integer mileage;

    private String condition;

    @Column(unique = true)
    private String vin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CarStatus status;

    @ManyToOne
    @JoinColumn(name = "port_id")
    private Port shippingPort;
}