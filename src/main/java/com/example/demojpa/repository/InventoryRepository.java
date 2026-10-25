package com.example.demojpa.repository;

import com.example.demojpa.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByProduct_IdAndStoreBranch_Id(Long productId, Long branchId);
    Optional<Inventory> findByProduct_SkuAndStoreBranch_District(String sku, String district);
    List<Inventory> findByStoreBranch_Id(Long branchId);
    List<Inventory> findByProduct_Id(Long productId);
    List<Inventory> findByQuantityGreaterThan(Integer minQty);
}
