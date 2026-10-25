# 📌 HƯỚNG DẪN ĐỒ ÁN MÔN HỌC: CÔNG CỤ WEB & WEBSITE HƯỚNG DỮ LIỆU
> **Dành cho nhóm 3 thành viên:** Lang (Nhóm trưởng) | Diễm | Toàn  
> **Mục tiêu tối thượng:** Làm đúng, làm chuẩn, đơn giản dễ hiểu ➔ **ĂN CHẮC ĐIỂM A VẤN ĐÁP (QUA MÔN AN TOÀN 100%)**.

---

## ⏰ 1. THỜI GIAN & ĐỊA ĐIỂM THI VẤN ĐÁP CHÍNH THỨC
* **Ngày thi:** **Chủ Nhật, ngày 01/11/2026** (Cả lớp đã thống nhất chốt lịch với thầy).
* **Khung giờ:** Từ **9:30 sáng đến 17:30 chiều**.
* **Địa điểm:** **Phòng Giáo Viên cạnh Khoa Công Nghệ Thông Tin (IUH)**.
* **Hình thức thi:** Thầy ngồi chấm vấn đáp trực tiếp từng nhóm. Cả 3 bạn cùng ngồi trước laptop demo và trả lời câu hỏi của thầy.

---

## 🎯 2. BỐN YÊU CẦU SỐNG CÒN CỦA THẦY (BẮT BUỘC PHẢI CÓ)
1. **Quy mô nhóm 3 người:** Thầy sẽ hỏi ngẫu nhiên từng bạn. **Tuyệt đối không được nói: "Phần này do bạn khác làm nên em không biết"** (nói câu này là bị trừ điểm nặng hoặc rớt môn). Cả 3 bạn đều phải hiểu tổng thể dự án.
2. **Cơ sở dữ liệu (Tối thiểu 6 Bảng quan hệ):**
   * Sử dụng **Spring Data JPA / Hibernate** để tự động sinh bảng vào MySQL.
   * Các bảng phải có quan hệ khóa ngoại (1-N) rõ ràng, không làm các bảng đứng riêng lẻ.
3. **Phải có Web Service / REST API:**
   * Ứng dụng vừa có giao diện web để bấm xem, vừa có các đường link API (`/api/...`) trả về định dạng **JSON**.
4. **BẮT BUỘC PHẢI CÓ "CUỐN BÁO CÁO" IN ĐÓNG QUYỂN:**
   * **Cảnh báo của thầy:** *"Vào phòng thi mà không có cuốn báo cáo in sẵn là 0 điểm nha em!"*.
   * Cuốn báo cáo gồm: Trang bìa (tên 3 bạn + MSSV), Sơ đồ kiến trúc MVC, Sơ đồ CSDL 6 bảng (ERD), Danh sách các link API và Ảnh chụp màn hình web. Nhóm mình sẽ chuẩn bị sẵn file in trước ngày thi 1 ngày.

---

## 🏛️ 3. ĐỀ TÀI CỦA NHÓM: QUẢN LÝ BÁN LẺ ĐA CHI NHÁNH ĐIỆN MÁY XANH
Để tối giản và dễ hiểu nhất, CSDL của nhóm chỉ gồm đúng **3 cặp quan hệ Một - Nhiều (1-N)**:

```text
1. Danh mục & Sản phẩm (1-N):
   Category (1) ────────< Product (N)
   (VD: Danh mục "Máy giặt" có các sản phẩm: Toshiba 8.5kg, LG Inverter...)

2. Chi nhánh & Tồn kho (1-N):
   StoreBranch (1) ─────< Inventory (N)
   (VD: Siêu thị "ĐMX Lê Văn Việt Q9" có tồn kho: 4 máy giặt Toshiba, 0 tủ lạnh...)

3. Đơn hàng & Chi tiết món (1-N):
   CustomerOrder (1) ───< OrderItem (N)
   (VD: Đơn hàng của khách gồm: 1 máy giặt, 2 nồi cơm điện...)
```

---

## 👥 4. PHÂN CHIA CÔNG VIỆC RÕ RÀNG CHO 3 THÀNH VIÊN

