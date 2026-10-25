package com.example.demojpa.repository;

import com.example.demojpa.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================
 *  @Repository -> Danh dau interface nay la lop truy cap du lieu.
 *                 (Optional - JpaRepository da bao gom chuc nang nay)
 *
 *  JpaRepository<Student, Long>:
 *    - Student : Kieu Entity se thao tac
 *    - Long    : Kieu du lieu cua Primary Key (id)
 *
 *  Khi extends JpaRepository, Spring TU DONG tao implementation
 *  voi day du cac method CRUD (ban khong can viet code):
 *    - save(entity)           -> Luu hoac cap nhat
 *    - findById(id)           -> Tim theo ID
 *    - findAll()              -> Lay tat ca
 *    - deleteById(id)         -> Xoa theo ID
 *    - count()                -> Dem so ban ghi
 *    - existsById(id)         -> Kiem tra ton tai
 *    ... va nhieu method khac
 * ============================================================
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // ============================================================
    //  DERIVED QUERY - Spring tu viet SQL dua vao ten method!
    //  Quy tac dat ten: findBy + TenField + DieuKien
    // ============================================================

    // Tim sinh vien theo email (tra ve Optional phong tranh NullPointerException)
    Optional<Student> findByEmail(String email);

    // Tim tat ca sinh vien theo trang thai hoat dong
    List<Student> findByIsActive(Boolean isActive);

    // Tim sinh vien co GPA lon hon hoac bang gia tri cho truoc
    // SQL tuong duong: SELECT * FROM students WHERE gpa >= ?
    List<Student> findByGpaGreaterThanEqual(Double gpa);

    // Tim tat ca sinh vien va sap xep theo ho ten (tang dan)
    List<Student> findAllByOrderByFullNameAsc();

    // Tim sinh vien theo ho ten (khong phan biet hoa thuong)
    // SQL tuong duong: SELECT * FROM students WHERE LOWER(full_name) LIKE LOWER(?)
    List<Student> findByFullNameContainingIgnoreCase(String keyword);

    // ============================================================
    //  CUSTOM QUERY voi @Query (viet JPQL - tuong tu SQL nhung
    //  dung ten Class va Field thay vi ten bang va cot)
    // ============================================================

    // JPQL: dung "Student" (ten class), "s.fullName" (ten field)
    @Query("SELECT s FROM Student s WHERE s.gpa >= :minGpa AND s.isActive = true")
    List<Student> findActiveStudentsWithMinGpa(@Param("minGpa") Double minGpa);

    // Viet SQL thuan (nativeQuery = true):
    // Dung khi JPQL khong du manh hoac can dung tinh nang rieng cua DB
    @Query(value = "SELECT * FROM students WHERE YEAR(date_of_birth) = :year", nativeQuery = true)
    List<Student> findStudentsBornInYear(@Param("year") int year);

    // Dem so sinh vien dang hoat dong
    long countByIsActive(Boolean isActive);
}
