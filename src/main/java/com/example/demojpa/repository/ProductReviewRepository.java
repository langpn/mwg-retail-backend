package com.example.demojpa.repository;

import com.example.demojpa.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    List<ProductReview> findByProduct_Id(Long productId);
    List<ProductReview> findByCustomer_Id(Long customerId);
}
