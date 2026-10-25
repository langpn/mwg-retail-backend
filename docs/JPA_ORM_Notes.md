# 📚 Ôn Tập JPA / ORM — Chuẩn bị buổi học mới

---

## PHẦN 1 — ORM là gì? Ánh xạ Table ↔ Java Class

### 🔑 Vấn đề cốt lõi ORM giải quyết

Trong lập trình, ta có **2 thế giới song song**:

| Thế giới Database (SQL) | Thế giới Java (OOP) |
|---|---|
| Table (bảng) | Class |
| Row (hàng dữ liệu) | Object (đối tượng) |
| Column (cột) | Field / Property |
| Primary Key | `@Id` field |
| Foreign Key | Reference / Object |

**ORM (Object-Relational Mapping)** là kỹ thuật tự động chuyển đổi qua lại giữa 2 thế giới này.
**JPA (Java Persistence API)** là chuẩn ORM phổ biến nhất trong Java.

---

### 🔧 Cơ chế hoạt động: GET / SET

Khi JPA **đọc dữ liệu từ DB lên Java** (SELECT):

```
DB Row: | 1 | "Nguyen Van A" | "a@iuh.edu.vn" |
              ↓ JPA đọc từng cột, gọi setter
Java:   student.setId(1L)
        student.setFullName("Nguyen Van A")
        student.setEmail("a@iuh.edu.vn")
```

Khi JPA **lưu đối tượng Java xuống DB** (INSERT/UPDATE):

```
Java:   student.getId()       → 1
        student.getFullName() → "Nguyen Van A"
              ↓ JPA gọi getter, tạo câu SQL
DB:     INSERT INTO students(full_name, email) VALUES ('Nguyen Van A', 'a@iuh.edu.vn')
```

> ⚠️ **Getter & Setter là BẮT BUỘC** — JPA dùng chúng để đọc/ghi dữ liệu!

---

### 📌 Phân tích `Student.java` — từng annotation

```java
@Entity                          // (1) Đánh dấu class này là Entity JPA
@Table(name = "students")        // (2) Map với bảng "students" trong DB
public class Student {

    @Id                          // (3) Đây là Primary Key
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // (4) AUTO_INCREMENT
    private Long id;

    @Column(name = "full_name",  // (5) Map với cột "full_name"
            nullable = false,    //     NOT NULL
            length = 100)        //     VARCHAR(100)
    private String fullName;

    @Column(name = "email",
            nullable = false,
            unique = true,       //     UNIQUE constraint
            length = 150)
    private String email;

    // ✅ Constructor KHÔNG tham số — BẮT BUỘC với JPA
    // JPA cần nó để tạo đối tượng khi đọc dữ liệu từ DB về
    public Student() {}

    // Getters & Setters — JPA dùng để đọc/ghi field
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    // ...
}
```

**SQL tương đương JPA tự sinh ra:**

```sql
CREATE TABLE students (
    id            BIGINT       AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    date_of_birth DATE,
    gpa           DOUBLE,
    is_active     BOOLEAN
);
```

---

### 📋 Bảng tổng hợp các Annotation cơ bản

| Annotation | Vị trí | Ý nghĩa |
|---|---|---|
| `@Entity` | Class | Đây là JPA Entity, map với 1 bảng DB |
| `@Table(name="...")` | Class | Chỉ định tên bảng (nếu khác tên class) |
| `@Id` | Field | Field này là Primary Key |
| `@GeneratedValue` | Field (cạnh @Id) | Cách sinh PK tự động |
| `@Column(...)` | Field | Tùy chỉnh cột DB |
| `@Transient` | Field | Field này KHÔNG map với cột nào |

---

### ⚙️ Các chiến lược `@GeneratedValue`

| Strategy | Cơ chế | Dùng khi |
|---|---|---|
| `IDENTITY` | AUTO_INCREMENT của MySQL | ✅ Phổ biến nhất với MySQL |
| `SEQUENCE` | Dùng SEQUENCE của DB | PostgreSQL, Oracle |
| `AUTO` | JPA tự chọn | Linh hoạt, không cần quan tâm |
| `TABLE` | Bảng phụ quản lý ID | Ít dùng |

---

## PHẦN 2 — Mối quan hệ giữa các Entity

### 🗺️ Tổng quan 3 loại quan hệ

```
@OneToOne   →  1 Student   ↔  1 Profile
@OneToMany  →  1 Teacher   →  N Course
@ManyToMany →  N Student   ↔  N Course
```

---

## 2.1 — `@OneToOne` (1 ↔ 1)

**Ví dụ thực tế:** Mỗi sinh viên có đúng 1 hồ sơ (Profile).

```
students table              student_profiles table
┌────┬──────────┐           ┌────┬──────────────┬────────────┐
│ id │ full_name│           │ id │ phone_number │ student_id │◄── FK
├────┼──────────┤           ├────┼──────────────┼────────────┤
│  1 │ Nguyen A │           │  1 │ 0901234567   │     1      │
│  2 │ Tran B   │           │  2 │ 0987654321   │     2      │
└────┴──────────┘           └────┴──────────────┴────────────┘
```

**Code Java:**

```java
// Phía "cha" — Student
@Entity
@Table(name = "students")
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;

    // 1 Student có 1 Profile
    @OneToOne(mappedBy = "student", cascade = CascadeType.ALL)
    private StudentProfile profile;
}
```

```java
// Phía "con" — sở hữu FK
@Entity
@Table(name = "student_profiles")
public class StudentProfile {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String phoneNumber;

    // Phía này sở hữu FK → đặt @JoinColumn ở đây
    @OneToOne
    @JoinColumn(name = "student_id")
    private Student student;
}
```

