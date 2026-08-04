package com.exportpro.backend.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exportpro.backend.dto.OrderResponse;
import com.exportpro.backend.model.Car;
import com.exportpro.backend.model.CarStatus;
import com.exportpro.backend.model.Order;
import com.exportpro.backend.model.OrderStatus;
import com.exportpro.backend.repository.OrderRepository;
import com.exportpro.backend.service.InvoiceService;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final OrderRepository orderRepository;
    private final InvoiceService invoiceService;

    public AdminOrderController(OrderRepository orderRepository, InvoiceService invoiceService) {
        this.orderRepository = orderRepository;
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(
            orderRepository.findAll().stream()
                .map(OrderResponse::new)
                .toList()
        );
    }

    @PutMapping("/{id}/confirm-payment")
    public ResponseEntity<?> confirmPayment(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(OrderStatus.COMPLETED);
        order.setCompletedAt(LocalDateTime.now());

        Car car = order.getCar();
        car.setStatus(CarStatus.SOLD);

        orderRepository.save(order);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(OrderStatus.CANCELLED);

        Car car = order.getCar();
        car.setStatus(CarStatus.AVAILABLE);

        orderRepository.save(order);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != OrderStatus.COMPLETED) {
            return ResponseEntity.badRequest().build();
        }

        byte[] pdf = invoiceService.generateInvoice(order);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice-" + order.getId() + ".pdf");

        return ResponseEntity.ok().headers(headers).body(pdf);
    }
}