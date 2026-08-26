# Add Installment Tab and Pre-selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "Ước tính trả góp" tab to the vehicle details tab bar (`VehicleTabBar`) and connect it to the installment estimation tool page, supporting pre-selection of vehicles and versions via query parameters.

**Architecture:** 
1. Update `VehicleTabBar` inside `fe/src/components/vehicle/VehicleLayoutClient.tsx` to include the "Ước tính trả góp" tab linked to `/cong-cu/uoc-tinh-tra-gop?vehicle=${id}`.
2. Restructure `fe/src/app/cong-cu/uoc-tinh-tra-gop/page.tsx` by splitting the calculator logic into a component named `InstallmentCalculatorContent` that parses query parameters via `useSearchParams` from `next/navigation`.
3. Wrap `InstallmentCalculatorContent` in a `Suspense` boundary within the main default exported `InstallmentCalculatorPage`.

**Tech Stack:** Next.js (App Router), React, Lucide Icons, Tailwind CSS.

## Global Constraints
- Do not introduce build errors.
- Always use `Suspense` when calling `useSearchParams` to prevent Next.js build-time errors.
- Follow existing formatting and styles.

---

### Task 1: Update Vehicle Tab Bar
**Files:**
- Modify: [VehicleLayoutClient.tsx](file:///d:/git/bed-dongnaiford/fe/src/components/vehicle/VehicleLayoutClient.tsx)

- [ ] **Step 1: Locate `subTabs` declaration**
  Find the `subTabs` useMemo block starting around line 738.

- [ ] **Step 2: Add the "Ước tính trả góp" tab**
  Modify `subTabs` to add the new tab:
  ```tsx
  const subTabs = useMemo(() => [
    { label: "Tổng quan", path: `/${id}` },
    { label: "Phiên bản", path: `/${id}/${firstVersionSlug}` },
    { label: "Tính năng", path: `/${id}/tinh-nang` },
    { label: "So sánh", path: `/[id]/so-sanh`, actualPath: `/${id}/so-sanh` },
    { label: "Phụ kiện", path: `/[id]/phu-kien`, actualPath: `/${id}/phu-kien` },
    { label: "Dự toán chi phí lăn bánh", path: `/[id]/du-toan-lan-banh`, actualPath: `/${id}/du-toan-lan-banh` },
    { label: "Ước tính trả góp", path: `/cong-cu/uoc-tinh-tra-gop`, actualPath: `/cong-cu/uoc-tinh-tra-gop?vehicle=${id}` }
  ], [id, firstVersionSlug]);
  ```

- [ ] **Step 3: Commit changes**
  ```bash
  git add fe/src/components/vehicle/VehicleLayoutClient.tsx
  git commit -m "feat: add installment estimation tab to vehicle layout tab bar"
  ```

---

### Task 2: Refactor Installment Estimation Tool Page
**Files:**
- Modify: [page.tsx](file:///d:/git/bed-dongnaiford/fe/src/app/cong-cu/uoc-tinh-tra-gop/page.tsx)

- [ ] **Step 1: Add imports**
  Import `Suspense` from `"react"` (if not already imported) and `useSearchParams` from `"next/navigation"`.
  ```tsx
  import { useState, useEffect, useRef, Suspense } from "react";
  import { useSearchParams } from "next/navigation";
  ```

- [ ] **Step 2: Extract layout logic into `InstallmentCalculatorContent`**
  Rename the current `export default function InstallmentCalculatorPage` to `function InstallmentCalculatorContent`.
  Inside `InstallmentCalculatorContent`, add `useSearchParams` hooks:
  ```tsx
  const searchParams = useSearchParams();
  const urlVehicleId = searchParams.get("vehicle");
  const urlVersionId = searchParams.get("version");
  ```

- [ ] **Step 3: Handle URL params during initial load**
  Update the `useEffect` where vehicle list is loaded to handle `urlVehicleId` and `urlVersionId`:
  ```tsx
          // Pre-select vehicle matching urlVehicleId or fallback to first vehicle
          const matchedCar = urlVehicleId
            ? mappedVehicles.find((v) => v.id === urlVehicleId)
            : null;
          const defaultCar = matchedCar || mappedVehicles[0];
          setSelectedVehicle(defaultCar);
          
          const matchedVersion = urlVersionId
            ? defaultCar.versions.find((v) => String(v.id) === String(urlVersionId))
            : null;
          const defaultVersion = matchedVersion || defaultCar.versions[0];
          setSelectedVersion(defaultVersion);
          setListPrice(defaultVersion.price);
          setPrepaidAmount(Math.round(defaultVersion.price * (prepaidPercentage / 100)));
  ```

- [ ] **Step 4: Define `InstallmentCalculatorPage` with Suspense**
  Add the new default export at the bottom of the file wrapping the content:
  ```tsx
  export default function InstallmentCalculatorPage() {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0562d2]" />
          </div>
        }
      >
        <InstallmentCalculatorContent />
      </Suspense>
    );
  }
  ```

- [ ] **Step 5: Commit changes**
  ```bash
  git add fe/src/app/cong-cu/uoc-tinh-tra-gop/page.tsx
  git commit -m "feat: support query parameters in installment calculator page"
  ```

---

### Task 3: Build & Verification
**Files:**
- None

- [ ] **Step 1: Test production build**
  Run the frontend project build command to ensure `Suspense` and `useSearchParams` do not cause issues.
  Run: `npm run build` or `npm run dev` and navigate manually.

- [ ] **Step 2: Commit any final validation logs/notes**
  ```bash
  git commit --allow-empty -m "chore: verify build success"
  ```
