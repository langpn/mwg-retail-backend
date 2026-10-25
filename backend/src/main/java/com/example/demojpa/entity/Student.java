package com.example.demojpa.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * ============================================================
 * 
 * @Entity -> Danh dau class nay la mot JPA Entity. Spring se map class nay voi
 *         1 bang trong CSDL.
 *
 * @Table -> Chi dinh ten bang trong CSDL (tuy chon). Neu bo @Table, JPA tu dung
 *        ten class lam ten bang.
 *        ============================================================
 */
@Entity
@Table(name = "students")
public class Student {

	/**
	 * @Id -> Danh dau field nay la PRIMARY KEY cua bang.
	 *
	 * @GeneratedValue -> Cach sinh ra gia tri cho Primary Key: - IDENTITY : Dung
	 *                 AUTO_INCREMENT cua MySQL (pho bien nhat) - SEQUENCE : Dung
	 *                 SEQUENCE (phu hop PostgreSQL, Oracle) - AUTO : JPA tu chon
	 *                 chien luoc phu hop - TABLE : Dung bang phu de quan ly ID (it
	 *                 dung)
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/**
	 * @Column -> Tuy chinh cot trong database: - name : Ten cot trong DB (mac dinh
	 *         = ten field) - nullable : Co cho phep NULL khong? (mac dinh = true) -
	 *         length : Do dai toi da (cho String, mac dinh = 255) - unique : Gia
	 *         tri phai la duy nhat khong?
	 */
	@Column(name = "full_name", nullable = false, length = 100)
	private String fullName;

	@Column(name = "email", nullable = false, unique = true, length = 150)
	private String email;

	@Column(name = "date_of_birth")
	private LocalDate dateOfBirth;

	@Column(name = "gpa")
	private Double gpa;

	@Column(name = "is_active")
	private Boolean isActive = true;

	// ============================================================
	// Constructor mac dinh (BAT BUOC phai co voi JPA)
	// JPA can constructor khong tham so de tao doi tuong khi
	// doc du lieu tu database ve.
	// ============================================================
	public Student() {
	}

	// Constructor co tham so - tien dung khi tao doi tuong moi
	public Student(String fullName, String email, LocalDate dateOfBirth, Double gpa) {
		this.fullName = fullName;
		this.email = email;
		this.dateOfBirth = dateOfBirth;
		this.gpa = gpa;
		this.isActive = true;
	}

	// ============================================================
	// Getters & Setters
	// ============================================================

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public LocalDate getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(LocalDate dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public Double getGpa() {
		return gpa;
	}

	public void setGpa(Double gpa) {
		this.gpa = gpa;
	}

	public Boolean getIsActive() {
		return isActive;
	}

	public void setIsActive(Boolean isActive) {
		this.isActive = isActive;
	}

	@Override
	public String toString() {
		return "Student{id=" + id + ", fullName='" + fullName + "', email='" + email + "', dateOfBirth=" + dateOfBirth
				+ ", gpa=" + gpa + ", isActive=" + isActive + "}";
	}
}