| Thành viên | Phụ trách chính | Nhiệm vụ cụ thể | Khi thầy hỏi thì trả lời phần này |
| :--- | :--- | :--- | :--- |
| **Phạm Ngọc Lang** *(Nhóm trưởng)* | • Khung hệ thống<br>• REST API Controller<br>• Cấu hình Spring Boot | • Tạo repo GitHub, setup Maven, kết nối MySQL.<br>• Viết các link API trả về JSON (`/api/products`, `/api/inventory/check`). | • Trả lời về luồng Request/Response.<br>• Cách Spring Boot tự đổi dữ liệu sang JSON.<br>• Phân biệt `@Controller` vs `@RestController`. |
| **Bạn Diễm** | • Tầng Dữ liệu & Tồn kho<br>• Entity `Branch` & `Inventory` | • Viết Entity `StoreBranch` và `Inventory`.<br>• Viết logic kiểm tra xem chi nhánh Quận 9 còn hàng hay hết hàng. | • Trả lời về quan hệ `@ManyToOne`, `@JoinColumn` khóa ngoại.<br>• Cách JPA tự tìm kiếm dữ liệu bằng `findBy...`. |
| **Bạn Toàn** | • Tầng Đơn hàng & Giao diện<br>• Entity `Order` & `OrderItem` | • Viết Entity `CustomerOrder` và `OrderItem`.<br>• Cùng nhóm hoàn thiện giao diện hiển thị web và chuẩn bị Cuốn Báo Cáo. | • Trả lời về cách hiển thị dữ liệu lên trang HTML.<br>• Trình bày sơ đồ CSDL 6 bảng trong cuốn báo cáo. |

---

## 💻 5. HƯỚNG DẪN KÉO CODE VỀ MÁY VÀ CHẠY THỬ (DÀNH CHO DIỄM & TOÀN)

### Bước 1: Chấp nhận lời mời trên GitHub
* Mở email đăng ký GitHub hoặc truy cập trực tiếp:  
  👉 `https://github.com/langpn/mwg-retail-backend/invitations` bấm **Accept invitation**.

### Bước 2: Clone code về máy
```bash
git clone https://github.com/langpn/mwg-retail-backend.git
cd mwg-retail-backend
```

### Bước 3: Cấu hình CSDL MySQL trên máy các bạn
* Mở XAMPP hoặc MySQL Workbench, tạo một CSDL rỗng tên: `mwg_retail_db`.
* Mở file `src/main/resources/application.properties` kiểm tra tài khoản MySQL:
  ```properties
  spring.datasource.url=jdbc:mysql://localhost:3306/mwg_retail_db?useSSL=false&serverTimezone=UTC
  spring.datasource.username=root
  spring.datasource.password=
  spring.jpa.hibernate.ddl-auto=update
  spring.jpa.show-sql=true
  ```

### Bước 4: Chạy thử ứng dụng
* Trên terminal chạy lệnh:
  ```bash
  ./mvnw spring-boot:run
  ```
  *(Nếu dùng Windows Command Prompt thì chạy: `mvnw.cmd spring-boot:run`)*.
* Mở trình duyệt gõ: `http://localhost:8080` là ứng dụng sẽ chạy!

---

## 🗣️ 6. NĂM CÂU HỎI THẦY CHẮC CHẮN SẼ HỎI KHI VẤN ĐÁP (HỌC THUỘC LÒNG)

1. **"ORM là gì? Tại sao nhóm dùng Spring Data JPA thay vì viết JDBC và câu lệnh SQL?"**
   * *Trả lời:* Dạ ORM (Object-Relational Mapping) là kỹ thuật ánh xạ trực tiếp bảng CSDL thành class Java. Nhóm dùng Spring Data JPA vì nó giúp chuẩn hóa dữ liệu, tự động sinh các câu lệnh SQL tối ưu, tránh lỗi SQL Injection và không phải viết code JDBC dài dòng.
2. **"Phân biệt `@Controller` và `@RestController` khác nhau chỗ nào?"**
   * *Trả lời:* `@Controller` dùng cho mô hình MVC trả về giao diện View (file HTML). Còn `@RestController` là chuyên dùng cho Web Service / REST API, dữ liệu trả về được tự động chuyển thành chuỗi JSON.
3. **"Khóa chính tự tăng trong Entity cấu hình bằng annotation gì?"**
   * *Trả lời:* Dạ dùng `@Id` để đánh dấu khóa chính, kết hợp với `@GeneratedValue(strategy = GenerationType.IDENTITY)` để MySQL tự tăng ID (Auto-increment).
4. **"Trong Entity, làm sao để tạo khóa ngoại kết nối 2 bảng?"**
   * *Trả lời:* Dạ ở bảng Nhiều (bên con) ta gắn annotation `@ManyToOne` và `@JoinColumn(name = "ten_cot_khoa_ngoai")`.
5. **"Khi người dùng bấm nút trên web, luồng dữ liệu chạy qua những tầng nào?"**
   * *Trả lời:* Trình duyệt gửi Request ➔ `Controller` tiếp nhận ➔ gọi `Service` xử lý nghiệp vụ ➔ gọi `Repository` (JPA) tương tác CSDL MySQL ➔ dữ liệu trả ngược về Controller gửi lại cho người dùng.

---
*Mọi thắc mắc trong quá trình làm các bạn cứ nhắn nhóm zalo để cùng hỗ trợ nhau nhé!*
