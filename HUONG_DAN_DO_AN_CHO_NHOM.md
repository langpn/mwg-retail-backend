# 📌 HƯỚNG DẪN BÀI TẬP LỚN TOÀN DIỆN CHO NHÓM (CHUẨN THEO LỜI THẦY DẶN)
> **Môn học:** Công cụ Web và Website hướng dữ liệu (IUH - Khóa 21BVL/21PVL)  
> **Nhóm thực hiện (3 thành viên):** Phạm Ngọc Lang (Nhóm trưởng) | Diễm | Toàn  
> **Đề tài chính thức:** **Hệ Thống Quản Lý Dữ Liệu & Bán Lẻ Đa Chi Nhánh Điện Máy Xanh (`mwg-retail-backend`)**  
> **Kho mã nguồn GitHub:** [https://github.com/langpn/mwg-retail-backend](https://github.com/langpn/mwg-retail-backend)  
> **Lịch thi vấn đáp chính thức:** **Chủ Nhật, ngày 01/11/2026** (Từ 9:00 sáng đến 17:30 chiều tại Phòng Giáo Viên cạnh Khoa CNTT).

---

## 🚨 I. BỐN NGUYÊN TẮC BẮT BUỘC ĐỂ QUA MÔN VÀ LẤY ĐIỂM CAO

1. **Điều kiện sống còn:** Hoàn thành và có điểm Bài tập lớn thì mới có tên trong danh sách thi lý thuyết cuối kỳ.
2. **Quy tắc phân công "Phân hoạch dọc" (CỰC KỲ QUAN TRỌNG):**
   * **Thầy cấm tuyệt đối phân hoạch ngang:** Không được để 1 bạn chỉ viết báo cáo, 1 bạn chỉ làm frontend, 1 bạn gánh hết backend.
   * **Bắt buộc phân hoạch dọc (Vertical Slicing):** Cả 3 thành viên đều phải tham gia viết code, mỗi người làm trọn vẹn một phân hệ (từ Entity ➔ Repository ➔ Service ➔ Controller ➔ Giao diện) để bạn nào cũng hiểu toàn bộ luồng hoạt động của hệ thống.
3. **Hình thức thi vấn đáp trực tiếp:**
   * Thầy sẽ chỉ ngẫu nhiên vào bất kỳ dòng code hoặc chức năng nào trên máy tính. Từng thành viên phải tự giải thích được dòng code đó hoạt động thế nào.
   * **Tuyệt đối không được nói:** *"Phần này do bạn khác làm nên em không rõ"* (nói câu này sẽ bị trừ điểm nặng hoặc trượt môn).
4. **Quyển báo cáo in ấn:**
   * Bắt buộc có quyển báo cáo in đóng bìa nộp cho thầy khi vào phòng thi (Không có báo cáo = 0 điểm).
   * **Quy mô:** **Khoảng 17 trang trở lại** (súc tích, có sơ đồ Use Case, sơ đồ kiến trúc MVC, sơ đồ CSDL ERD 6 bảng và mô tả chức năng).

---

## 🏛️ II. CÔNG NGHỆ & CƠ SỞ DỮ LIỆU CỦA ĐỒ ÁN (ĐÚNG CHUẨN CỦA THẦY)

* **Kiến trúc:** Mô hình phân tầng **MVC** kết hợp **RESTful API** (Spring Boot 3 + Java 17).
* **Tầng Dữ liệu (ORM):** Dùng **Spring Data JPA & Hibernate** ánh xạ Java Entity thành bảng trong MySQL (không dùng JDBC thủ công).
* **Web Service:** Cung cấp đầy đủ các phương thức HTTP:
  * `GET`: Lấy dữ liệu danh mục, sản phẩm, tồn kho.
  * `POST`: Thêm mới sản phẩm, tạo đơn hàng.
  * `PUT`: Cập nhật số lượng tồn kho.
  * `DELETE`: Xóa sản phẩm.
* **Giao diện:** HTML5, CSS3, JavaScript/JQuery, Bootstrap 5 kết hợp Thymeleaf Engine.
* **CSDL MySQL (Đúng chuẩn 6 bảng quan hệ 1-N):**
  1. `categories` (Danh mục: Tivi, Tủ lạnh, Máy giặt...)
  2. `products` (Sản phẩm điện máy chi tiết)
  3. `store_branches` (Chi nhánh siêu thị: Lê Văn Việt Q9, ĐMX Thủ Đức...)
  4. `inventories` (Số lượng tồn kho theo từng chi nhánh)
  5. `customer_orders` (Đơn đặt mua hàng của khách)
  6. `order_items` (Chi tiết từng món trong đơn)

---

## 👥 III. PHÂN HOẠCH DỌC CHO 3 THÀNH VIÊN (MỖI NGƯỜI 1 NHÁNH NGHIỆP VỤ)

Để đúng chuẩn "Phân hoạch dọc" của thầy, mỗi bạn phụ trách trọn vẹn 1 cặp bảng liên kết:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PHÂN CÔNG DỌC TRỌN VẸN (VERTICAL SLICING)                       │
├──────────────────────────┬──────────────────────────────┬──────────────────────────────┤
│ PHÂN HỆ 1: SẢN PHẨM      │ PHÂN HỆ 2: TỒN KHO CHI NHÁNH │ PHÂN HỆ 3: ĐƠN HÀNG          │
│ Phụ trách: LANG          │ Phụ trách: DIỄM              │ Phụ trách: TOÀN              │
├──────────────────────────┼──────────────────────────────┼──────────────────────────────┤
│ • Entity: Category,      │ • Entity: StoreBranch,       │ • Entity: CustomerOrder,     │
│   Product (1-N)          │   Inventory (1-N)            │   OrderItem (1-N)            │
│ • Repository: CategoryRepo,│ • Repository: BranchRepo,  │ • Repository: OrderRepo,     │
│   ProductRepo            │   InventoryRepo              │   OrderItemRepo              │
│ • Service: ProductService│ • Service: InventoryService  │ • Service: OrderService      │
│ • API: GET/POST /products│ • API: GET/PUT /inventory    │ • API: POST /orders          │
│ • Giao diện: Lưới sản phẩm│ • Giao diện: Tra cứu tồn kho│ • Giao diện: Form đặt hàng   │
└──────────────────────────┴──────────────────────────────┴──────────────────────────────┘
```

### 1. Phạm Ngọc Lang (Nhóm trưởng):
* **Phụ trách Phân hệ Sản phẩm & Danh mục:** Quản lý danh mục hàng hóa, thêm/sửa/xóa sản phẩm, lọc theo khoảng giá.
* **Nhiệm vụ chung:** Khởi tạo khung dự án, cấu hình `pom.xml`, `application.properties` kết nối MySQL, kiểm tra tiến độ chung.

### 2. Bạn Diễm:
* **Phụ trách Phân hệ Siêu thị & Tồn kho:** Quản lý danh sách chi nhánh (`StoreBranch`) và quản lý số lượng tồn kho từng sản phẩm tại mỗi siêu thị (`Inventory`).
* **Nhiệm vụ cụ thể:**
  - Viết `InventoryService` xử lý logic: Kiểm tra xem tại siêu thị Quận 9 sản phẩm X còn bao nhiêu cái.
  - Viết API `GET /api/inventory/check?branchId=...&productId=...` trả về JSON.
  - Phụ trách trang hiển thị tra cứu tồn kho theo siêu thị.

### 3. Bạn Toàn:
* **Phụ trách Phân hệ Đơn hàng & Bán hàng:** Quản lý thông tin khách mua hàng (`CustomerOrder`) và chi tiết món (`OrderItem`).
* **Nhiệm vụ cụ thể:**
  - Viết `OrderService` xử lý logic: Khi khách đặt hàng thì tạo đơn và trừ số lượng tương ứng trong bảng tồn kho `Inventory`.
  - Viết API `POST /api/orders` tiếp nhận đơn hàng JSON từ web.
  - Phụ trách form đặt hàng và đồng phụ trách hoàn thiện Cuốn Báo Cáo 17 trang.

---

## 📑 IV. DÀN Ý CUỐN BÁO CÁO 17 TRANG (CHUẨN BỊ IN ĐÓNG QUYỂN)

Thầy quy định báo cáo **khoảng 17 trang trở lại**, nhóm sẽ bố cục súc tích như sau:
* **Trang 1:** Trang bìa (Logo IUH, Tên đề tài, Tên môn học, Thông tin 3 thành viên: Lang, Diễm, Toàn + MSSV).
* **Trang 2:** Mục lục & Bảng phân công công việc (nêu rõ phân hoạch dọc 3 bạn cùng code).
* **Trang 3 – 4:** Giới thiệu đề tài, bối cảnh chuỗi bán lẻ ĐMX và mục tiêu hệ thống.
* **Trang 5 – 6:** Sơ đồ Use Case tổng quát và kịch bản sử dụng (Xem hàng ➔ Tra cứu tồn kho ➔ Đặt mua).
* **Trang 7 – 8:** Kiến trúc kỹ thuật hệ thống (Mô hình MVC, luồng dữ liệu 3 tầng, Spring Boot & REST API).
* **Trang 9 – 11:** Sơ đồ CSDL Thực thể Quan hệ (**ERD 6 bảng**) & Chi tiết các bảng, khóa chính, khóa ngoại.
* **Trang 12 – 14:** Đặc tả danh mục RESTful API (Endpoint, method GET/POST/PUT/DELETE, JSON request/response).
* **Trang 15 – 16:** Ảnh chụp giao diện thực tế của ứng dụng đang chạy trên `localhost:8080`.
* **Trang 17:** Kết luận, đánh giá mức độ hoàn thành và hướng phát triển.

---

## 💻 V. HƯỚNG DẪN KÉO CODE VỀ MÁY & CHẠY LOCALHOST (DIỄM & TOÀN)

### Bước 1: Vào link GitHub bấm chấp nhận lời mời:
👉 `https://github.com/langpn/mwg-retail-system/invitations` bấm **Accept invitation**.

### Bước 2: Mở Terminal (hoặc Git Bash) gõ lệnh:
```bash
git clone https://github.com/langpn/mwg-retail-system.git
cd mwg-retail-system
```

### Bước 3: Tạo CSDL trên máy các bạn:
* Mở XAMPP hoặc MySQL Workbench, tạo 1 database tên là: `mwg_retail_db`.
* Mở file `backend/src/main/resources/application.properties` kiểm tra cấu hình:
  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/mwg_retail_db?useSSL=false&serverTimezone=UTC
  spring.datasource.username=root
  spring.datasource.password=
  spring.jpa.hibernate.ddl-auto=update
  spring.jpa.show-sql=true
  ```

### Bước 4: Chạy thử ứng dụng:
* Trên máy macOS/Linux: `cd backend && ./mvnw spring-boot:run`
* Trên máy Windows: `cd backend && mvnw.cmd spring-boot:run`
* Mở trình duyệt gõ: `http://localhost:8080` (Giao diện React hiện đại sẽ tự động hiển thị mượt mà!).

---

## 🗣️ VI. BỘ CÂU HỎI VẤN ĐÁP THẦY SẼ KHUI RA HỎI (HỌC THUỘC LÒNG ĐỂ ĐẠT 8.5 - 10 ĐIỂM)

1. **"ORM là gì? Tại sao nhóm dùng Spring Data JPA mà không dùng JDBC thuần?"**
   * *Trả lời:* Dạ ORM (Object-Relational Mapping) là kỹ thuật ánh xạ trực tiếp bảng CSDL thành class Java. Nhóm dùng Spring Data JPA vì nó giúp chuẩn hóa dữ liệu, tự động sinh các câu lệnh SQL tối ưu, tránh lỗi SQL Injection và giải phóng lập trình viên khỏi việc viết hàng trăm dòng code JDBC lặp đi lặp lại.
2. **"Phân biệt `@Controller` và `@RestController` khác nhau chỗ nào?"**
   * *Trả lời:* `@Controller` dùng cho mô hình MVC trả về tên file giao diện HTML (View) qua Thymeleaf. Còn `@RestController` là chuyên dùng cho Web Service / REST API, dữ liệu trả về được Spring tự động chuyển đổi thành chuỗi JSON qua thư viện Jackson.
3. **"Khóa chính tự tăng trong Entity cấu hình bằng annotation gì?"**
   * *Trả lời:* Dạ dùng `@Id` để đánh dấu khóa chính, kết hợp với `@GeneratedValue(strategy = GenerationType.IDENTITY)` để MySQL tự quản lý tăng ID (Auto-increment).
4. **"Trong Entity, làm sao để tạo khóa ngoại kết nối 2 bảng?"**
   * *Trả lời:* Dạ ở bảng Nhiều (bên con) ta gắn annotation `@ManyToOne` và `@JoinColumn(name = "ten_cot_khoa_ngoai")`. Ở bảng Một (bên cha) ta gắn `@OneToMany(mappedBy = "...")` để xác định quan hệ 2 chiều.
5. **"Làm sao chống lỗi vòng lặp vô hạn (Infinite Recursion) khi xuất dữ liệu JSON ở quan hệ 1-N?"**
   * *Trả lời:* Dạ ta gắn annotation `@JsonIgnore` trên thuộc tính danh sách đối tượng liên kết nghịch, hoặc tạo class DTO (Data Transfer Object) để chỉ bóc tách các trường dữ liệu cần thiết trả về cho Client.
6. **"Khi người dùng bấm nút trên web, luồng dữ liệu chạy qua những tầng nào?"**
   * *Trả lời:* Trình duyệt gửi HTTP Request ➔ `Controller` tiếp nhận ➔ gọi `Service` xử lý nghiệp vụ ➔ gọi `Repository` (JPA) tương tác CSDL MySQL ➔ dữ liệu trả ngược về Controller gửi lại JSON hoặc render giao diện cho người dùng.

---
*Nhóm mình cùng bám sát kế hoạch này để hoàn thành sớm trước ngày 30/10, in báo cáo và tự tin đạt điểm A nhé!*
