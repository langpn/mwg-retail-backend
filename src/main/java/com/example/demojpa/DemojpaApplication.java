package com.example.demojpa;

import com.example.demojpa.entity.Student;
import com.example.demojpa.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@SpringBootApplication
public class DemojpaApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemojpaApplication.class, args);
	}

	/**
	 * CommandLineRunner chay ngay sau khi Spring Boot khoi dong xong. Day la noi
	 * chung ta thu nghiem cac thao tac JPA.
	 *
	 * @param studentRepository -> Spring tu dong inject (Dependency Injection)
	 */
	@Bean
	public CommandLineRunner demo(StudentRepository studentRepository) {
		return args -> {
			System.out.println("\n========== BAT DAU DEMO JPA ==========\n");

			// ------------------------------------------------
			// 1. THEM MOI sinh vien (CREATE)
			// save() -> INSERT INTO students ...
			// ------------------------------------------------
			System.out.println("--- 1. THEM MOI SINH VIEN ---");
			Student sv1 = new Student("Nguyen Van An", "an@email.com", LocalDate.of(2003, 5, 15), 3.8);
			Student sv2 = new Student("Tran Thi Binh", "binh@email.com", LocalDate.of(2002, 8, 20), 3.2);
			Student sv3 = new Student("Le Van Cuong", "cuong@email.com", LocalDate.of(2003, 12, 1), 2.9);

			studentRepository.save(sv1); // INSERT vao DB
			studentRepository.save(sv2);
			studentRepository.save(sv3);
			System.out.println("Da them 3 sinh vien!");

			// ------------------------------------------------
			// 2. DOC DU LIEU (READ)
			// findAll() -> SELECT * FROM students
			// ------------------------------------------------
			System.out.println("\n--- 2. LAY TAT CA SINH VIEN ---");
			List<Student> tatCaSinhVien = studentRepository.findAll();
			tatCaSinhVien.forEach(System.out::println);

			// ------------------------------------------------
			// 3. TIM THEO ID
			// findById() -> SELECT * FROM students WHERE id = ?
			// Tra ve Optional<Student> (co the rong)
			// ------------------------------------------------
			System.out.println("\n--- 3. TIM THEO ID ---");
			Optional<Student> timTheoId = studentRepository.findById(1L);
			if (timTheoId.isPresent()) {
				System.out.println("Tim thay: " + timTheoId.get());
			} else {
				System.out.println("Khong tim thay sinh vien voi ID = 1");
			}

			// ------------------------------------------------
			// 4. CAP NHAT (UPDATE)
			// save() voi doi tuong co ID -> UPDATE students SET ...
			// ------------------------------------------------
			System.out.println("\n--- 4. CAP NHAT GPA CUA SINH VIEN ---");
			if (timTheoId.isPresent()) {
				Student sv = timTheoId.get();
				sv.setGpa(3.9); // Thay doi GPA
				studentRepository.save(sv); // save() voi ID -> UPDATE
				System.out.println("Da cap nhat GPA: " + sv);
			}

			// ------------------------------------------------
			// 5. TIM THEO DIEU KIEN (Derived Query)
			// ------------------------------------------------
			System.out.println("\n--- 5. TIM SINH VIEN CO GPA >= 3.0 ---");
			List<Student> gpaCao = studentRepository.findByGpaGreaterThanEqual(3.0);
			gpaCao.forEach(System.out::println);

			System.out.println("\n--- 6. TIM THEO EMAIL ---");
			Optional<Student> timTheoEmail = studentRepository.findByEmail("binh@email.com");
			timTheoEmail.ifPresent(s -> System.out.println("Tim thay: " + s));

			// ------------------------------------------------
			// 6. DEM SO LUONG
			// ------------------------------------------------
			System.out.println("\n--- 7. DEM TONG SO SINH VIEN ---");
			long tongSo = studentRepository.count();
			System.out.println("Tong so sinh vien: " + tongSo);

			// ------------------------------------------------
			// 7. XOA (DELETE)
			// deleteById() -> DELETE FROM students WHERE id = ?
			// ------------------------------------------------
			System.out.println("\n--- 8. XOA SINH VIEN ID = 3 ---");
			studentRepository.deleteById(3L);
			System.out.println("Con lai " + studentRepository.count() + " sinh vien.");

			System.out.println("\n========== KET THUC DEMO JPA ==========\n");
		};
	}
}
