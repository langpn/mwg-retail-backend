package com.example.demojpa.controller;

import com.example.demojpa.entity.ProductReview;
import com.example.demojpa.service.ProductReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller: ProductReviewApiController
 * Cung cấp Web Service cho Phân hệ Đánh giá sản phẩm
 * Tuân thủ đầy đủ các phương thức HTTP: GET, POST, DELETE
 */
@RestController
@RequestMapping("/api/v1/reviews")
@CrossOrigin(origins = "*")
public class ProductReviewApiController {

    private final ProductReviewService reviewService;

    public ProductReviewApiController(ProductReviewService reviewService) {
        this.reviewService = reviewService;
    }

    /**
     * GET /api/v1/reviews
     * Lấy toàn bộ danh sách đánh giá sản phẩm
     */
    @GetMapping
    public ResponseEntity<List<ProductReview>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    /**
     * GET /api/v1/reviews/product/{productId}
     * Lấy danh sách đánh giá theo mã sản phẩm
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductReview>> getReviewsByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProductId(productId));
    }

    /**
     * POST /api/v1/reviews
     * Thêm mới một đánh giá sản phẩm
     */
    @PostMapping
    public ResponseEntity<ProductReview> createReview(@RequestBody ProductReview review) {
        try {
            ProductReview saved = reviewService.createReview(review);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * DELETE /api/v1/reviews/{id}
     * Xóa một đánh giá sản phẩm khỏi hệ thống
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        boolean deleted = reviewService.deleteReview(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
