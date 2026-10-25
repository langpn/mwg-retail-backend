# BÁO CÁO BÀI TẬP LỚN MÔN HỌC
## CÔNG CỤ WEB VÀ WEBSITE HƯỚNG DỮ LIỆU

---

# [TRANG 1: TRANG BÌA CHÍNH THỨC]

```text
               BỘ CÔNG THƯƠNG
       TRƯỜNG ĐẠI HỌC CÔNG NGHIỆP TP. HỒ CHÍ MINH
             KHOA CÔNG NGHỆ THÔNG TIN
                   ───────────

             BÁO CÁO BÀI TẬP LỚN MÔN HỌC
        CÔNG CỤ WEB VÀ WEBSITE HƯỚNG DỮ LIỆU

                    ĐỀ TÀI:
   HỆ THỐNG DỮ LIỆU & BÁN LẺ ĐA CHI NHÁNH ĐIỆN MÁY XANH
                 (MWG RETAIL SYSTEM)

   Giảng viên hướng dẫn:  Khoa Công Nghệ Thông Tin
   Lớp học phần:          21BVL / 21PVL
   Thời gian báo cáo:     Chủ Nhật, ngày 01/11/2026

   Sinh viên thực hiện:
   1. Phạm Ngọc Lang      - MSSV: 25765251
   2. Bùi Dương Diễm      - Thành viên nhóm
   3. Nguyễn Thanh Toàn   - Thành viên nhóm

               TP. HỒ CHÍ MINH - 10/2026
```

---

# [TRANG 2: LỜI MỞ ĐẦU & BẢNG PHÂN CÔNG PHÂN HOẠCH DỌC]

### 1. Lời Mở Đầu
Trong bối cảnh chuyển đổi số của ngành bán lẻ hiện đại, việc quản lý hàng hóa và dữ liệu tồn kho theo thời gian thực giữa các chi nhánh là bài toán sống còn. Đề tài **"Hệ Thống Dữ Liệu & Bán Lẻ Đa Chi Nhánh Điện Máy Xanh"** được nhóm xây dựng nhằm áp dụng toàn diện các kiến thức đã học trong môn học: từ kiến trúc **Spring Boot 3**, kỹ thuật ánh xạ đối tượng **Spring Data JPA & Hibernate**, xây dựng hệ thống **RESTful Web Services** đa phương thức (`GET`, `POST`, `PUT`, `DELETE`) đến giao diện **React Single Page Application (SPA)** hiện đại.

### 2. Bảng Phân Công Công Việc Theo Mô Hình Phân Hoạch Dọc (Vertical Slicing)
Tuân thủ nghiêm ngặt chỉ đạo của giảng viên về việc **không phân hoạch ngang**, cả 3 thành viên đều tham gia lập trình trọn vẹn từng nhánh chức năng dọc từ tầng Entity ➔ Repository ➔ Service ➔ API Controller ➔ Giao diện:

| Thành viên thực hiện | Phân hệ phụ trách dọc | Nhiệm vụ cụ thể đã hoàn thành | Mức độ đóng góp |
| :--- | :--- | :--- | :---: |
| **Phạm Ngọc Lang**<br>*(MSSV: 25765251)* | **Phân hệ 1: Sản Phẩm & Danh Mục**<br>• `Category` & `Brand` (1-N)<br>• `Product` (N-1) | • Khởi tạo kiến trúc dự án, cấu hình Maven, kết nối CSDL.<br>• Xây dựng 3 Entities, 3 Repositories, `ProductCatalogService`.<br>• Cung cấp các REST API: `GET /products`, `POST`, `DELETE`.<br>• Thiết kế giao diện lưới sản phẩm và bộ lọc đa tiêu chí. | **33.3%** |
| **Bùi Dương Diễm** | **Phân hệ 2: Siêu Thị & Tồn Kho Chi Nhánh**<br>• `StoreBranch` & `Inventory` (1-N)<br>• `ProductReview` (N-1) | • Xây dựng 3 Entities: `StoreBranch`, `Inventory`, `ProductReview`.<br>• Xây dựng 3 Repositories và `InventoryService`.<br>• Cung cấp các REST API: `GET /inventory/check`, `PUT /update`.<br>• Thiết kế giao diện bảng ma trận tồn kho theo siêu thị. | **33.3%** |
| **Nguyễn Thanh Toàn** | **Phân hệ 3: Đơn Hàng & Khách Hàng**<br>• `Customer` & `Promotion` (1-N)<br>• `CustomerOrder` & `OrderItem` (1-N) | • Xây dựng 4 Entities: `Customer`, `Promotion`, `Order`, `OrderItem`.<br>• Xây dựng 4 Repositories và `OrderService` (xử lý trừ tồn kho).<br>• Cung cấp các REST API: `POST /orders`, `GET /orders`.<br>• Thiết kế form đặt hàng và hoàn thiện Cuốn Báo Cáo. | **33.3%** |

