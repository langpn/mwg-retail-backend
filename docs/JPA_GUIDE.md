# 📚 Hướng Dẫn JPA với Spring Boot - Student Model

## 🗂️ Cấu Trúc Dự Án

```
src/main/java/com/example/demojpa/
├── DemojpaApplication.java          ← Entry point + Demo CRUD
├── entity/
│   └── Student.java                 ← JPA Entity (map với bảng DB)
├── repository/
│   └── StudentRepository.java       ← Truy cập DB (CRUD + custom query)
├── service/
│   └── StudentService.java          ← Logic nghiệp vụ
└── controller/
    └── StudentController.java       ← REST API endpoints

src/main/resources/
└── application.properties           ← Cấu hình DB + JPA
```

---

## 🏗️ Kiến Trúc 3 Tầng (3-Layer Architecture)

```
[Client / Postman / Browser]
          ↕  HTTP + JSON
   ┌─────────────────────┐
   │  StudentController  │  @RestController  ← Nhận request, trả response
   └─────────────────────┘
          ↕  Java Objects
   ┌─────────────────────┐
   │   StudentService    │  @Service         ← Xử lý logic nghiệp vụ
   └─────────────────────┘
          ↕  Java Objects
   ┌─────────────────────┐
   │ StudentRepository   │  @Repository      ← Truy cập database
   └─────────────────────┘
          ↕  SQL
   ┌─────────────────────┐
   │    MySQL Database   │
   └─────────────────────┘
```

> [!NOTE]
> **Nguyên tắc quan trọng:** Controller chỉ nói chuyện với Service. Service mới nói chuyện với Repository. **Không bao giờ** inject Repository thẳng vào Controller!

---

## ⚙️ Bước 1: Cấu Hình Database

