package com.example.demojpa.repository;

import com.example.demojpa.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    List<CustomerOrder> findByCustomer_Id(Long customerId);
    List<CustomerOrder> findByStatus(String status);
    List<CustomerOrder> findByPhone(String phone);
}