---

# [TRANG 3: GIỚI THIỆU ĐỀ TÀI & BỐI CẢNH NGHIỆP VỤ]

### 1. Bối Cảnh Nghiệp Vụ Chuỗi Bán Lẻ Điện Máy Xanh (MWG)
Chuỗi bán lẻ Điện Máy Xanh sở hữu hàng nghìn siêu thị trên toàn quốc. Thách thức lớn nhất trong quản trị vận hành là:
* Khách hàng tại một khu vực (ví dụ Quận 9 hoặc Thủ Đức) cần biết ngay lập tức sản phẩm họ muốn mua (máy giặt, tủ lạnh, tivi) **hiện đang còn hàng tại siêu thị gần nhất hay không**.
* Thông tin tồn kho phải được đồng bộ chính xác: khi một khách hàng đặt mua tại chi nhánh Lê Văn Việt, số lượng khả dụng tại chi nhánh đó phải được cập nhật giảm ngay lập tức để tránh tình trạng bán vượt quá số lượng hàng có sẵn (overselling).

### 2. Mục Tiêu Của Đề Tài
1. **Về mặt kỹ thuật:** Xây dựng hệ thống web hướng dữ liệu theo mô hình phân tầng chuẩn MVC, tích hợp Spring Data JPA để quản lý CSDL quan hệ gồm **10 bảng** hoàn chỉnh, cung cấp các Web Service chuẩn JSON.
2. **Về mặt ứng dụng:** Mô phỏng luồng nghiệp vụ bán lẻ thực tế: Xem danh mục ➔ Lọc theo thương hiệu và ngân sách ➔ Kiểm tra tồn kho chi nhánh ➔ Đặt hàng có áp dụng mã chiết khấu ➔ Tự động trừ kho.

---

# [TRANG 4: PHẠM VI HỆ THỐNG & ĐỐI TƯỢNG SỬ DỤNG]

### 1. Phạm Vi Hệ Thống
* **Phạm vi dữ liệu:** Quản lý 3 ngành hàng chủ lực (Máy giặt, Tủ lạnh, Smart Tivi), 4 thương hiệu lớn (Toshiba, Samsung, LG, Panasonic) tại 2 siêu thị trọng điểm (Chi nhánh Lê Văn Việt - Quận 9 và Chi nhánh Đỗ Xuân Hợp - Thủ Đức).
* **Phạm vi tính năng:** Bao phủ trọn vẹn các thao tác **CRUD (Create - Read - Update - Delete)** trên 10 bảng thực thể.

### 2. Đối Tượng Sử Dụng
* **Khách hàng mua sắm:** Tìm kiếm thiết bị theo nhu cầu, xem thông số kỹ thuật, kiểm tra chi nhánh gần nhất còn hàng, áp dụng mã ưu đãi (`MWG5`, `TET2027`) và đặt mua hàng trực tuyến.
* **Nhân viên / Quản lý siêu thị:** Tra cứu bảng ma trận tồn kho toàn bộ siêu thị, thực hiện điều chỉnh số lượng tồn kho qua thao tác cập nhật (HTTP `PUT`).
* **Hệ thống mở rộng (AI Agent Integration):** Cung cấp API có cấu trúc cho các tác tử AI tự động truy vấn dữ liệu giá và kiểm tra tồn kho thời gian thực.

---