**Giải thích:**
- `@JoinColumn(name = "student_id")` → bảng `student_profiles` có cột `student_id` là FK
- `mappedBy = "student"` → báo JPA phía `StudentProfile` đang sở hữu FK
- `cascade = CascadeType.ALL` → xóa Student thì xóa Profile theo luôn

---

## 2.2 — `@OneToMany` / `@ManyToOne` (1 ↔ N)

**Ví dụ thực tế:** 1 giảng viên dạy nhiều môn học.

```
teachers table              courses table
┌────┬──────────┐           ┌────┬──────────────┬────────────┐
│ id │ name     │           │ id │ course_name  │ teacher_id │◄── FK
├────┼──────────┤           ├────┼──────────────┼────────────┤
│  1 │ Thay A   │           │  1 │ Java Web     │     1      │
│  2 │ Thay B   │           │  2 │ Database     │     1      │
└────┴──────────┘           │  3 │ Python       │     2      │
                            └────┴──────────────┴────────────┘
```

**Code Java:**

```java
// Phía "1" — Teacher
@Entity
@Table(name = "teachers")
public class Teacher {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    private List<Course> courses = new ArrayList<>();
}
```

```java
// Phía "N" — Course (sở hữu FK)
@Entity
@Table(name = "courses")
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String courseName;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;
}
```

> 📌 **Quy tắc nhớ nhanh:**
> Phía `@ManyToOne` (phía "N") **luôn sở hữu Foreign Key** → đặt `@JoinColumn` ở đây.
> Phía `@OneToMany` (phía "1") dùng `mappedBy` để chỉ về field bên kia.

---

## 2.3 — `@ManyToMany` (N ↔ N)

**Ví dụ thực tế:** Nhiều sinh viên đăng ký nhiều môn học.

```
students table              courses table
┌────┬──────────┐           ┌────┬──────────────┐
│ id │ full_name│           │ id │ course_name  │
├────┼──────────┤           ├────┼──────────────┤
│  1 │ Nguyen A │           │  1 │ Java Web     │
│  2 │ Tran B   │           │  2 │ Database     │
└────┴──────────┘           │  3 │ Python       │
                            └────┴──────────────┘

        student_courses  ← bảng trung gian (JPA tự tạo)
        ┌────────────┬───────────┐
        │ student_id │ course_id │
        ├────────────┼───────────┤
        │     1      │     1     │  Nguyen A → Java Web
        │     1      │     2     │  Nguyen A → Database
        │     2      │     1     │  Tran B   → Java Web
        │     2      │     3     │  Tran B   → Python
        └────────────┴───────────┘
```

**Code Java:**

```java
// Phía "chủ động" — Student (đặt @JoinTable ở đây)
@Entity
@Table(name = "students")
public class Student {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fullName;

    @ManyToMany
    @JoinTable(
        name = "student_courses",
        joinColumns        = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private List<Course> courses = new ArrayList<>();
}
```

```java
// Phía "bị tham chiếu" — Course
@Entity
@Table(name = "courses")
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String courseName;

    @ManyToMany(mappedBy = "courses")
    private List<Student> students = new ArrayList<>();
}
```

**Giải thích:**
- `@JoinTable` chỉ đặt ở **1 phía** (phía chủ động — Student)
- Phía còn lại (Course) dùng `mappedBy = "courses"` tham chiếu về
- JPA sẽ **tự tạo bảng trung gian** `student_courses` với 2 cột FK

---

## 📊 Bảng so sánh tổng hợp 3 quan hệ

| Quan hệ | Annotation | FK nằm ở đâu | Bảng trung gian |
|---|---|---|---|
| 1 ↔ 1 | `@OneToOne` | Bảng phía "con" | Không |
| 1 ↔ N | `@OneToMany` + `@ManyToOne` | Bảng phía "N" | Không |
| N ↔ N | `@ManyToMany` | — | ✅ Có (bắt buộc) |

---

## ⚡ Các thuộc tính quan trọng cần nhớ

### `cascade` — "Lan truyền hành động"

```java
cascade = CascadeType.ALL     // Mọi hành động (persist, merge, remove...)
cascade = CascadeType.PERSIST // Chỉ lan truyền khi INSERT
cascade = CascadeType.REMOVE  // Chỉ lan truyền khi DELETE
```

> Ví dụ: cascade ALL trên Student → Profile: xóa Student thì Profile bị xóa theo.

### `fetch` — "Cách tải dữ liệu liên quan"

```java
fetch = FetchType.LAZY   // Tải khi nào cần mới tải (mặc định @OneToMany, @ManyToMany)
fetch = FetchType.EAGER  // Tải ngay khi load entity cha (mặc định @ManyToOne, @OneToOne)
```

### `mappedBy` — "Ai là người sở hữu FK?"

- Phía có `mappedBy` = phía **KHÔNG** tạo FK
- Phía **không** có `mappedBy` = phía **TẠO** FK (hoặc bảng trung gian)

---

## 🧠 Câu hỏi tự kiểm tra

1. Tại sao `@Entity` cần phải có **constructor không tham số**?
2. Khác nhau giữa `@Column(nullable=false)` và ràng buộc NOT NULL trong SQL?
3. Khi dùng `@OneToMany`, FK nằm ở bảng nào?
4. `mappedBy` có ý nghĩa gì và đặt ở phía nào?
5. Tại sao quan hệ `@ManyToMany` cần bảng trung gian?
6. `FetchType.LAZY` và `FetchType.EAGER` khác nhau như thế nào?
7. `cascade = CascadeType.ALL` ảnh hưởng gì đến việc xóa dữ liệu?
