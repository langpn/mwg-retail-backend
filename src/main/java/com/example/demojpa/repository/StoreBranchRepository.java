package com.example.demojpa.repository;

import com.example.demojpa.entity.StoreBranch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreBranchRepository extends JpaRepository<StoreBranch, Long> {
    List<StoreBranch> findByDistrict(String district);
    List<StoreBranch> findByBranchNameContainingIgnoreCase(String name);
}