# [TRANG 5: YÊU CẦU CHỨC NĂNG & KỊCH BẢN SỬ DỤNG]

### 1. Danh Sách Yêu Cầu Chức Năng (Functional Requirements)
* **FR-01 (Quản lý Danh mục & Thương hiệu):** Phân loại và hiển thị danh mục thiết bị, nguồn gốc xuất xứ chính hãng.
* **FR-02 (Lọc & Tìm kiếm Sản phẩm Đa tiêu chí):** Tìm kiếm theo tên, lọc đồng thời theo danh mục, thương hiệu và mức giá trần.
* **FR-03 (Tra cứu Tồn kho Chi nhánh Thời gian thực):** Xác định chính xác số lượng hàng khả dụng tại từng địa bàn quận/huyện.
* **FR-04 (Cập nhật Tồn kho):** Cho phép nhân viên điều chỉnh số lượng hàng trong kho qua phương thức HTTP `PUT`.
* **FR-05 (Đặt Hàng & Áp dụng Mã Khuyến Mãi):** Nhập thông tin người mua, tự động tính chiết khấu phần trăm từ bảng `promotions`.
* **FR-06 (Khấu trừ Tồn kho Tự động):** Giao dịch đặt hàng thành công sẽ tự động giảm trừ số lượng tồn kho tương ứng tại chi nhánh xuất hàng.

### 2. Kịch Bản Sử Dụng Điển Hình (Use Case Scenario)
* *Khách hàng muốn mua máy giặt Inverter dưới 8 triệu tại Quận 9:*
  1. Người dùng mở ứng dụng web, chọn danh mục "Máy giặt", chọn mức giá "Dưới 8 triệu đ".
  2. Hệ thống gọi API `GET /api/v1/products?category=MAYGIAT&maxPrice=8000000`, hiển thị sản phẩm "Máy giặt Toshiba 8.5kg (7.490.000đ)".
  3. Người dùng chuyển sang tab "Tồn kho chi nhánh", chọn siêu thị "ĐMX Lê Văn Việt (Quận 9)", hệ thống hiển thị: Còn hàng (4 máy).
  4. Người dùng bấm "Mua ngay", nhập mã `MWG5`, hệ thống giảm 5% còn 7.115.500đ và lưu đơn hàng, đồng thời tồn kho tại Quận 9 giảm từ 4 xuống 3 máy.

---

# [TRANG 6: SƠ ĐỒ USE CASE TỔNG QUÁT]

```text
                  HỆ THỐNG QUẢN LÝ BÁN LẺ ĐIỆN MÁY XANH
               ┌────────────────────────────────────────┐
               │                                        │
               │   ( UC01: Xem Danh Mục & Sản Phẩm )    │
               │                   ▲                    │
               │                   │                    │
┌──────────┐   │   ( UC02: Tìm Kiếm & Lọc Nâng Cao )    │   ┌──────────────┐
│          │───┼────────────────────────────────────────┼───│              │
│  KHÁCH   │   │   ( UC03: Tra Cứu Tồn Kho Chi Nhánh )  │   │  NHÂN VIÊN   │
│   HÀNG   │───┼────────────────────────────────────────┼───│   SIÊU THỊ   │
│          │   │                                        │   │              │
└──────────┘   │   ( UC04: Đặt Hàng & Nhập Mã Ưu Đãi )  │   └──────────────┘
       │       │                   │ (include)          │          │
       │       │                   ▼                    │          │
       │       │   ( UC05: Tự Động Khấu Trừ Kho Hàng ) ◄┼──────────┘
       │       │                                        │ (Cập nhật kho)
       │       │   ( UC06: Gửi Đánh Giá Sản Phẩm )      │
       └───────┼────────────────────────────────────────┤
               │   ( UC07: Quản Lý & Cập Nhật Đơn Hàng )│
               │                                        │
               └────────────────────────────────────────┘
```

---

# [TRANG 7: KIẾN TRÚC KỸ THUẬT HỆ THỐNG (3-TIER MVC)]

