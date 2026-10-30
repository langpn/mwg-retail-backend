package com.example.demojpa.controller;

import com.example.demojpa.entity.Promotion;
import com.example.demojpa.service.PromotionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller: PromotionApiController
 * Cung cấp Web Service cho Phân hệ Khuyến mãi & Mã giảm giá
 * Tuân thủ đầy đủ các phương thức HTTP: GET, POST, PUT, DELETE
 */
@RestController
@RequestMapping("/api/v1/promotions")
@CrossOrigin(origins = "*")
public class PromotionApiController {

    private final PromotionService promotionService;

    public PromotionApiController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    /**
     * GET /api/v1/promotions
     * Lấy toàn bộ danh sách chương trình khuyến mãi
     */
    @GetMapping
    public ResponseEntity<List<Promotion>> getAllPromotions() {
        return ResponseEntity.ok(promotionService.getAllPromotions());
    }

    /**
     * GET /api/v1/promotions/{id}
     * Lấy chi tiết 1 chương trình khuyến mãi theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable Long id) {
        return promotionService.getPromotionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/v1/promotions
     * Thêm mới một chương trình khuyến mãi
     */
    @PostMapping
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        Promotion saved = promotionService.createPromotion(promotion);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * PUT /api/v1/promotions/{id}
     * Cập nhật thông tin khuyến mãi theo ID
     */
    @PutMapping("/{id}")
    public ResponseEntity<Promotion> updatePromotion(@PathVariable Long id, @RequestBody Promotion promotion) {
        return promotionService.updatePromotion(id, promotion)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/v1/promotions/{id}
     * Xóa một chương trình khuyến mãi khỏi hệ thống
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        boolean deleted = promotionService.deletePromotion(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
