package com.exportpro.backend.controller;

import com.exportpro.backend.dto.AnalyticsResponse;
import com.exportpro.backend.model.Order;
import com.exportpro.backend.model.OrderStatus;
import com.exportpro.backend.repository.CarRepository;
import com.exportpro.backend.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/analytics")
public class AdminAnalyticsController {

    private final OrderRepository orderRepository;
    private final CarRepository carRepository;

    public AdminAnalyticsController(OrderRepository orderRepository, CarRepository carRepository) {
        this.orderRepository = orderRepository;
        this.carRepository = carRepository;
    }

    @GetMapping
    public ResponseEntity<AnalyticsResponse> getAnalytics() {
        List<Order> allOrders = orderRepository.findAll();

        Map<String, Long> ordersByStatus = new LinkedHashMap<>();
        for (OrderStatus status : OrderStatus.values()) {
            ordersByStatus.put(status.name(), 0L);
        }
        for (Order order : allOrders) {
            ordersByStatus.merge(order.getStatus().name(), 1L, Long::sum);
        }

        DateTimeFormatter dayFormat = DateTimeFormatter.ofPattern("dd MMM");

        Map<String, BigDecimal> salesByDay = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                .collect(Collectors.groupingBy(
                        o -> o.getCompletedAt().format(dayFormat),
                        LinkedHashMap::new,
                        Collectors.reducing(BigDecimal.ZERO, Order::getPriceAtPurchase, BigDecimal::add)
                ));

        List<AnalyticsResponse.SalesPoint> salesOverTime = salesByDay.entrySet().stream()
                .map(e -> new AnalyticsResponse.SalesPoint(e.getKey(), e.getValue()))
                .toList();

        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                .map(Order::getPriceAtPurchase)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        AnalyticsResponse response = new AnalyticsResponse(
                ordersByStatus,
                salesOverTime,
                totalRevenue,
                allOrders.size(),
                carRepository.count()
        );

        return ResponseEntity.ok(response);
    }
}