### 1. Mô Hình 3 Tầng Kiến Trúc Phân Tách Rõ Ràng

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        TẦNG TRÌNH DIỄN (FRONTEND SPA)                  │
│  • React 18 + TypeScript + Modern Component Architecture               │
│  • Đóng gói tĩnh vào 'src/main/resources/static/' (Chạy chung port 8088)│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP Request / Response (JSON)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        TẦNG ĐIỀU KHIỂN (SPRING WEB MVC)                │
│  • DispatcherServlet tiếp nhận request, định tuyến tới RestController  │
│  • ProductApiController, InventoryApiController, OrderApiController    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Dependency Injection (@Autowired)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        TẦNG NGHIỆP VỤ (SERVICE LAYER)                  │
│  • ProductCatalogService, InventoryService, OrderService               │
│  • Quản lý logic nghiệp vụ, tính toán chiết khấu & Transaction (@Tx)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Spring Data JPA Abstraction
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        TẦNG TRUY XUẤT DỮ LIỆU (REPOSITORY)             │
│  • 10 Interfaces mở rộng JpaRepository<T, Long>                        │
│  • Hibernate ORM tự động dịch sang câu lệnh SQL tối ưu                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JDBC Connection Pool (HikariCP)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        CƠ SỞ DỮ LIỆU QUAN HỆ (MYSQL 8)                 │
│  • 10 Bảng quan hệ toàn vẹn, ràng buộc khóa chính và khóa ngoại        │
└────────────────────────────────────────────────────────────────────────┘
```

---

# [TRANG 8: CÔNG NGHỆ ÁP DỤNG & CẤU TRÚC MONOREPO]

### 1. Chi Tiết Công Nghệ Sử Dụng
* **Ngôn ngữ nền tảng:** Java 17 LTS (chuẩn mực doanh nghiệp).
* **Khung ứng dụng Backend:** Spring Boot 3.3.x (tích hợp Embedded Tomcat, tự động cấu hình).
* **Tầng dữ liệu:** Spring Data JPA kết hợp Hibernate 6 (ORM Code First, tự động cập nhật DDL schema).
* **Hệ quản trị CSDL:** MySQL 8.0 (kết hợp profile dev H2 in-memory phục vụ kiểm thử linh hoạt).
* **Frontend:** React 18, TypeScript, Tailwind CSS styling, thư viện icon Lucide.

### 2. Cấu Trúc Monorepo Chuẩn Mực (`mwg-retail-system`)
```text
mwg-retail-system/
├── backend/                       <── Toàn bộ Backend Spring Boot (Maven)
│   ├── src/main/java/com/example/demojpa/
│   │   ├── entity/                <── 10 JPA Entities
│   │   ├── repository/            <── 10 JpaRepositories
│   │   ├── service/               <── 3 Business Services
│   │   ├── controller/            <── 3 RESTful Controllers
│   │   ├── dto/                   <── Request/Response DTOs
│   │   └── seeder/                <── DataSeeder nạp sẵn dữ liệu mẫu
│   ├── src/main/resources/
│   │   ├── application.properties <── Cấu hình cổng 8088 & CSDL
│   │   └── static/                <── Chứa bundle tĩnh React sau khi build
│   └── pom.xml
├── frontend/                      <── Toàn bộ Frontend React Vite
│   ├── src/                       <── Giao diện Dashboard bán lẻ
│   └── vite.config.ts             <── Build tự động sang backend/static
├── docs/                          <── Sơ đồ ERD, Cuốn Báo Cáo 17 trang
└── README.md
```

---

# [TRANG 9: THIẾT KẾ CƠ SỞ DỮ LIỆU (SƠ ĐỒ ERD 10 BẢNG)]

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

# [TRANG 10: ĐẶC TẢ CHI TIẾT CÁC BẢNG CSDL (PHẦN 1)]

### 1. Bảng `categories` (Danh mục sản phẩm)
* `id` (BIGINT, PK, Auto-increment): Khóa chính danh mục.
* `name` (VARCHAR(100), Not Null): Tên danh mục (Máy giặt, Tủ lạnh, Smart Tivi).
* `code` (VARCHAR(50), Not Null, Unique): Mã định danh (MAYGIAT, TULANH, TIVI).
* `description` (VARCHAR(255)): Mô tả đặc tính danh mục.

### 2. Bảng `brands` (Thương hiệu chính hãng)
* `id` (BIGINT, PK, Auto-increment): Khóa chính thương hiệu.
* `name` (VARCHAR(100), Not Null, Unique): Tên hãng (Toshiba, Samsung, LG, Panasonic).
* `country` (VARCHAR(100)): Xuất xứ (Nhật Bản, Hàn Quốc).
* `description` (VARCHAR(255)): Uy tín thương hiệu.

### 3. Bảng `products` (Sản phẩm điện máy)
* `id` (BIGINT, PK, Auto-increment): Khóa chính sản phẩm.
* `sku` (VARCHAR(50), Not Null, Unique): Mã sản phẩm (DMX-MG-001).
* `name` (VARCHAR(200), Not Null): Tên thương mại sản phẩm.
* `price` (DOUBLE, Not Null): Đơn giá niêm yết bán lẻ.
* `description` (TEXT): Thông số kỹ thuật (Inverter, lồng ngang, AI DD...).
* `category_id` (BIGINT, FK ➔ `categories.id`): Khóa ngoại danh mục.
* `brand_id` (BIGINT, FK ➔ `brands.id`): Khóa ngoại thương hiệu.

### 4. Bảng `store_branches` (Chi nhánh siêu thị)
* `id` (BIGINT, PK, Auto-increment): Khóa chính siêu thị.
* `branch_name` (VARCHAR(150), Not Null): Tên siêu thị (ĐMX Lê Văn Việt, ĐMX Đỗ Xuân Hợp).
* `district` (VARCHAR(100), Not Null): Địa bàn quận (Quận 9, TP. Thủ Đức).
* `address` (VARCHAR(255), Not Null): Địa chỉ số nhà, đường.
* `phone` (VARCHAR(20)): Số điện thoại hotline chi nhánh.

### 5. Bảng `inventories` (Tồn kho sản phẩm chi nhánh)
* `id` (BIGINT, PK, Auto-increment): Khóa chính bản ghi tồn kho.
* `product_id` (BIGINT, FK ➔ `products.id`): Khóa ngoại sản phẩm.
* `branch_id` (BIGINT, FK ➔ `store_branches.id`): Khóa ngoại siêu thị.
* `quantity` (INT, Not Null): Số lượng máy có sẵn tại chi nhánh.
* *Ràng buộc:* Cặp `(product_id, branch_id)` là duy nhất (Unique Constraint).

---

# [TRANG 11: ĐẶC TẢ CHI TIẾT CÁC BẢNG CSDL (PHẦN 2)]

### 6. Bảng `customers` (Khách hàng thành viên)
* `id` (BIGINT, PK, Auto-increment): Khóa chính khách hàng.
* `full_name` (VARCHAR(100), Not Null): Họ và tên khách hàng.
* `phone` (VARCHAR(20), Not Null, Unique): Số điện thoại liên lạc.
* `email` (VARCHAR(150)): Thư điện tử.
* `address` (VARCHAR(255)): Địa chỉ cư trú.

### 7. Bảng `promotions` (Chương trình khuyến mãi & Mã giảm giá)
* `id` (BIGINT, PK, Auto-increment): Khóa chính khuyến mãi.
* `promo_code` (VARCHAR(50), Not Null, Unique): Mã voucher (MWG5, TET2027).
* `discount_percent` (DOUBLE, Not Null): Tỷ lệ chiết khấu giảm giá (5.0%, 10.0%).
* `description` (VARCHAR(255)): Nội dung chương trình ưu đãi.
* `is_active` (BOOLEAN, Not Null): Trạng thái áp dụng (true/false).

### 8. Bảng `customer_orders` (Đơn đặt mua hàng)
* `id` (BIGINT, PK, Auto-increment): Khóa chính đơn hàng.
* `customer_name` (VARCHAR(100), Not Null): Tên người nhận hàng.
* `phone` (VARCHAR(20), Not Null): Số điện thoại nhận hàng.
* `shipping_address` (VARCHAR(255), Not Null): Địa chỉ giao hàng.
* `total_amount` (DOUBLE, Not Null): Tổng giá trị thanh toán sau giảm giá.
* `status` (VARCHAR(50), Not Null): Trạng thái đơn (PENDING, CONFIRMED, COMPLETED).
* `order_date` (TIMESTAMP, Not Null): Thời gian khởi tạo đơn hàng.
* `customer_id` (BIGINT, FK ➔ `customers.id`): Khóa ngoại liên kết khách hàng.
* `promotion_id` (BIGINT, FK ➔ `promotions.id`): Khóa ngoại mã voucher áp dụng.

### 9. Bảng `order_items` (Chi tiết từng món trong đơn)
* `id` (BIGINT, PK, Auto-increment): Khóa chính chi tiết đơn hàng.
* `order_id` (BIGINT, FK ➔ `customer_orders.id`): Thuộc đơn hàng nào.
* `product_id` (BIGINT, FK ➔ `products.id`): Mã sản phẩm đặt mua.
* `quantity` (INT, Not Null): Số lượng sản phẩm mua.
* `unit_price` (DOUBLE, Not Null): Đơn giá sản phẩm tại thời điểm mua.

### 10. Bảng `product_reviews` (Đánh giá chất lượng sản phẩm)
* `id` (BIGINT, PK, Auto-increment): Khóa chính đánh giá.
* `product_id` (BIGINT, FK ➔ `products.id`): Khóa ngoại sản phẩm được đánh giá.
* `customer_id` (BIGINT, FK ➔ `customers.id`): Khóa ngoại khách hàng đánh giá.
* `rating` (INT, Not Null): Điểm đánh giá (1 đến 5 sao).
* `comment` (TEXT): Ý kiến nhận xét chi tiết của người dùng.
* `review_date` (TIMESTAMP, Not Null): Thời gian gửi đánh giá.

---

# [TRANG 12: ĐẶC TẢ DANH MỤC RESTful APIs (PHẦN 1)]

Hệ thống tuân thủ nghiêm ngặt 4 phương thức HTTP Verbs chuẩn Web Service:

### 1. Phân Hệ Sản Phẩm (`ProductApiController`)
* **Endpoint:** `GET /api/v1/products`
  * *Chức năng:* Lấy danh sách sản phẩm có hỗ trợ lọc linh hoạt.
  * *Tham số tùy chọn:* `category` (Mã danh mục), `brand` (Tên hãng), `maxPrice` (Giá trần), `keyword` (Từ khóa).
  * *Response JSON mẫu (200 OK):*
    ```json
    [
      {
        "id": 1,
        "sku": "DMX-MG-001",
        "name": "Máy giặt Toshiba Inverter 8.5 Kg TW-BL95A4V(SS)",
        "price": 7490000.0,
        "category": { "name": "Máy giặt", "code": "MAYGIAT" },
        "brand": { "name": "Toshiba", "country": "Nhật Bản" }
      }
    ]
    ```
* **Endpoint:** `GET /api/v1/products/{id}`
  * *Chức năng:* Lấy thông tin chi tiết của 1 sản phẩm theo ID.
  * *Mã phản hồi:* 200 OK hoặc 404 Not Found.
* **Endpoint:** `POST /api/v1/products`
  * *Chức năng:* Thêm mới một sản phẩm vào CSDL (HTTP `POST`).
  * *Mã phản hồi:* 201 Created.
* **Endpoint:** `DELETE /api/v1/products/{id}`
  * *Chức năng:* Xóa sản phẩm khỏi hệ thống (HTTP `DELETE`).
  * *Mã phản hồi:* 204 No Content.

---

# [TRANG 13: ĐẶC TẢ DANH MỤC RESTful APIs (PHẦN 2)]

### 2. Phân Hệ Tồn Kho Chi Nhánh (`InventoryApiController`)
* **Endpoint:** `GET /api/v1/inventory/branches`
  * *Chức năng:* Lấy danh sách các siêu thị chi nhánh Điện Máy Xanh.
* **Endpoint:** `GET /api/v1/inventory/check`
  * *Chức năng:* Tra cứu số lượng tồn kho theo sản phẩm và khu vực (phục vụ Client và AI Agent gọi Tool).
  * *Tham số bắt buộc:* `sku` (Mã sản phẩm), `district` (Tên quận/huyện).
  * *Response JSON mẫu (200 OK):*
    ```json
    {
      "id": 1,
      "product": { "sku": "DMX-MG-001", "name": "Máy giặt Toshiba 8.5 Kg" },
      "storeBranch": { "branchName": "ĐMX Lê Văn Việt", "district": "Quận 9" },
      "quantity": 3,
      "inStock": true
    }
    ```
* **Endpoint:** `GET /api/v1/inventory/branch/{branchId}`
  * *Chức năng:* Lấy toàn bộ danh mục sản phẩm và số lượng tồn của 1 siêu thị cụ thể.
* **Endpoint:** `PUT /api/v1/inventory/update`
  * *Chức năng:* Điều chỉnh số lượng hàng tồn kho của sản phẩm tại chi nhánh (HTTP `PUT`).
  * *Request Body:* `{"productId": 1, "branchId": 1, "quantity": 10}`
  * *Mã phản hồi:* 200 OK.

---

# [TRANG 14: ĐẶC TẢ DANH MỤC RESTful APIs (PHẦN 3)]

### 3. Phân Hệ Đơn Hàng & Bán Hàng (`OrderApiController`)
* **Endpoint:** `GET /api/v1/orders`
  * *Chức năng:* Lấy danh sách tất cả các đơn đặt mua hàng trong hệ thống.
* **Endpoint:** `GET /api/v1/orders/{id}`
  * *Chức năng:* Lấy thông tin chi tiết một đơn đặt hàng kèm danh sách các sản phẩm con.
* **Endpoint:** `POST /api/v1/orders`
  * *Chức năng:* Tạo đơn đặt mua hàng mới, tự động tính chiết khấu khuyến mãi và khấu trừ tồn kho (HTTP `POST`).
  * *Request Body mẫu:*
    ```json
    {
      "customerName": "Phạm Ngọc Lang",
      "phone": "0353700780",
      "shippingAddress": "Khu Công Nghệ Cao, Quận 9",
      "promoCode": "MWG5",
      "branchId": 1,
      "items": [
        { "productId": 1, "quantity": 1 }
      ]
    }
    ```
  * *Response JSON mẫu (201 Created):*
    ```json
    {
      "id": 1,
      "customerName": "Phạm Ngọc Lang",
      "totalAmount": 7115500.0,
      "status": "PENDING",
      "promotion": { "promoCode": "MWG5", "discountPercent": 5.0 }
    }
    ```
* **Endpoint:** `PUT /api/v1/orders/{id}/status?status=CONFIRMED`
  * *Chức năng:* Cập nhật trạng thái duyệt đơn hàng (HTTP `PUT`).

---

# [TRANG 15: HƯỚNG DẪN CÀI ĐẶT & VẬN HÀNH HỆ THỐNG]

### 1. Chuẩn Bị Môi Trường Cục Bộ
* Máy tính đã cài đặt **Java Development Kit (JDK 17 LTS)**.
* Hệ quản trị CSDL **MySQL 8.0** (cổng 3306) hoặc sử dụng profile **H2 Database** tự động nạp.

### 2. Thao Tác Khởi Chạy Ứng Dụng (Đúng 1 Lệnh Duy Nhất)
Nhờ kiến trúc Monorepo và cơ chế đóng gói tĩnh, toàn bộ nhóm và giảng viên không cần cài đặt Node.js hay npm:
```bash
# Bước 1: Di chuyển vào thư mục backend
cd backend

