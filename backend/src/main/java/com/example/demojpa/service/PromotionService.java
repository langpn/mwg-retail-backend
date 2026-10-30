package com.example.demojpa.service;

import com.example.demojpa.entity.Promotion;
import com.example.demojpa.repository.PromotionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service: PromotionService (Quản lý nghiệp vụ Khuyến mãi & Mã giảm giá)
 */
@Service
public class PromotionService {

    private final PromotionRepository promotionRepo;

    public PromotionService(PromotionRepository promotionRepo) {
        this.promotionRepo = promotionRepo;
    }

    public List<Promotion> getAllPromotions() {
        return promotionRepo.findAll();
    }

    public Optional<Promotion> getPromotionById(Long id) {
        return promotionRepo.findById(id);
    }

    public Promotion createPromotion(Promotion promotion) {
        return promotionRepo.save(promotion);
    }

    public Optional<Promotion> updatePromotion(Long id, Promotion updated) {
        return promotionRepo.findById(id).map(existing -> {
            existing.setPromoCode(updated.getPromoCode());
            existing.setDiscountPercent(updated.getDiscountPercent());
            existing.setDescription(updated.getDescription());
            existing.setIsActive(updated.getIsActive());
            return promotionRepo.save(existing);
        });
    }

    public boolean deletePromotion(Long id) {
        if (promotionRepo.existsById(id)) {
            promotionRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
