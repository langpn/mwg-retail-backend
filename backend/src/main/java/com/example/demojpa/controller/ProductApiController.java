package com.example.demojpa.controller;

import com.example.demojpa.entity.Brand;
import com.example.demojpa.entity.Category;
import com.example.demojpa.entity.Product;
import com.example.demojpa.service.ProductCatalogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller: ProductApiController
 * Cung cấp Web Service cho Phân hệ 1 (Sản phẩm & Danh mục)
 * Tuân thủ đầy đủ các phương thức HTTP: GET, POST, PUT, DELETE
 */
@RestController
@RequestMapping("/api/v1/products")
@CrossOrigin(origins = "*")
public class ProductApiController {

    private final ProductCatalogService catalogService;

    public ProductApiController(ProductCatalogService catalogService) {
        this.catalogService = catalogService;
    }

    /**
     * GET /api/v1/products
     * Hỗ trợ lọc theo danh mục, thương hiệu, mức giá trần và từ khóa tìm kiếm
     */
    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String keyword
    ) {
        List<Product> products = catalogService.searchProducts(category, brand, maxPrice, keyword);
        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/v1/products/{id}
     * Lấy chi tiết 1 sản phẩm theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return catalogService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/v1/products/categories
     * Lấy toàn bộ danh mục sản phẩm Điện Máy Xanh
     */
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(catalogService.getAllCategories());
    }

    /**
     * GET /api/v1/products/brands
     * Lấy toàn bộ danh sách thương hiệu chính hãng
     */
    @GetMapping("/brands")
    public ResponseEntity<List<Brand>> getBrands() {
        return ResponseEntity.ok(catalogService.getAllBrands());
    }

    /**
     * POST /api/v1/products
     * Thêm mới một sản phẩm vào hệ thống
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product saved = catalogService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * PUT /api/v1/products/{id}
     * Cập nhật thông tin sản phẩm theo ID
     */
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        return catalogService.updateProduct(id, product)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/v1/products/{id}
     * Xóa một sản phẩm khỏi danh mục
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        boolean deleted = catalogService.deleteProduct(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
