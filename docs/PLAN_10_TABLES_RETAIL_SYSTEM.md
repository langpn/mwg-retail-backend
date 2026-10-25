# MWG Retail Multi-Branch System (10 Tables) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade, 10-table enterprise retail backend with Spring Boot 3 + MySQL, integrated with a lightweight Vite React frontend, structured as a clean Monorepo, designed to ace the IUH final exam on Nov 1st and serve as Showcase #3 for MWG AI Engineer portfolio.

**Architecture:** 
- **Backend Core:** Java 17 LTS, Spring Boot 3.3.x, Spring Data JPA / Hibernate 6, MySQL 8.
- **Frontend SPA:** Vite + React 18 + Tailwind CSS, statically bundled into Spring Boot's `static/` resources for zero-friction single-port execution.
- **Branching Strategy:** `main` branch holds the clean, stable academic version for group defense on Nov 1st; `feat/ai-engineer-integration` branch holds OpenAPI specs, Tool Calling endpoints, and Agentic integration.

**Spec:** `school/cong-cu-web-va-website-huong-du-lieu/documents/FINAL_PROJECT_SPECIFICATION.md`

## Global Constraints
- Database schema size: Exactly 10 relational tables (touching the instructor's ceiling of 6-10 tables).
- Team responsibility model: Strictly **Vertical Slicing** (Lang: Products & Brands, Diễm: Branches & Stock, Toàn: Orders & Customers).
- Zero AI attribution on all Git commits (Author: `LangPN <178277445+langpn@users.noreply.github.com>`).
- Single-port runtime requirement: Localhost port `8080` serves both REST APIs and the React SPA without requiring Node.js for group members.

## Review Focus
1. Infinite JSON recursion in bidirectional JPA relationships (`@JsonIgnore` on all `@OneToMany` collections).
2. Missing sample data during defense (`DataSeeder.java` auto-populates 10 tables on application startup).
3. Foreign key cascading deletion bugs (no reckless `CascadeType.REMOVE` across business boundaries).
4. Client-side route refreshing 404 errors (SPA static forwarder configuration).
5. Clean separation between academic scope (`main`) and AI Agent extensions (`feat/ai-engineer-integration`).

---

### Task 1: Reorganize Monorepo Structure & Rename GitHub Repository

**Files:**
- Create: `backend/` directory (move existing Spring Boot project into it)
- Create: `frontend/` directory (initialize Vite + React + Tailwind)
- Modify: `README.md` and `HUONG_DAN_DO_AN_CHO_NHOM.md`

**Interfaces:**
- Consumes: Existing Spring Boot files in `demojpa/`
- Produces: Clean Monorepo layout with independent `backend` and `frontend` boundaries.

- [ ] **Step 1: Move Spring Boot source files into `backend/` directory**
- [ ] **Step 2: Initialize Vite React boilerplate inside `frontend/`**
- [ ] **Step 3: Rename GitHub repository to `mwg-retail-system` via `gh repo rename`**
- [ ] **Step 4: Verify `./mvnw compile` passes cleanly inside `backend/`**
- [ ] **Step 5: Commit and push changes to `main`**

---

### Task 2: Expand JPA Entity Domain Model to 10 Tables

**Files:**
- Existing Entities (6): `Category.java`, `Product.java`, `StoreBranch.java`, `Inventory.java`, `CustomerOrder.java`, `OrderItem.java`
- New Entities (4):
  - Create: `backend/src/main/java/com/example/demojpa/entity/Brand.java`
  - Create: `backend/src/main/java/com/example/demojpa/entity/Promotion.java`
  - Create: `backend/src/main/java/com/example/demojpa/entity/Customer.java`
  - Create: `backend/src/main/java/com/example/demojpa/entity/ProductReview.java`
- Modify: `Product.java` (add `brand` FK), `CustomerOrder.java` (add `customer` and `promotion` FK)

**Interfaces:**
- Produces: 10 JPA Entities with proper `@ManyToOne`, `@OneToMany`, `@JoinColumn`, and `@JsonIgnore` annotations.

- [ ] **Step 1: Write `Brand.java` (Entity for Toshiba, Samsung, LG, Panasonic)**
- [ ] **Step 2: Write `Promotion.java` (Entity for promo codes, discount percentages)**
- [ ] **Step 3: Write `Customer.java` (Entity for registered retail customers)**
- [ ] **Step 4: Write `ProductReview.java` (Entity for 1-5 star ratings and comments)**
- [ ] **Step 5: Update `Product.java` and `CustomerOrder.java` with new foreign key mappings**
- [ ] **Step 6: Run `./mvnw compile` to verify zero compilation errors across all 10 entities**
- [ ] **Step 7: Commit changes to `main`**

---

### Task 3: Implement 10 JPA Repositories & Automated Data Seeder

**Files:**
- Create: 10 Interfaces under `backend/src/main/java/com/example/demojpa/repository/`
  - `CategoryRepository.java`, `BrandRepository.java`, `ProductRepository.java`
  - `StoreBranchRepository.java`, `InventoryRepository.java`
  - `CustomerRepository.java`, `PromotionRepository.java`, `CustomerOrderRepository.java`, `OrderItemRepository.java`, `ProductReviewRepository.java`
- Create: `backend/src/main/java/com/example/demojpa/seeder/DataSeeder.java` (implements `CommandLineRunner`)

**Interfaces:**
- Consumes: 10 JPA Entities
- Produces: Type-safe CRUD operations, derived query methods (`findByCategory_Code`, `findByStoreBranch_District`, `findBySku`), and pre-populated sample database.

- [ ] **Step 1: Create 10 Repository interfaces extending `JpaRepository<T, Long>`**
- [ ] **Step 2: Add essential query methods for product filtering and branch inventory checking**
- [ ] **Step 3: Implement `DataSeeder.java` with 15 electronic products, 4 brands, 2 branches, and realistic stock quantities**
- [ ] **Step 4: Run `./mvnw test` to verify database seeding and repository query execution**
- [ ] **Step 5: Commit changes to `main`**

---

### Task 4: Implement Service Layer & RESTful Web Services

**Files:**
- Create: `backend/src/main/java/com/example/demojpa/service/`
  - `ProductCatalogService.java` (Product, Brand, Category operations)
  - `InventoryManagementService.java` (Branch, Stock tracking, Reservation logic)
  - `OrderProcessingService.java` (Customer checkout, Order creation, Stock deduction)
- Create: `backend/src/main/java/com/example/demojpa/controller/`
  - `ProductApiController.java` (`GET /api/v1/products`, `GET /api/v1/categories`, `GET /api/v1/brands`)
  - `InventoryApiController.java` (`GET /api/v1/inventory/check`, `PUT /api/v1/inventory/update`)
  - `OrderApiController.java` (`POST /api/v1/orders`, `GET /api/v1/orders/{id}`)

**Interfaces:**
- Produces: Full HTTP Verbs compliance (`GET`, `POST`, `PUT`, `DELETE`), clean JSON payloads without circular references.

- [ ] **Step 1: Implement `ProductCatalogService` and `ProductApiController`**
- [ ] **Step 2: Implement `InventoryManagementService` and `InventoryApiController`**
- [ ] **Step 3: Implement `OrderProcessingService` and `OrderApiController`**
- [ ] **Step 4: Test API endpoints using curl / HTTP client**
- [ ] **Step 5: Commit changes to `main`**

---

### Task 5: Build Modern React Frontend & Static Single-Port Bundle

**Files:**
- Inside `frontend/`:
  - `src/App.tsx`: Main dashboard shell (Navigation, Tabs for Catalog, Inventory, and Orders)
  - `src/components/ProductCatalog.tsx`: Grid view with Category/Brand filters and price ceilings
  - `src/components/InventoryTracker.tsx`: Real-time stock lookup table per branch
  - `src/components/OrderCheckout.tsx`: Simple customer order form
- Create: `backend/src/main/java/com/example/demojpa/config/SpaWebConfig.java` (forwards client routes to `index.html`)

**Interfaces:**
- Consumes: RESTful APIs on `/api/v1/*`
- Produces: Production build bundle in `backend/src/main/resources/static/`

- [ ] **Step 1: Build React components with Tailwind CSS for clean, responsive UI**
- [ ] **Step 2: Connect frontend fetch calls to Spring Boot REST endpoints**
- [ ] **Step 3: Run `npm run build` inside `frontend/` and copy `dist/*` to `backend/src/main/resources/static/`**
- [ ] **Step 4: Start Spring Boot server (`./mvnw spring-boot:run`) and verify `http://localhost:8080` loads React SPA**
- [ ] **Step 5: Commit changes to `main`**

---

### Task 6: Draft 17-Page Academic Report (`CUON_BAO_CAO_17_TRANG.md`)

**Files:**
- Create: `docs/CUON_BAO_CAO_MON_HOC.md` (and generate printable Word/PDF format)
- Contents:
  - Page 1: Official IUH cover page with 3 student details (Lang, Diễm, Toàn)
  - Page 2: Table of contents & Vertical Slicing contribution matrix
  - Pages 3-4: Problem statement & MWG Retail business context
  - Pages 5-6: Use Case diagrams and customer purchasing scenarios
  - Pages 7-8: 3-Tier MVC Architecture & RESTful Web Service specifications
  - Pages 9-11: Complete 10-table ERD Diagram & schema specifications
  - Pages 12-14: API catalog (HTTP Verbs, request/response JSON contracts)
  - Pages 15-16: Live system screenshots running on localhost:8080
  - Page 17: Conclusion, lessons learned, and self-evaluation

- [ ] **Step 1: Write markdown report following the 17-page constraint**
- [ ] **Step 2: Generate ASCII/Mermaid ERD diagram for 10 tables**
- [ ] **Step 3: Document API specifications and request/response samples**
- [ ] **Step 4: Commit report documentation to `main`**

---

### Task 7: Create Branch `feat/ai-engineer-integration` for MWG Portfolio (Post-Exam)

**Files:**
- Branch: `feat/ai-engineer-integration`
- Modify: `backend/pom.xml` (add `springdoc-openapi-starter-webmvc-ui`)
- Create: `backend/src/main/java/com/example/demojpa/controller/AgentToolController.java`
- Modify: `repos/mwg-retail-orchestrator/src/tools.py` (wire Python agent to Spring Boot REST API)
- Create: `docker-compose.yml` (orchestrates MySQL + Spring Boot + Python Agent)

**Interfaces:**
- Consumes: 10-table Spring Boot backend
- Produces: OpenAPI 3.0 schema, Model Context Protocol (MCP) compatible endpoints, and unified enterprise AI portfolio.

- [ ] **Step 1: Create and checkout branch `feat/ai-engineer-integration`**
- [ ] **Step 2: Add Swagger / OpenAPI 3.0 dependency and verify `/swagger-ui.html` and `/v3/api-docs`**
- [ ] **Step 3: Implement dedicated Tool Calling endpoints with Pydantic-compatible schemas**
- [ ] **Step 4: Update `MWG-Retail-Orchestrator` to call live Spring Boot endpoints instead of mock data**
- [ ] **Step 5: Verify end-to-end integration with automated pytest suite**
