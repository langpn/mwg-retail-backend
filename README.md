# 🏬 MWG Retail Multi-Branch System (`mwg-retail-system`)
> **Hệ Thống Dữ Liệu & Bán Lẻ Đa Chi Nhánh Điện Máy Xanh**  
> **Đồ Án Môn Học:** Công cụ Web và Website hướng dữ liệu (ĐH Công nghiệp TP.HCM - IUH - Khóa 21BVL)  
> **Kho lưu trữ:** [https://github.com/langpn/mwg-retail-system](https://github.com/langpn/mwg-retail-system)

---

## 🧭 I. TỔNG QUAN HỆ THỐNG
Dự án được xây dựng nhằm mô phỏng hệ thống quản lý dữ liệu bán lẻ đa chi nhánh của chuỗi siêu thị Điện Máy Xanh (MWG). Hệ thống giải quyết các bài toán cốt lõi:
1. **Quản lý danh mục & thương hiệu:** Phân loại thiết bị gia dụng (Máy giặt, Tủ lạnh, Smart Tivi) theo thương hiệu chính hãng (Toshiba, Samsung, LG, Panasonic).
2. **Quản lý tồn kho đa chi nhánh thời gian thực:** Đồng bộ số lượng hàng hóa tại các siêu thị (Chi nhánh Lê Văn Việt - Quận 9, Chi nhánh Đỗ Xuân Hợp - Thủ Đức).
3. **Quản lý đơn hàng & khách hàng:** Tự động hóa luồng đặt mua, áp dụng chiết khấu mã khuyến mãi (`MWG5`, `TET2027`) và trừ số lượng tồn kho tự động.
4. **Cung cấp RESTful Web Services:** Phục vụ dữ liệu JSON chuẩn cho ứng dụng Client và làm Backend Data Provider cho hệ thống AI Agent (`MWG-Retail-Orchestrator`).

---

## 🏛️ II. KIẾN TRÚC KỸ THUẬT (3-TIER ARCHITECTURE)

```text
                        TRÌNH DUYỆT / CLIENT / AI AGENT
                                       │
                                       ▼ (HTTP Request :8080)
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TẦNG FRONTEND (REACT SPA)                             │
│ • Giao diện Dashboard React 18 + TypeScript + Tailwind CSS                 │
│ • Đóng gói tĩnh vào 'src/main/resources/static/' (Chạy 1 cổng 8080 duy nhất)│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼ (Fetch REST API JSON)
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TẦNG CONTROLLER (SPRING WEB MVC)                      │
│ • ProductApiController     : GET /api/v1/products, POST, DELETE             │
│ • InventoryApiController   : GET /api/v1/inventory/check, PUT (Update Stock)│
│ • OrderApiController       : GET /api/v1/orders, POST (Tạo đơn hàng)        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TẦNG SERVICE (BUSINESS LOGIC)                         │
│ • ProductCatalogService    : Nghiệp vụ lọc danh mục, giá, thương hiệu       │
│ • InventoryService         : Nghiệp vụ kiểm tra & cập nhật tồn kho chi nhánh│
│ • OrderService             : Nghiệp vụ tính tiền, chiết khấu & trừ tồn kho  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TẦNG REPOSITORY (SPRING DATA JPA)                     │
│ • 10 Interfaces kế thừa JpaRepository<T, Long>                              │
│ • Tự động ánh xạ ORM / Hibernate xuống CSDL MySQL                           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       CƠ SỞ DỮ LIỆU MYSQL (10 BẢNG)                         │
│   categories, brands, products, store_branches, inventories,                │
│   customers, promotions, customer_orders, order_items, product_reviews      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 III. SƠ ĐỒ CƠ SỞ DỮ LIỆU (10 BẢNG QUAN HỆ CHUẨN)

Hệ thống được thiết kế chuẩn mực 10 thực thể quan hệ bằng **Spring Data JPA**:

```text
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   CATEGORIES    │1     N│    PRODUCTS     │1     N│   INVENTORIES   │
│ (Danh mục sp)   ├───────┤ (Sản phẩm ĐMX)  ├───────┤ (Tồn kho c/nhánh)│
└─────────────────┘       └────────┬────────┘       └────────┬────────┘
                                   │1                        │N
┌─────────────────┐                │                         │
│     BRANDS      │1               │                         │
│  (Thương hiệu)  ├────────────────┤                         │
└─────────────────┘                │N                        │1
                                   │                ┌────────┴────────┐
┌─────────────────┐       ┌────────┴────────┐       │ STORE_BRANCHES  │
│ PRODUCT_REVIEWS │N     1│   ORDER_ITEMS   │N     1│ (Siêu thị ĐMX)  │
│   (Đánh giá)    ├───────┤ (Chi tiết đơn)  ├───────┤                 │
└─────────────────┘       └────────┬────────┘       └─────────────────┘
                                   │N
┌─────────────────┐                │1
│   PROMOTIONS    │1      ┌────────┴────────┐       ┌─────────────────┐
│  (Khuyến mãi)   ├───────┤     ORDERS      │N     1│    CUSTOMERS    │
└─────────────────┘       │   (Đơn mua)     ├───────┤  (Khách hàng)   │
                          └─────────────────┘       └─────────────────┘
```

---

## 🚀 IV. HƯỚNG DẪN KHỞI CHẠY ỨNG DỤNG (CHỈ 1 LỆNH DUY NHẤT)

### 1. Chuẩn Bị CSDL MySQL:
* Mở MySQL Workbench hoặc XAMPP, tạo database rỗng tên: `mwg_retail_db`.
* Cấu hình trong `src/main/resources/application.properties`:
  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/mwg_retail_db?useSSL=false&serverTimezone=UTC
  spring.datasource.username=root
  spring.datasource.password=
  spring.jpa.hibernate.ddl-auto=update
  spring.jpa.show-sql=true
  ```

### 2. Chạy Ứng Dụng:
```bash
# Trên macOS / Linux:
./mvnw spring-boot:run

# Trên Windows Command Prompt:
mvnw.cmd spring-boot:run
```

### 3. Trải Nghiệm Giao Diện:
* Mở trình duyệt truy cập: **`http://localhost:8080`**
* Toàn bộ giao diện React SPA hiện đại sẽ tải lên lập tức, CSDL đã được `DataSeeder.java` nạp sẵn 15 sản phẩm mẫu, 4 thương hiệu và tồn kho tại 2 chi nhánh siêu thị.

---

## 👥 V. THÀNH VIÊN THỰC HIỆN ĐỒ ÁN (NHÓM 3 SINH VIÊN IUH)

* **Phạm Ngọc Lang** (MSSV: 25765251) - Nhóm trưởng (Phụ trách Phân hệ Sản phẩm, Hạ tầng Spring Boot & REST APIs).
* **Bạn Diễm** (Phụ trách Phân hệ Siêu thị & Tồn kho chi nhánh).
* **Bạn Toàn** (Phụ trách Phân hệ Khách hàng, Đơn đặt hàng & Cuốn Báo Cáo 17 trang).

---
*Mã nguồn được phân phối dưới giấy phép nội bộ phục vụ môn học IUH và danh mục dự án kỹ thuật cá nhân.*
