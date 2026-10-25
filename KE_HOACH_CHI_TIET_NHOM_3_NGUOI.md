# 📋 KẾ HOẠCH HÀNH ĐỘNG CHI TIẾT & PHÂN CHIA NHIỆM VỤ NHÓM 3 NGƯỜI
> **Dự án:** MWG Retail Multi-Branch System (`mwg-retail-system`)  
> **Môn học:** Công cụ Web và Website hướng dữ liệu (IUH - Lớp 21BVL/21PVL)  
> **Nhóm thực hiện (3 thành viên):**  
> 1. **Phạm Ngọc Lang** (Nhóm trưởng - Phụ trách Phân hệ 1 & Hạ tầng)  
> 2. **Bạn Diễm** (Thành viên - Phụ trách Phân hệ 2: Tồn kho & Siêu thị)  
> 3. **Bạn Toàn** (Thành viên - Phụ trách Phân hệ 3: Đơn hàng & Khách hàng)  
> **Lịch thi vấn đáp chính thức:** **Chủ Nhật, ngày 01/11/2026** (Từ 9:00 sáng đến 17:30 chiều tại Phòng Giáo Viên cạnh Khoa CNTT).

---

## 🧭 I. TÔN CHỈ THI CỬ & QUY TẮC "PHÂN HOẠCH DỌC" (VERTICAL SLICING)

1. **Quy tắc bất biến của thầy:**
   * **Cấm phân hoạch ngang:** Không để 1 người chỉ viết báo cáo hoặc 1 người gánh hết code. Thầy sẽ chỉ ngẫu nhiên vào bất kỳ dòng code nào trên máy, bạn nào không giải thích được sẽ bị kéo điểm cả nhóm xuống hoặc trượt môn.
   * **Bắt buộc phân hoạch dọc (Vertical Slicing):** Mỗi thành viên phụ trách **trọn vẹn một nhánh chức năng từ đầu đến cuối**:
     `Entity (JPA)` ➔ `Repository` ➔ `Service` ➔ `Controller (REST API)` ➔ `Giao diện (Frontend)`.
2. **Quy mô CSDL:** Thiết kế đúng **10 BẢNG** (chạm đúng trần tối đa trong khung 6 - 10 bảng của thầy) để ăn trọn điểm xuất sắc 9.0 – 10.0.
3. **Hai vật phẩm bắt buộc mang vào phòng thi:**
   * **Vật phẩm 1: Cuốn Báo Cáo in sẵn (17 trang trở lại):** Nhóm in sẵn đóng quyển nộp cho thầy trước khi bắt đầu vấn đáp.
   * **Vật phẩm 2: Laptop chạy sẵn ứng dụng:** MySQL Server cổng 3306 + Spring Boot cổng 8080 nạp sẵn dữ liệu test qua `DataSeeder.java`.

---

