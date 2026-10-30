package com.example.demojpa.service;

import com.example.demojpa.entity.Customer;
import com.example.demojpa.entity.Product;
import com.example.demojpa.entity.ProductReview;
import com.example.demojpa.repository.CustomerRepository;
import com.example.demojpa.repository.ProductRepository;
import com.example.demojpa.repository.ProductReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service: ProductReviewService (Quản lý nghiệp vụ Đánh giá sản phẩm)
 */
@Service
public class ProductReviewService {

    private final ProductReviewRepository reviewRepo;
    private final ProductRepository productRepo;
    private final CustomerRepository customerRepo;

    public ProductReviewService(ProductReviewRepository reviewRepo,
                                ProductRepository productRepo,
                                CustomerRepository customerRepo) {
        this.reviewRepo = reviewRepo;
        this.productRepo = productRepo;
        this.customerRepo = customerRepo;
    }

    public List<ProductReview> getAllReviews() {
        return reviewRepo.findAll();
    }

    public Optional<ProductReview> getReviewById(Long id) {
        return reviewRepo.findById(id);
    }

    public List<ProductReview> getReviewsByProductId(Long productId) {
        return reviewRepo.findByProduct_Id(productId);
    }

    public ProductReview createReview(ProductReview review) {
        // Kiem tra du lieu dau vao co ban
        if (review.getRating() == null || review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Diem danh gia phai tu 1 den 5");
        }
        if (review.getProduct() == null || review.getProduct().getId() == null) {
            throw new IllegalArgumentException("Thieu san pham danh gia");
        }
        if (review.getCustomer() == null || review.getCustomer().getId() == null) {
            throw new IllegalArgumentException("Thieu khach hang danh gia");
        }

        // Gan lai entity that tu DB dua tren id gui len (tranh loi detached entity)
        Product product = productRepo.findById(review.getProduct().getId())
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay san pham"));
        review.setProduct(product);

        Customer customer = customerRepo.findById(review.getCustomer().getId())
                .orElseThrow(() -> new IllegalArgumentException("Khong tim thay khach hang"));
        review.setCustomer(customer);

        return reviewRepo.save(review);
    }

    public boolean deleteReview(Long id) {
        if (reviewRepo.existsById(id)) {
            reviewRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
