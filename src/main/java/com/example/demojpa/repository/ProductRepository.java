package com.example.demojpa.repository;

import com.example.demojpa.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
    List<Product> findByCategory_Code(String categoryCode);
    List<Product> findByBrand_Name(String brandName);
    List<Product> findByPriceLessThanEqual(Double maxPrice);
    List<Product> findByNameContainingIgnoreCase(String keyword);
}
