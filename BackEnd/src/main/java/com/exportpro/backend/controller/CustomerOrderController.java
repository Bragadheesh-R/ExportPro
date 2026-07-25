package com.exportpro.backend.controller;

import com.exportpro.backend.model.Car;
import com.exportpro.backend.model.CarStatus;
import com.exportpro.backend.model.Order;
import com.exportpro.backend.model.OrderStatus;
import com.exportpro.backend.model.User;
import com.exportpro.backend.repository.CarRepository;
import com.exportpro.backend.repository.OrderRepository;
import com.exportpro.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer/orders")
public class CustomerOrderController {

    private final OrderRepository orderRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;

    public CustomerOrderController(OrderRepository orderRepository, CarRepository carRepository,
                                    UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
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
}