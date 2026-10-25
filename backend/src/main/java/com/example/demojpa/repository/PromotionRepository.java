package com.example.demojpa.repository;

import com.example.demojpa.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    Optional<Promotion> findByPromoCode(String promoCode);
    Optional<Promotion> findByPromoCodeAndIsActiveTrue(String promoCode);
}