# Bước 2: Khởi chạy ứng dụng
./mvnw spring-boot:run
# (Đối với hệ điều hành Windows: mvnw.cmd spring-boot:run)
```

### 3. Cơ Chế Khởi Tạo Dữ Liệu Tự Động (`DataSeeder.java`)
Ứng dụng tích hợp `CommandLineRunner`, ngay khi khởi động sẽ tự động tạo bảng và nạp sẵn:
* 3 danh mục hàng hóa, 4 thương hiệu lớn.
* 2 siêu thị (ĐMX Lê Văn Việt Quận 9, ĐMX Đỗ Xuân Hợp Thủ Đức).
* 6 sản phẩm điện máy thực tế kèm giá bán niêm yết chuẩn.
* Tồn kho thực tế (có mặt hàng còn 4 cái, có mặt hàng hết hàng = 0 cái để test kịch bản out-of-stock).

---

# [TRANG 16: MINH CHỨNG GIAO DIỆN THỰC TẾ ỨNG DỤNG]

*(Dưới đây là mô tả bố cục và ảnh chụp 3 phân hệ giao diện thực tế đang chạy trên `http://localhost:8088`)*

```text
┌────────────────────────────────────────────────────────────────────────┐
│ [ẢNH CHỤP 1: LƯỚI DANH MỤC SẢN PHẨM & BỘ LỌC ĐA TIÊU CHÍ]              │
│ • Thanh Header mang nhận diện thương hiệu Điện Máy Xanh (#0284C7).      │
│ • Bộ lọc linh hoạt: Dropdown Danh mục, Thương hiệu, Ngân sách trần     │
│   và ô Tìm kiếm từ khóa realtime.                                      │
│ • Lưới thẻ sản phẩm hiển thị ảnh, mã SKU, thương hiệu và giá đỏ nổi bật│
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ [ẢNH CHỤP 2: MA TRẬN TỒN KHO THEO SIÊU THỊ CHI NHÁNH]                  │
│ • Dropdown lựa chọn chi nhánh (ĐMX Quận 9 / ĐMX Thủ Đức).              │
│ • Bảng ma trận dữ liệu hiển thị trạng thái "✓ Còn Hàng" (xanh lá) và   │
│   "✕ Hết Hàng" (đỏ) thời gian thực.                                    │
│ • Nút tương tác "Sửa tồn kho (PUT)" cập nhật số lượng tức thì.         │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ [ẢNH CHỤP 3: FORM ĐẶT HÀNG TỰ ĐỘNG KHẤU TRỪ TỒN KHO & DANH SÁCH ĐƠN]   │
│ • Cột trái: Form nhập thông tin người mua, chọn siêu thị, nhập mã MWG5 │
│ • Cột phải: Hàng đợi danh sách đơn hàng đã đặt thành công kèm tổng tiền│
│   đã áp dụng chiết khấu giảm giá chính xác.                            │
└────────────────────────────────────────────────────────────────────────┘
```

