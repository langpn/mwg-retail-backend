package com.example.demojpa.service;

import com.example.demojpa.entity.Student;
import com.example.demojpa.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================
 *  @Service -> Danh dau class nay la tang Service (Business Logic).
 *
 *  Tang Service nam giua Controller va Repository:
 *
 *    [Client] --> [Controller] --> [Service] --> [Repository] --> [DB]
 *
 *  Nhiem vu cua Service:
 *    - Chua logic nghiep vu (tinh toan, kiem tra, xu ly)
 *    - Goi Repository de truy cap DB
 *    - KHONG nen de logic phuc tap trong Controller
 * ============================================================
 */
@Service
public class StudentService {

    /**
     * Dependency Injection qua Constructor (khuyen dung).
     * Spring se tu dong inject StudentRepository vao day.
     *
     * Cach khac (it khuyen dung hon):
     *   @Autowired
     *   private StudentRepository studentRepository;
     */
    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // ============================================================
    //  CREATE
    // ============================================================

    /**
     * Luu mot sinh vien moi.
     * Kiem tra email da ton tai chua truoc khi luu.
     */
    public Student save(Student student) {
        // Logic nghiep vu: kiem tra email trung lap
        if (studentRepository.findByEmail(student.getEmail()).isPresent()) {
            throw new RuntimeException("Email da ton tai: " + student.getEmail());
        }
        return studentRepository.save(student);
    }

    // ============================================================
    //  READ
    // ============================================================

    /** Lay tat ca sinh vien */
    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    /** Tim sinh vien theo ID, nem loi neu khong tim thay */
    public Student findById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay sinh vien voi id: " + id));
    }

    /** Tim sinh vien co GPA cao hon nguong cho truoc */
    public List<Student> findByMinGpa(Double minGpa) {
        return studentRepository.findByGpaGreaterThanEqual(minGpa);
    }

    /** Tim sinh vien theo tu khoa trong ho ten */
    public List<Student> searchByName(String keyword) {
        return studentRepository.findByFullNameContainingIgnoreCase(keyword);
    }

    // ============================================================
    //  UPDATE
    // ============================================================

    /**
     * Cap nhat thong tin sinh vien theo ID.
     * Tim sinh vien -> cap nhat field -> luu lai.
     */
    public Student update(Long id, Student studentMoi) {
        // Kiem tra sinh vien co ton tai khong
        Student svHienTai = findById(id); // Nem loi neu khong tim thay

        // Chi cap nhat cac field duoc phep sua
        svHienTai.setFullName(studentMoi.getFullName());
        svHienTai.setDateOfBirth(studentMoi.getDateOfBirth());
        svHienTai.setGpa(studentMoi.getGpa());
        svHienTai.setIsActive(studentMoi.getIsActive());
        // Luu y: khong cap nhat email (thuong email la dinh danh)

        return studentRepository.save(svHienTai); // save() voi ID -> UPDATE
    }

    // ============================================================
    //  DELETE
    // ============================================================

    /** Xoa sinh vien theo ID */
    public void deleteById(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Khong tim thay sinh vien voi id: " + id);
        }
        studentRepository.deleteById(id);
    }

    /** Dem tong so sinh vien */
    public long count() {
        return studentRepository.count();
    }
}
