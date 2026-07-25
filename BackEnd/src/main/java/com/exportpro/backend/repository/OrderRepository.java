package com.exportpro.backend.repository;

import com.exportpro.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerEmail(String email);
    List<Order> findByStatus(com.exportpro.backend.model.OrderStatus status);
}