---

# [TRANG 17: KẾT LUẬN & HƯỚNG PHÁT TRIỂN]

### 1. Kết Luận Đánh Giá Kết Quả Đạt Được
* **Hoàn thành 100% mục tiêu môn học:** Xây dựng thành công ứng dụng web hướng dữ liệu theo mô hình MVC kết hợp RESTful Web Services trên nền tảng Spring Boot 3 và MySQL.
* **Quy mô CSDL đạt mức xuất sắc:** Thiết kế và ánh xạ hoàn chỉnh **10 bảng thực thể quan hệ** (đáp ứng mức trần tối đa trong khung 6 - 10 bảng của giảng viên).
* **Tuân thủ nguyên tắc phân công:** Thực hiện nghiêm túc mô hình **Phân hoạch dọc (Vertical Slicing)**, cả 3 thành viên đều trực tiếp viết code và làm chủ kiến trúc hệ thống.
* **Trải nghiệm người dùng vượt trội:** Tích hợp giao diện React SPA hiện đại, đóng gói tĩnh phục vụ qua một cổng duy nhất, tốc độ phản hồi dưới 1 giây.

### 2. Hướng Phát Triển Mở Rộng
* Tích hợp cơ chế bảo mật phân quyền người dùng (Spring Security & JWT).
* Mở rộng cổng thanh toán trực tuyến (VNPay / MoMo API).
* Tích hợp sâu với các tác tử trí tuệ nhân tạo (**Agentic AI**) thông qua giao thức Model Context Protocol (MCP) để tự động hóa hoàn toàn luồng tư vấn bán hàng đa chi nhánh.

---
**HẾT BẢN BÁO CÁO (TRỌN VẸN 17 TRANG CHUẨN FORM NỘP THẦY)**
