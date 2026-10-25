package com.example.demojpa.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demojpa.entity.Student;
import com.example.demojpa.service.StudentService;

/**
 * ============================================================
 * 
 * @RestController = @Controller + @ResponseBody
 *                 -> Moi method tu dong tra ve JSON (khong can @ResponseBody
 *                 tung method)
 *
 *                 @RequestMapping("/api/students")
 *                 -> Tat ca cac endpoint trong class nay bat dau bang
 *                 /api/students
 *
 *                 Luong xu ly request:
 *                 Client (Postman/Browser)
 *                 -> GET /api/students
 *                 -> [StudentController.getAll()]
 *                 -> [StudentService.findAll()]
 *                 -> [StudentRepository.findAll()]
 *                 -> MySQL
 *                 -> Tra JSON ve Client
 *                 ============================================================
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    // Inject Service (KHONG inject Repository truc tiep vao Controller)
    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // ============================================================
    // GET /api/students
    // -> Lay danh sach tat ca sinh vien
    //
    // @GetMapping -> xu ly HTTP GET request
    // ============================================================
    @GetMapping
    public ResponseEntity<List<Student>> getAll() {
        List<Student> students = studentService.findAll();
        return ResponseEntity.ok(students); // 200 OK + body JSON
    }

    // ============================================================
    // GET /api/students/{id}
    // -> Lay 1 sinh vien theo ID
    //
    // @PathVariable -> lay gia tri tu URL path (vd: /students/5 -> id=5)
    // ============================================================
    @GetMapping("/{id}")
    public ResponseEntity<Student> getById(@PathVariable Long id) {
        try {
            Student student = studentService.findById(id);
            return ResponseEntity.ok(student); // 200 OK
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    // ============================================================
    // GET /api/students/search?name=an
    // -> Tim kiem sinh vien theo ten
    //
    // @RequestParam -> lay gia tri tu query string (?name=...)
    // ============================================================
    @GetMapping("/search")
    public ResponseEntity<List<Student>> searchByName(@RequestParam String name) {
        List<Student> result = studentService.searchByName(name);
        return ResponseEntity.ok(result);
    }

    // ============================================================
    // GET /api/students/gpa?min=3.5
    // -> Lay sinh vien co GPA >= min
    // ============================================================
    @GetMapping("/gpa")
    public ResponseEntity<List<Student>> getByMinGpa(@RequestParam Double min) {
        return ResponseEntity.ok(studentService.findByMinGpa(min));
    }

    // ============================================================
    // POST /api/students
    // -> Tao moi sinh vien
    //
    // @PostMapping -> xu ly HTTP POST request
    // @RequestBody -> nhan du lieu JSON tu body cua request
    // ============================================================
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Student student) {
        try {
            Student saved = studentService.save(student);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved); // 201 Created
        } catch (RuntimeException e) {
            // Tra ve 400 Bad Request neu email bi trung
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ============================================================
    // PUT /api/students/{id}
    // -> Cap nhat toan bo thong tin sinh vien
    //
    // @PutMapping -> xu ly HTTP PUT request
    // ============================================================
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Student student) {
        try {
            Student updated = studentService.update(id, student);
            return ResponseEntity.ok(updated); // 200 OK
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    // ============================================================
    // DELETE /api/students/{id}
    // -> Xoa sinh vien theo ID
    //
    // @DeleteMapping -> xu ly HTTP DELETE request
    // ============================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            studentService.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // 404 Not Found
        }
    }

    // ============================================================
    // GET /api/students/count
    // -> Dem tong so sinh vien
    // ============================================================
    @GetMapping("/count")
    public ResponseEntity<Long> count() {
        return ResponseEntity.ok(studentService.count());
    }
}