## 🏛️ II. BẢN ĐỒ CSDL 10 BẢNG & PHÂN CÔNG PHỤ TRÁCH DỌC

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PHÂN CÔNG DỌC TRỌN VẸN CHO 3 THÀNH VIÊN                         │
├──────────────────────────┬──────────────────────────────┬──────────────────────────────┤
│ 🏷️ PHÂN HỆ 1: SẢN PHẨM   │ 🏬 PHÂN HỆ 2: TỒN KHO & KHO  │ 🛒 PHÂN HỆ 3: ĐƠN HÀNG       │
│ Phụ trách: LANG          │ Phụ trách: DIỄM              │ Phụ trách: TOÀN              │
├──────────────────────────┼──────────────────────────────┼──────────────────────────────┤
│ 1. categories (Danh mục) │ 4. store_branches (Siêu thị) │ 7. customers (Khách hàng)    │
│ 2. brands (Thương hiệu)  │ 5. inventories (Tồn kho c/n) │ 8. promotions (Khuyến mãi)   │
│ 3. products (Sản phẩm)   │ 6. product_reviews (Đánh giá)│ 9. customer_orders (Đơn hàng)│
│                          │                              │ 10. order_items (Chi tiết)   │
├──────────────────────────┼──────────────────────────────┼──────────────────────────────┤
│ 📂 File Code đảm nhiệm:  │ 📂 File Code đảm nhiệm:      │ 📂 File Code đảm nhiệm:      │
│ • Category.java          │ • StoreBranch.java           │ • Customer.java              │
│ • Brand.java             │ • Inventory.java             │ • Promotion.java             │
│ • Product.java           │ • ProductReview.java         │ • CustomerOrder.java         │
│ • CategoryRepository     │ • StoreBranchRepository      │ • OrderItem.java             │
│ • BrandRepository        │ • InventoryRepository        │ • CustomerRepository         │
│ • ProductRepository      │ • ProductReviewRepository    │ • PromotionRepository        │
│ • ProductCatalogService  │ • InventoryService           │ • CustomerOrderRepository    │
│ • ProductApiController   │ • InventoryApiController     │ • OrderItemRepository        │
│ • Giao diện Lưới sản phẩm│ • Giao diện Tra cứu tồn kho  │ • OrderProcessingService     │
│                          │                              │ • OrderApiController         │
│                          │                              │ • Giao diện Đặt hàng & Báo cáo│
└──────────────────────────┴──────────────────────────────┴──────────────────────────────┘
```

---

## 📅 III. LỊCH TRÌNH TÁC CHIẾN 6 NGÀY (26/10 ➔ 01/11)

| Ngày | Mục tiêu chặng | Nhiệm vụ cụ thể của từng thành viên |
| :---: | :--- | :--- |
| **26/10 (T2)** | **Hoàn thiện 10 Entities JPA & Khởi tạo CSDL** | • **Lang:** Dựng xong `Category`, `Brand`, `Product` + Setup `pom.xml`, cấu hình MySQL `application.properties`.<br>• **Diễm:** Dựng `StoreBranch`, `Inventory`, `ProductReview`.<br>• **Toàn:** Dựng `Customer`, `Promotion`, `CustomerOrder`, `OrderItem`.<br>➔ **Nghiệm thu:** Chạy `./mvnw compile` thành công, MySQL tự động sinh 10 bảng. |
| **27/10 (T3)** | **10 Repositories & DataSeeder mẫu** | • Cả 3 bạn tạo các file Repository tương ứng kế thừa `JpaRepository<T, Long>`.<br>• Viết các hàm tìm kiếm: `findByCategory_Code`, `findByStoreBranch_District`, `findByPhone`.<br>• **Lang:** Viết `DataSeeder.java` tự động nạp sẵn 15 sản phẩm, 4 thương hiệu, 2 siêu thị (Q.9, Thủ Đức).<br>➔ **Nghiệm thu:** Chạy app là CSDL tự động có dữ liệu mẫu đầy đủ. |
| **28/10 (T4)** | **Tầng Service & RESTful Web Service** | • **Lang:** Viết `ProductCatalogService` & `ProductApiController` (`GET /api/v1/products`).<br>• **Diễm:** Viết `InventoryService` & `InventoryApiController` (`GET /api/v1/inventory/check`).<br>• **Toàn:** Viết `OrderProcessingService` & `OrderApiController` (`POST /api/v1/orders`).<br>➔ **Nghiệm thu:** Test các link API trả về JSON mượt mà trên Postman/trình duyệt. |
| **29/10 (T5)** | **Giao diện Web & Tích hợp Frontend** | • Ghép giao diện hiển thị danh mục, lưới sản phẩm có hình ảnh, giá bán.<br>• Ghép bảng tra cứu tồn kho theo siêu thị (Quận 9, Thủ Đức).<br>• Form tạo đơn hàng và thông báo đặt hàng thành công.<br>➔ **Nghiệm thu:** Ứng dụng chạy mượt mà trên `http://localhost:8080`. |
| **30/10 (T6)** | **Soạn thảo Cuốn Báo Cáo 17 Trang** | • **Toàn + Diễm:** Soạn nội dung theo dàn ý 17 trang (Use Case, vẽ sơ đồ ERD 10 bảng, chụp ảnh giao diện web).<br>• **Lang:** Viết phần đặc tả kỹ thuật MVC, danh mục REST API JSON.<br>➔ **Nghiệm thu:** Xuất xưởng file Word/PDF `CUON_BAO_CAO_17_TRANG.pdf`. |
| **31/10 (T7)** | **In Báo Cáo & Tổng Duyệt Vấn Đáp** | • Mang file ra tiệm in đóng quyển đẹp mắt (mỗi bạn cầm 1 cuốn đọc).<br>• Cả nhóm họp offline/online 60 phút, kiểm tra chéo 5 câu hỏi vấn đáp của thầy.<br>• Kiểm tra lại laptop: Đảm bảo MySQL và Spring Boot chạy offline ổn định 100%. |
| **01/11 (CN)** | **NGÀY THI VẤN ĐÁP TẠI TRƯỜNG (9:00 - 17:30)** | **BƯỚC VÀO PHÒNG THI TỰ TIN — CẦM CHẮC ĐIỂM A (9.5 - 10.0)!** |

