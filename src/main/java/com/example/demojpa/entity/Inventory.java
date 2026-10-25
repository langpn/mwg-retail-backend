package com.example.demojpa.entity;

import jakarta.persistence.*;

/**
 * Entity: Inventory (Tồn kho sản phẩm theo chi nhánh siêu thị)
 * Quan hệ: Bảng trung gian ánh xạ Product và StoreBranch
 */
@Entity
@Table(name = "inventories", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"product_id", "branch_id"})
})
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "branch_id", nullable = false)
    private StoreBranch storeBranch;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    public Inventory() {
    }

    public Inventory(Product product, StoreBranch storeBranch, Integer quantity) {
        this.product = product;
        this.storeBranch = storeBranch;
        this.quantity = quantity;
    }

    public boolean isInStock() {
        return this.quantity != null && this.quantity > 0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public StoreBranch getStoreBranch() {
        return storeBranch;
    }

    public void setStoreBranch(StoreBranch storeBranch) {
        this.storeBranch = storeBranch;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
