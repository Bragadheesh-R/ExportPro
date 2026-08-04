package com.exportpro.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exportpro.backend.model.Car;
import com.exportpro.backend.model.CarStatus;
import com.exportpro.backend.model.Order;
import com.exportpro.backend.model.OrderStatus;
import com.exportpro.backend.model.User;
import com.exportpro.backend.repository.CarRepository;
import com.exportpro.backend.repository.OrderRepository;
import com.exportpro.backend.repository.UserRepository;
import com.exportpro.backend.service.InvoiceService;

@RestController
@RequestMapping("/api/customer/orders")
public class CustomerOrderController {

    private final OrderRepository orderRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final InvoiceService invoiceService;

    public CustomerOrderController(OrderRepository orderRepository, CarRepository carRepository,
                                    UserRepository userRepository, InvoiceService invoiceService) {
        this.orderRepository = orderRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
        this.invoiceService = invoiceService;
    }

    @PostMapping("/{carId}/buy")
    public ResponseEntity<?> buyCar(@PathVariable Long carId, Authentication authentication) {
        Car car = carRepository.findById(carId)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        if (car.getStatus() != CarStatus.AVAILABLE) {
            return ResponseEntity.badRequest().body(Map.of("error", "This car is no longer available"));
        }

        String email = authentication.getName();
        User customer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        car.setStatus(CarStatus.RESERVED);
        carRepository.save(car);

        Order order = new Order();
        order.setCar(car);
        order.setCustomer(customer);
        order.setPriceAtPurchase(car.getPrice());
        order.setStatus(OrderStatus.RESERVED);

        return ResponseEntity.ok(orderRepository.save(order));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(orderRepository.findByCustomerEmail(authentication.getName()));
    }

    @GetMapping("/{id}/invoice")
    public ResponseEntity<byte[]> downloadInvoice(@PathVariable Long id, Authentication authentication) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getCustomer().getEmail().equals(authentication.getName())) {
            return ResponseEntity.status(403).build();
        }

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