Mở [application.properties](file:///d:/iuh/hk2/web_huong_du_lieu/jpa_demo/jpa/demojpa/src/main/resources/application.properties) và **sửa password MySQL**:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jpa_demo_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=        # ← Nhập password của bạn
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

> [!NOTE]
> `createDatabaseIfNotExist=true` → tự động tạo database `jpa_demo_db`, không cần tạo thủ công trong MySQL.

---

## 🚀 Bước 2: Chạy Ứng Dụng

**Trong IDE:** Click chuột phải vào `DemojpaApplication.java` → **Run As → Spring Boot App**

**Bằng Terminal:**
```bash
cd d:\iuh\hk2\web_huong_du_lieu\jpa_demo\jpa\demojpa
./mvnw spring-boot:run
```

App chạy tại: `http://localhost:8080`

---

## 🧪 Bước 3: Test REST API

### Dùng Postman hoặc curl:

| Hành động | Method | URL |
|---|---|---|
| Lấy tất cả sinh viên | `GET` | `http://localhost:8080/api/students` |
| Lấy theo ID | `GET` | `http://localhost:8080/api/students/1` |
| Tìm theo tên | `GET` | `http://localhost:8080/api/students/search?name=an` |
| Lọc theo GPA | `GET` | `http://localhost:8080/api/students/gpa?min=3.5` |
| Đếm tổng số | `GET` | `http://localhost:8080/api/students/count` |
| Tạo mới | `POST` | `http://localhost:8080/api/students` |
| Cập nhật | `PUT` | `http://localhost:8080/api/students/1` |
| Xóa | `DELETE` | `http://localhost:8080/api/students/1` |

**Body JSON cho POST / PUT:**
```json
{
  "fullName": "Nguyen Van An",
  "email": "an@email.com",
  "dateOfBirth": "2003-05-15",
  "gpa": 3.8,
  "isActive": true
}
```

### HTTP Status Code trả về:

| Code | Ý nghĩa | Khi nào |
|---|---|---|
| `200 OK` | Thành công | GET, PUT thành công |
| `201 Created` | Đã tạo mới | POST thành công |
| `204 No Content` | Không có nội dung | DELETE thành công |
| `400 Bad Request` | Dữ liệu sai | Email bị trùng |
| `404 Not Found` | Không tìm thấy | ID không tồn tại |

---

## 🔍 Quan Sát Log SQL Khi Chạy

Vì `show-sql=true`, Hibernate in ra SQL thực thi:

```sql
-- Khi POST /api/students (tạo mới)
INSERT INTO students (date_of_birth, email, full_name, gpa, is_active)
VALUES (?, ?, ?, ?, ?)

-- Khi GET /api/students (lấy tất cả)
SELECT s.id, s.date_of_birth, s.email, s.full_name, s.gpa, s.is_active
FROM students s

-- Khi GET /api/students/1 (tìm theo ID)
SELECT s.id, ... FROM students s WHERE s.id = ?

-- Khi DELETE /api/students/1
DELETE FROM students WHERE id = ?
```

---

## 🧠 Giải Thích Annotations

### Entity ([Student.java](file:///d:/iuh/hk2/web_huong_du_lieu/jpa_demo/jpa/demojpa/src/main/java/com/example/demojpa/entity/Student.java)):

| Annotation | Ý nghĩa |
|---|---|
| `@Entity` | Class này là một bảng trong DB |
| `@Table(name="students")` | Tên bảng là `students` |
| `@Id` | Field này là Primary Key |
| `@GeneratedValue(strategy=IDENTITY)` | Dùng AUTO_INCREMENT của MySQL |
| `@Column(nullable=false)` | Cột này NOT NULL |
| `@Column(unique=true)` | Cột này UNIQUE |
| `@Column(length=100)` | VARCHAR(100) |

### Service ([StudentService.java](file:///d:/iuh/hk2/web_huong_du_lieu/jpa_demo/jpa/demojpa/src/main/java/com/example/demojpa/service/StudentService.java)):

| Annotation | Ý nghĩa |
|---|---|
| `@Service` | Đánh dấu đây là lớp Business Logic |

### Controller ([StudentController.java](file:///d:/iuh/hk2/web_huong_du_lieu/jpa_demo/jpa/demojpa/src/main/java/com/example/demojpa/controller/StudentController.java)):

| Annotation | Ý nghĩa |
|---|---|
| `@RestController` | `@Controller` + tự trả JSON |
| `@RequestMapping("/api/students")` | Base URL cho tất cả endpoint |
| `@GetMapping` | Xử lý HTTP GET |
| `@PostMapping` | Xử lý HTTP POST |
| `@PutMapping("/{id}")` | Xử lý HTTP PUT |
| `@DeleteMapping("/{id}")` | Xử lý HTTP DELETE |
| `@PathVariable` | Lấy từ URL path: `/students/{id}` |
| `@RequestParam` | Lấy từ query string: `?name=...` |
| `@RequestBody` | Lấy JSON từ request body |

---

## 📝 Bảng `ddl-auto` (Quan Trọng!)

| Giá trị | Hành vi | Khi nào dùng |
|---|---|---|
| `create` | **Xóa** bảng cũ, tạo mới mỗi lần chạy ⚠️ | Test nhanh |
| `create-drop` | Tạo khi start, **xóa** khi stop ⚠️ | Unit test |
| `update` | Chỉ thêm cột mới, giữ dữ liệu cũ ✅ | **Học/Dev** |
| `validate` | Chỉ kiểm tra, không thay đổi | Production |
| `none` | Không làm gì | Production |

> [!WARNING]
> **Không dùng `create` hay `create-drop` trong production** — sẽ mất toàn bộ dữ liệu!

---

## 🔑 Quy Tắc Đặt Tên Derived Query

Spring Data JPA tự sinh SQL dựa trên tên method:

```java
findByEmail(String email)                      // WHERE email = ?
findByGpaGreaterThan(Double gpa)               // WHERE gpa > ?
findByGpaGreaterThanEqual(Double gpa)          // WHERE gpa >= ?
findByIsActive(Boolean active)                 // WHERE is_active = ?
findByFullNameContaining(String keyword)       // WHERE full_name LIKE %?%
findByFullNameContainingIgnoreCase(String k)   // LOWER(full_name) LIKE LOWER(%?%)
findAllByOrderByFullNameAsc()                  // ORDER BY full_name ASC
findByGpaBetween(Double min, Double max)       // WHERE gpa BETWEEN ? AND ?
```

---

## 📁 Tất Cả Files Đã Tạo

| File | Link |
|---|---|
| Entity | [Student.java](file:///d:/iuh/hk2/web_huong_du_lieu/jpa_demo/jpa/demojpa/src/main/java/com/example/demojpa/entity/Student.java) |
| Repository | [StudentRepository.java](file:///d:/iuh/hk2/web_huong_du_lieu/jpa_demo/jpa/demojpa/src/main/java/com/example/demojpa/repository/StudentRepository.java) |
| Service | [StudentService.java](file:///d:/iuh/hk2/web_huong_du_lieu/jpa_demo/jpa/demojpa/src/main/java/com/example/demojpa/service/StudentService.java) |
| Controller | [StudentController.java](file:///d:/iuh/hk2/web_huong_du_lieu/jpa_demo/jpa/demojpa/src/main/java/com/example/demojpa/controller/StudentController.java) |
| Main App | [DemojpaApplication.java](file:///d:/iuh/hk2/web_huong_du_lieu/jpa_demo/jpa/demojpa/src/main/java/com/example/demojpa/DemojpaApplication.java) |
| Config | [application.properties](file:///d:/iuh/hk2/web_huong_du_lieu/jpa_demo/jpa/demojpa/src/main/resources/application.properties) |
