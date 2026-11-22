# Access Assist — Loan Application & EMI Management Portal

A production-grade, responsive fintech web application built for the **Access Assist Technical Assessment** (React.js Frontend Developer role).

This platform enables borrowers to interactively calculate loan EMIs, simulate amortization schedules, verify real-time debt-to-income (FOIR) eligibility, submit a multi-step digital loan application with resilient draft autosave, and track application lifecycles via an admin tracker dashboard.

---

## 🚀 Live Demo & Repository
- **Live Preview Link**: [https://polite-chaja-512547.netlify.app](https://access-assist-loan-portal.vercel.app) *(or Vercel / Netlify deployment)*
- **GitHub Repository**: [https://github.com/sanjana-maurya/access-assist-loan-portal](https://github.com/sanjana-maurya/access-assist-loan-portal)

---

## 🛠️ Tech Stack & Architecture Choices

| Technology | Purpose & Justification |
| :--- | :--- |
| **React 18+ (Vite)** | Blazing fast HMR, optimized production build, and strict mode compliance. |
| **TypeScript (Strict Mode)** | Complete type safety, zero `any` usage, end-to-end interface contracts. |
| **Tailwind CSS** | Modern fintech design system with custom palette, micro-interactions, responsive utility tokens. |
| **React Router v6** | Declarative client-side routing, route state, and bidirectional URL search parameter synchronization. |
| **React Hook Form + Zod** | Uncontrolled form performance, zero-re-render typing, declarative schema validation. |
| **React Context + useReducer** | Predictable state container for submitted applications and status history without external heavyweight dependencies. |
| **SVG Data Visualization** | High-performance, zero-dependency Donut Chart with dynamic circumference calculations and hover tooltips. |
| **Vitest + Testing Library** | Unit testing for financial formulas, age calculation, regexes, and validation constraints. |

---

## ✨ Features Implemented

### 1. Interactive Loan & EMI Calculator (`/`)
- **Real-Time Synchronized Dual Inputs**:
  - **Loan Amount**: ₹50,000 – ₹25,00,000 (step ₹10,000) with quick preset chips (₹2L, ₹5L, ₹10L, ₹15L, ₹25L).
  - **Interest Rate**: 8% – 24% p.a. (step 0.1%) with prime and standard tier chips.
  - **Tenure**: 6 – 60 months (step 1 month) with 12m, 24m, 36m, 60m chips.
- **Bi-directional Typing & Clamping**:
  - Allows intermediate values while typing; clamps to valid min/max on blur.
  - Real-time inline range error notifications.
  - Slider track fill gradient dynamically tracks the thumb handle.
- **Live Calculated Outputs**:
  - Monthly EMI, Total Interest Payable, and Total Amount Payable formatted with `Intl.NumberFormat('en-IN')`.
- **Pure Function Mathematical Model (`utils/emi.ts`)**:
  $$\text{EMI} = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}$$
  *Where $P$ = Principal, $r$ = Monthly Interest Rate $(\text{Annual Rate} / 12 / 100)$, and $n$ = Tenure in months.*
  *Handles edge case $r = 0 \implies \text{EMI} = P / n$.*
- **Month-by-Month Amortization Schedule**:
  - Collapsible accordion with sticky header and vertical scroll.
  - Columns: Month, Opening Balance, EMI, Principal Paid, Interest Paid, Remaining Balance.
  - Guaranteed exact balance of ₹0 at final installment (with rounding adjustment).
- **Principal vs Interest Donut Chart (Bonus)**:
  - Interactive SVG Donut chart displaying percentages and color-coded payment breakdown.
- **"Apply for this loan"**: Prefills loan parameters seamlessly into the application route (`/apply?amount=...&rate=...&tenure=...`).

---

### 2. Multi-Step Loan Application with Draft Autosave (`/apply`)
- **Stepper UI**: Step 1/2/3 progress indicator with checkmarks for completed steps, active highlighting, and navigation step guards (cannot jump ahead past incomplete steps).
- **Loan Prefill Bar**: Summarizes chosen loan parameters at the top of Step 1 with a quick adjustment trigger.
- **Step 1 — Applicant KYC**:
  - **Full Name**: 3–60 chars, regex `^[A-Za-z][A-Za-z .'-]{2,59}$`.
  - **Phone**: 10-digit Indian mobile `^[6-9]\d{9}$`, auto-strips non-digits, "+91" prefix.
  - **Email**: Strict email format, trimmed and lowercased.
  - **PAN**: `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`, auto-uppercased while typing.
  - **Date of Birth**: Exact age calculation (month & day precision). Applicant must be at least 21 years old and $\le 70$ years old. Native input `max` constrained to `today - 21 years`.
  - First invalid field auto-focus on failed submission.
- **Step 2 — Employment & Live FOIR Eligibility**:
  - **Employment Type**: Segmented radio cards (Salaried vs. Self-Employed). Switching types unmounts and clears obsolete values and errors.
  - **Salaried**: Employer Name (min 2 chars) and Monthly Salary ($\ge$ ₹10,000).
  - **Self-Employed**: Business Name and Annual Turnover ($\ge$ ₹1,20,000).
  - **Existing Monthly EMIs**: Numeric input with formatted Indian currency helper.
  - **Live Eligibility Engine (`utils/eligibility.ts`)**:
    $$\text{Ratio} = \frac{\text{New EMI} + \text{Existing EMIs}}{\text{Monthly Income}} \times 100$$
    - If ratio $> 50\%$: Displays an amber/rose alert detailing the debt obligation and recommends the exact maximum loan amount supported by their income.
    - If ratio $\le 50\%$: Displays an emerald "You look eligible" badge with visual meter.
    - Non-blocking advisory approach: permits user to proceed to review with notes.
- **Step 3 — Document Upload & Review**:
  - **File Upload Dropzone**: Drag-and-drop or browse. Validates MIME type and extension (`.pdf`, `.jpg`, `.jpeg`, `.png`), enforced max size of 2 MB. Generates image thumbnail preview.
  - **Review Summary**: Segmented read-only cards with quick "Edit" jump links back to specific steps.
  - **Submission**: Spinners, double-submit protection, generation of unique sequential ID (`AA-2026-0009`), draft clearing, and animated confirmation screen.
- **Draft Autosave & Resilience (`useDraftAutosave`)**:
  - Debounced auto-save (450ms) to `localStorage` under versioned key `access_assist_draft_v1`.
  - Survives page refreshes; includes subtle "Draft saved ✓" indicator and "Start over" confirmation modal.
  - Wrapped in try/catch to gracefully handle corrupt storage or disabled cookies.

---

### 3. Loan Applications Tracker Dashboard (`/dashboard`)
- **Pre-Seeded Dataset**: 8 realistic Indian mock applications with varied amounts, tenures, dates spanning the past two months, and all four statuses (**Pending, Under Review, Approved, Rejected**).
- **Summary Metric Cards**: KPI counters for Total, Pending, Under Review, Approved, and Rejected applications. Clicking any status card immediately filters the dashboard.
- **URL-Synced Search, Filter, and Sort (`useUrlFilters`)**:
  - **Debounced Search**: 350ms debounce across Application ID, Applicant Name, and PAN.
  - **Status Filter**: All, Pending, Under Review, Approved, Rejected.
  - **Sort Options**: Date (newest/oldest), Loan Amount (high to low / low to high).
  - State synced to query parameters (e.g., `?q=priya&status=Approved&sort=amount_desc`). Preserves history on browser back/forward and page refresh.
- **Data Privacy & PAN Masking (Bonus)**:
  - Formatted as `ABCDE****F`.
  - Per-row eye toggle to reveal/mask individual PANs.
  - Global toggle button ("Reveal All PANs" / "Mask All PANs") in the filter toolbar.
- **Responsive Layout**: High-density interactive data table on desktop with sortable column headers; touch-friendly card list on mobile.
- **Detail Drawer & Status Updater**:
  - Slides in smoothly from the right (full screen on mobile), traps focus, supports `ESC` key and backdrop dismissal, locks background body scroll.
  - Full applicant dossier, employment breakdown, loan repayment metrics, verified document details, and historical audit timeline.
  - **Reviewer Actions**: Approve, Reject, or Mark Under Review.
  - **Rejection Remarks**: Enforces mandatory underwriter comments (min 5 chars, max 250 chars with live counter).
- **Simulated Async API Behavior (`services/mockApi.ts`)**:
  - Simulates network delay of **600 ms** (`API_CONFIG.DELAY_MS`).
  - Simulates a realistic **20% failure rate** (`API_CONFIG.FAILURE_RATE`).
  - **Error Toast with Working Retry**: In case of network failure, the application shows an actionable toast with a **"Retry"** button that re-executes the exact status update with preserved remarks.
  - Request ID tracking prevents stale responses or out-of-order race conditions.

---

## 🏗️ Folder Structure

```
access-assist-loan-portal/
├── index.html                     # Entry HTML with Inter & Plus Jakarta Sans typography
├── package.json                   # Dependencies, scripts, and engine metadata
├── tsconfig.json                  # Strict TypeScript compiler options & path aliases
├── vite.config.ts                 # Vite bundler configuration & Vitest test runner setup
├── tailwind.config.js             # Fintech color palette, shadows, animations, and tokens
├── postcss.config.js              # PostCSS Tailwind and Autoprefixer plugins
├── vercel.json                    # SPA rewrite rule for client-side routing
├── public/
│   └── _redirects                 # SPA rewrite fallback for Netlify
└── src/
    ├── main.tsx                   # React root mount
    ├── App.tsx                    # Routing layout, toast provider & context providers
    ├── index.css                  # Tailwind directives and custom scrollbars
    ├── types/
    │   └── index.ts               # Core domain interfaces, enums, and utility types
    ├── constants/
    │   └── index.ts               # Financial boundaries, regexes, API latency & keys
    ├── data/
    │   └── mockApplications.ts    # 8 pre-seeded realistic Indian applicant profiles
    ├── utils/
    │   ├── emi.ts                 # Pure EMI and amortization schedule algorithms
    │   ├── eligibility.ts         # FOIR calculation and safe borrowing limits
    │   ├── validators.ts          # Name, phone, email, and 2MB file validation
    │   ├── pan.ts                 # PAN format validation, masking, and normalization
    │   ├── date.ts                # Precision age calculator (>= 21 years) and formatting
    │   ├── format.ts              # Indian currency and file size formatters
    │   └── id.ts                  # Incremental ID generator (AA-2026-0001)
    ├── schemas/
    │   ├── applicantSchema.ts     # Zod schema for Step 1
    │   ├── employmentSchema.ts    # Zod schema for Step 2
    │   └── documentSchema.ts      # Zod schema for Step 3
    ├── services/
    │   ├── storage.ts             # Safe localStorage abstraction with corruption recovery
    │   └── mockApi.ts             # 600ms latency & 20% failure simulation with race guard
    ├── hooks/
    │   ├── useDebounce.ts         # Generic debounce hook for search inputs
    │   ├── useLocalStorage.ts     # Synchronized localStorage state hook
    │   ├── useDraftAutosave.ts    # Debounced form draft autosave hook
    │   ├── useUrlFilters.ts       # URL query parameter sync for table search & sorting
    │   ├── useEmiCalculator.ts    # Calculator state and slider-clamping hook
    │   ├── useToast.ts            # Shortcut hook to ToastContext
    │   └── useApplications.ts     # Shortcut hook to ApplicationsContext
    ├── context/
    │   ├── ApplicationsContext.tsx # Central applications state and async dispatch
    │   └── ToastContext.tsx       # Accessible toast notification container
    ├── components/
    │   ├── ui/                    # Reusable atomic UI components (Button, Input, Badge, etc.)
    │   ├── layout/                # Persistent Navbar, Footer, PageContainer
    │   ├── calculator/            # SliderInput, EmiResults, BreakdownChart, AmortizationTable
    │   ├── apply/                 # Stepper steps, EligibilityCard, SuccessScreen
    │   └── dashboard/             # SummaryCards, FiltersBar, ApplicationsTable, Drawer
    ├── routes/
    │   ├── HomePage.tsx           # Home with Interactive EMI Calculator
    │   ├── ApplyPage.tsx          # Multi-step loan application form
    │   ├── DashboardPage.tsx      # Applications tracker and review drawer
    │   └── NotFoundPage.tsx       # 404 fallback page
    └── tests/
        ├── setup.ts               # Jest DOM matchers setup
        ├── emi.test.ts            # Pure math and amortization boundary tests
        ├── pan.test.ts            # PAN regex and masking tests
        ├── phone.test.ts          # Indian mobile number format tests
        ├── age.test.ts            # Exact 21-year age boundary tests
        ├── eligibility.test.ts    # FOIR and zero-income guard tests
        ├── fileValidation.test.ts # 2MB size and MIME type tests
        └── format.test.ts         # Indian currency and number formatting tests
```

---

## 💾 State Management & Architecture Approach

1. **Applications Store (`ApplicationsContext + useReducer`)**:
   - The application registry is held in React Context with a pure `useReducer` to manage state mutations (`ADD_APPLICATION`, `UPDATE_STATUS`, `SET_APPLICATIONS`).
   - On every mutation, the state is safely persisted to `localStorage` under `access_assist_applications_v1`.
   - *Why this choice?* Avoids unnecessary third-party overhead (Redux/Zustand) while giving predictable unidirectional data flow, simple debugging, and clear separation of concerns.

2. **URL as the Single Source of Truth for Dashboard Filters (`useUrlFilters`)**:
   - Search text (`q`), status (`status`), and sort (`sort`) live in URL query parameters using `react-router-dom`'s `useSearchParams`.
   - Bookmarkable, shareable URLs, and native browser forward/back button navigation work effortlessly.

3. **Draft Auto-Save (`useDraftAutosave`)**:
   - Form inputs and current step are debounced at 450ms and saved under `access_assist_draft_v1`.
   - Protected with schema validation and fallback defaults to prevent application crashes from corrupted local storage data.

---

## 🧪 Unit Testing

All unit tests are written with **Vitest** and cover financial calculations, edge conditions, and input validation:

- **EMI Math**: Verified against standard financial formula ($₹10,00,000$ @ $10\%$ for $12$ months $= ₹87,916$), $r = 0$ edge case, min/max bounds, and zero remaining balance in amortization.
- **PAN**: Verified regex `^[A-Z]{5}[0-9]{4}[A-Z]{1}$` against valid codes and invalid lengths/cases/symbols.
- **Phone**: Tested valid Indian mobile numbers ($^[6-9]\d{9}$) vs invalid starting digits and lengths.
- **Age**: Verified exact age calculation including leap year birthdays, applicants 1 day short of 21, and upper bound ($> 70$).
- **Eligibility (FOIR)**: Verified $50\%$ threshold, self-employed monthly income derivation $(\text{Turnover} / 12)$, and zero-income safety guards.
- **File Validation**: Validated exact 2 MB boundary, 2 MB + 1 byte rejection, and MIME extensions.
- **Currency**: Tested standard `en-IN` currency formatting.

Run tests:
```bash
npm run test
```

---

## 💻 Local Setup & Development

### Prerequisites
- **Node.js** $\ge 18$
- **npm** $\ge 9$

### Installation Steps
```bash
# 1. Clone the repository
git clone https://github.com/sanjana-maurya/access-assist-loan-portal.git

# 2. Navigate to project root
cd access-assist-loan-portal

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Run test suite
npm run test

# 6. Build for production
npm run build
```

---

## 🛡️ Edge Cases Handled

1. **Input Normalization & Clamping**: Prevents `e`, `+`, `-`, and exponential characters in numeric boxes. Allows fluent typing and clamps safely on blur.
2. **Zero or Negative Income Guard**: Ensures division-by-zero does not cause `NaN` or `Infinity` in FOIR calculations.
3. **Switching Employment Types**: Automatically unmounts and purges fields and errors from the other employment category.
4. **Step Guard Navigation**: Prevents users from manually clicking forward in the stepper past uncompleted/invalid steps.
5. **Corrupt LocalStorage Recovery**: Try-catch guards safely fall back to seeded mock data if corrupt JSON is present.
6. **Double-Click & Double-Submit Protection**: Submit buttons are disabled with animated loading spinners while requests are in flight.
7. **Simulated Network Failures with Retry**: The mock API rejects $20\%$ of updates; the toast provides an immediate **"Retry"** action that re-invokes the same update with preserved reviewer remarks.
8. **SPA Route Deep-Linking**: Configured with `vercel.json` rewrites and `public/_redirects` to ensure direct access to `/dashboard` or `/apply` does not trigger 404s on static hosting.

---

## 👩‍💻 Author & Assessment Submission
- **Candidate**: Sanjana Maurya
- **Role**: React.js Frontend Developer
- **Submission To**: Divya Sahu, Team Lead (`admin@accessassist.in`)
- **Assessment**: Access Assist Technical Assignment — Loan Application & EMI Management Portal