---

## 📑 IV. DÀN Ý CUỐN BÁO CÁO 17 TRANG (CHUẨN FORM NỘP THẦY)

* **Trang 1:** Trang bìa chính thức (Logo IUH, Tên đề tài, Tên môn học, Thông tin 3 thành viên: Lang, Diễm, Toàn + MSSV).
* **Trang 2:** Mục lục & Bảng phân công công việc (nêu rõ phân hoạch dọc 3 bạn cùng code).
* **Trang 3 – 4:** Bối cảnh đề tài chuỗi bán lẻ Điện Máy Xanh và mục tiêu giải quyết bài toán tồn kho đa chi nhánh.
* **Trang 5 – 6:** Sơ đồ Use Case tổng quát và kịch bản người dùng (Xem danh mục ➔ Tra cứu tồn kho chi nhánh ➔ Đặt mua hàng).
* **Trang 7 – 8:** Kiến trúc kỹ thuật hệ thống (Mô hình 3 tầng MVC, Spring Boot 3, Hibernate ORM, Web Service).
* **Trang 9 – 11:** Sơ đồ CSDL Thực thể Quan hệ (**ERD 10 bảng**) & Mô tả chi tiết các bảng, kiểu dữ liệu, khóa chính, khóa ngoại.
* **Trang 12 – 14:** Đặc tả danh mục RESTful API (HTTP Verbs: `GET`, `POST`, `PUT`, `DELETE`, URL, JSON payload mẫu).
* **Trang 15 – 16:** Ảnh chụp giao diện thực tế của ứng dụng đang chạy trên máy tính.
* **Trang 17:** Kết luận, đánh giá kết quả đạt được và hướng phát triển hệ thống.

---

## 🗣️ V. BỘ 5 CÂU HỎI THẦY SẼ KHUI RA HỎI VẤN ĐÁP (HỌC THUỘC LÒNG)

1. **"ORM là gì? Tại sao nhóm dùng Spring Data JPA thay vì viết JDBC và câu lệnh SQL?"**
   * *Trả lời:* Dạ ORM (Object-Relational Mapping) là kỹ thuật ánh xạ trực tiếp bảng CSDL thành class Java. Nhóm dùng Spring Data JPA vì nó giúp chuẩn hóa dữ liệu, tự động sinh các câu lệnh SQL tối ưu, tránh lỗi SQL Injection và giải phóng lập trình viên khỏi việc viết hàng trăm dòng code JDBC lặp đi lặp lại.
2. **"Phân biệt `@Controller` và `@RestController` khác nhau chỗ nào?"**
   * *Trả lời:* `@Controller` dùng cho mô hình MVC trả về tên file giao diện HTML (View) qua Thymeleaf. Còn `@RestController` là chuyên dùng cho Web Service / REST API, dữ liệu trả về được Spring tự động chuyển đổi thành chuỗi JSON qua thư viện Jackson.
3. **"Khóa chính tự tăng trong Entity cấu hình bằng annotation gì?"**
   * *Trả lời:* Dạ dùng `@Id` để đánh dấu khóa chính, kết hợp với `@GeneratedValue(strategy = GenerationType.IDENTITY)` để MySQL tự quản lý tăng ID (Auto-increment).
4. **"Trong Entity, làm sao để tạo khóa ngoại kết nối 2 bảng?"**
   * *Trả lời:* Dạ ở bảng Nhiều (bên con) ta gắn annotation `@ManyToOne` và `@JoinColumn(name = "ten_cot_khoa_ngoai")`. Ở bảng Một (bên cha) ta gắn `@OneToMany(mappedBy = "...")` để xác định quan hệ 2 chiều.
5. **"Làm sao chống lỗi vòng lặp vô hạn (Infinite Recursion) khi xuất dữ liệu JSON ở quan hệ 1-N?"**
   * *Trả lời:* Dạ ta gắn annotation `@JsonIgnore` trên thuộc tính danh sách đối tượng liên kết nghịch, hoặc tạo class DTO (Data Transfer Object) để chỉ bóc tách các trường dữ liệu cần thiết trả về cho Client.

---
*Kế hoạch này đã được lưu chính thức trên repo `mwg-retail-system`. Cả nhóm cùng nhau bám sát để về đích an toàn và đạt điểm A tuyệt đối nhé!*
