package com.example.demojpa.repository;

import com.example.demojpa.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByCustomerOrder_Id(Long orderId);
    List<OrderItem> findByProduct_Id(Long productId);
}
