# MWG Retail System - Giao Diện "Triệu Đô" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the MWG Retail System into an ultra-premium, "million-dollar" modern retail dashboard combining v0.dev component aesthetics, interactive 3D WebGL via Spline, and 60-120fps motion graphics via Motion (Framer Motion) & Aceternity UI patterns, while maintaining zero-friction single-port execution on Spring Boot port 8088.

**Architecture:**
- **UI Engine:** React 18 + TypeScript + Vite.
- **Styling & Design System:** Tailwind CSS tokens + Custom Glassmorphism / Neon Accent (#0284C7 Blue & #F59E0B Gold).
- **3D Interactive Layer:** `@splinetool/react-spline` (Live 3D interactive hero canvas with mouse tracking).
- **Motion Engine:** `motion/react` (Smooth layout transitions, 3D tilt card physics, floating particles, and spring tabs).
- **Deployment:** Statically bundled into `backend/src/main/resources/static/` served on `http://localhost:8088`.

**Spec:** `school/cong-cu-web-va-website-huong-du-lieu/documents/FINAL_PROJECT_SPECIFICATION.md`

## Global Constraints
- Must maintain single-port execution on `http://localhost:8088` (no external runtime required for group members Diễm & Toàn).
- Performance budget: Maintain 60fps on modern laptops, bundle size under 1MB gzip.
- Brand fidelity: Authentic Điện Máy Xanh visual identity (Vibrant Blue, Warm Gold, Crimson Red Price, Emerald In-Stock Badges).
- Zero AI attribution on Git commits (Author: `LangPN <178277445+langpn@users.noreply.github.com>`).

## Review Focus
1. 3D canvas loading latency (fallback skeleton while Spline scene loads).
2. Mobile/Tablet responsive layout collapse on dense grids.
3. Memory leaks in mouse-tracking event listeners for 3D tilt cards.
4. Smooth tab-switching layout animation without flickering.
5. Verification that Spring Boot cleanly serves all assets with correct MIME types.

---

### Task 1: Install Motion & 3D Interactive Dependencies

**Files:**
- Modify: `frontend/package.json`
- Test: `frontend/node_modules/` verification

**Interfaces:**
- Produces: `motion` (latest Motion for React) and `@splinetool/react-spline` ready for import.

- [ ] **Step 1: Install `motion` and `@splinetool/react-spline` inside `frontend/`**
  ```bash
  cd frontend && npm install motion @splinetool/react-spline clsx tailwind-merge
  ```
- [ ] **Step 2: Verify zero package dependency conflicts in `package.json`**
- [ ] **Step 3: Run `npm run build` to verify clean bundle compilation**
- [ ] **Step 4: Commit changes to `main`**

---

### Task 2: Build the 3D Interactive Hero Canvas (`Hero3DCanvas.tsx`)

**Files:**
- Create: `frontend/src/components/Hero3DCanvas.tsx`
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- Produces: Interactive 3D hero scene with mouse tilt and lighting reflection, featuring a high-tech floating consumer electronics model.

- [ ] **Step 1: Create `Hero3DCanvas.tsx` with Spline scene integration and fallback shimmer**
- [ ] **Step 2: Add glassmorphism overlay container with MWG branding and live stats**
- [ ] **Step 3: Wire into top section of `App.tsx`**
- [ ] **Step 4: Verify smooth 60fps canvas render in local browser**
- [ ] **Step 5: Commit changes to `main`**

---

### Task 3: Build Aceternity-Style 3D Tilt Product Card (`Card3DTilt.tsx`)

**Files:**
- Create: `frontend/src/components/Card3DTilt.tsx`
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- Consumes: Product Item data
- Produces: Interactive card that tilts in 3D perspective based on pointer coordinates (`rotateX`, `rotateY`), with depth elevation on price and badge layers.

- [ ] **Step 1: Implement mathematical pointer-tracking hook using `useMotionValue` and `useSpring`**
- [ ] **Step 2: Build card component with 3D transform style `preserve-3d` and layered Z-depth**
- [ ] **Step 3: Replace standard product cards in Tab 1 with `Card3DTilt`**
- [ ] **Step 4: Test hover physics and responsive grid alignment**
- [ ] **Step 5: Commit changes to `main`**

---

### Task 4: Implement Smooth Tab Transitions & Spotlight Filter Bar

**Files:**
- Create: `frontend/src/components/SpotlightFilter.tsx`
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- Produces: Raycast-style spotlight glow following cursor in search input, animated tab indicator (`layoutId="activeTabIndicator"`), and page transition wrappers (`AnimatePresence`).

- [ ] **Step 1: Implement `SpotlightFilter.tsx` with radial gradient mouse tracking**
- [ ] **Step 2: Add spring-animated pill indicator under active navigation tabs**
- [ ] **Step 3: Wrap tab panels in `AnimatePresence` with subtle fade & slide spring transitions**
- [ ] **Step 4: Verify zero layout shift (CLS = 0) during tab switching**
- [ ] **Step 5: Commit changes to `main`**

---

### Task 5: Static Bundle Build & Spring Boot Verification

**Files:**
- Output: `backend/src/main/resources/static/`
- Test: Local verification on `http://localhost:8088`

**Interfaces:**
- Produces: Single-port standalone artifact serving both REST APIs and the VIP 3D React UI.

- [ ] **Step 1: Run production build inside `frontend/` (`npm run build`)**
- [ ] **Step 2: Verify new JS/CSS bundles deployed to `backend/src/main/resources/static/`**
- [ ] **Step 3: Test full end-to-end purchasing and stock update flows on `http://localhost:8088`**
- [ ] **Step 4: Commit and push changes to GitHub `main`**
