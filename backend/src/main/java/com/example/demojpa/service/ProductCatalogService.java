package com.example.demojpa.service;

import com.example.demojpa.entity.Brand;
import com.example.demojpa.entity.Category;
import com.example.demojpa.entity.Product;
import com.example.demojpa.repository.BrandRepository;
import com.example.demojpa.repository.CategoryRepository;
import com.example.demojpa.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service: ProductCatalogService (Quản lý nghiệp vụ Sản phẩm, Danh mục, Thương hiệu)
 * Phân hệ 1 do Lang phụ trách chính.
 */
@Service
public class ProductCatalogService {

    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    private final BrandRepository brandRepo;

    public ProductCatalogService(ProductRepository productRepo, CategoryRepository categoryRepo, BrandRepository brandRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.brandRepo = brandRepo;
    }

    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    public List<Category> getAllCategories() {
        return categoryRepo.findAll();
    }

    public List<Brand> getAllBrands() {
        return brandRepo.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepo.findById(id);
    }

    public Optional<Product> getProductBySku(String sku) {
        return productRepo.findBySku(sku);
    }

    public List<Product> searchProducts(String categoryCode, String brandName, Double maxPrice, String keyword) {
        List<Product> list = productRepo.findAll();

        if (categoryCode != null && !categoryCode.trim().isEmpty()) {
            list = list.stream()
                    .filter(p -> p.getCategory() != null && categoryCode.equalsIgnoreCase(p.getCategory().getCode()))
                    .collect(Collectors.toList());
        }

        if (brandName != null && !brandName.trim().isEmpty()) {
            list = list.stream()
                    .filter(p -> p.getBrand() != null && brandName.equalsIgnoreCase(p.getBrand().getName()))
                    .collect(Collectors.toList());
        }

        if (maxPrice != null && maxPrice > 0) {
            list = list.stream()
                    .filter(p -> p.getPrice() != null && p.getPrice() <= maxPrice)
                    .collect(Collectors.toList());
        }

        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.toLowerCase();
            list = list.stream()
                    .filter(p -> (p.getName() != null && p.getName().toLowerCase().contains(kw))
                            || (p.getDescription() != null && p.getDescription().toLowerCase().contains(kw)))
                    .collect(Collectors.toList());
        }

        return list;
    }

    public Product createProduct(Product product) {
        return productRepo.save(product);
    }

    public boolean deleteProduct(Long id) {
        if (productRepo.existsById(id)) {
            productRepo.deleteById(id);
            return true;
        }
        return false;
    }
}
