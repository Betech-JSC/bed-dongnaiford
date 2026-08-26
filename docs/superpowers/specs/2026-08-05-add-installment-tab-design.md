# Design Document: Add Installment Estimation Tab and Query Parameter Support

## Goal
Add an "Ước tính trả góp" (Installment Estimation) tab to the vehicle details tab bar (`VehicleTabBar`) and connect it to the installment estimation tool page. Ensure the tool page can pre-select the active vehicle (and version, if specified) based on query parameters.

## Proposed Changes

### 1. Vehicle Detail Tab Bar (`fe/src/components/vehicle/VehicleLayoutClient.tsx`)
- Modify `subTabs` inside `VehicleTabBar` to include a new link for "Ước tính trả góp".
- Path format: `/cong-cu/uoc-tinh-tra-gop?vehicle=${id}` where `${id}` is the current vehicle slug.

### 2. Installment Estimation Tool Page (`fe/src/app/cong-cu/uoc-tinh-tra-gop/page.tsx`)
- Restructure the page by separating the calculator implementation into a client component `InstallmentCalculatorContent`.
- Wrap the new `InstallmentCalculatorContent` in a `Suspense` boundary within the main default exported `InstallmentCalculatorPage`. This prevents build/runtime issues in Next.js when using `useSearchParams()`.
- Inside `InstallmentCalculatorContent`, import and use `useSearchParams` to retrieve `vehicle` and `version` from the URL.
- During initial load inside the `useEffect`, check if the query parameters match any vehicle/version in the loaded vehicle list. If a match is found, pre-select it automatically; otherwise, fall back to the first available vehicle/version.

---

## Verification Plan

### Automated Checks
- Run building validation (`npm run build` or local equivalent) to make sure there are no hydration mismatch or static page generation issues with `useSearchParams`.

### Manual Checks
1. Go to a vehicle details page (e.g. `/ford-territory`) and verify the tab bar displays "Ước tính trả góp" after "Dự toán chi phí lăn bánh".
2. Click the "Ước tính trả góp" tab and ensure it redirects to `/cong-cu/uoc-tinh-tra-gop?vehicle=ford-territory`.
3. Verify that on page load, Ford Territory is automatically selected as the default vehicle, and the price/prepayment calculations are initialized correctly based on it.
