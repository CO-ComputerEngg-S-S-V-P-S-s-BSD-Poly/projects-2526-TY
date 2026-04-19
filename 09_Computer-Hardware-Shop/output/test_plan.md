# Test Plan - Computer Hardware Shop (Flask)

## 1. Document Information
- Project: Computer Hardware Shop
- Application Type: Flask web application (server-rendered templates + API endpoints)
- Prepared On: 2026-03-30
- Version: 1.0
- Purpose: Define a structured test strategy for validating functional correctness, integration stability, and release readiness.

## 2. Test Objectives
- Verify all core user journeys from authentication to purchase completion.
- Validate correctness of cart, wishlist, order, recommendation, custom-PC, and service modules.
- Ensure data integrity across SQLAlchemy models and route-level workflows.
- Detect regressions quickly with a prioritized test suite (smoke + critical regression + full regression).
- Confirm minimum non-functional quality for usability, reliability, and basic security.

## 3. System Under Test (SUT)

### 3.1 Core Tech Stack
- Python Flask (`Flask`, `Flask-SQLAlchemy`, `Flask-Login`, `Flask-Migrate`, `Flask-Admin`)
- HTML templates (`templates/`)
- Static assets (`static/css`, `static/js`)
- Relational DB via SQLAlchemy models in `models.py`

### 3.2 Major Functional Modules
- Authentication and account: `/register`, `/login`, `/logout`, `/profile`
- Product browsing: `/products`, `/product/<id>`, `/search`, `/api/product_suggestions`
- Cart: `/cart`, `/api/cart/*`, `/cart/setup/<group_id>`
- Wishlist: `/wishlist`, `/api/wishlist/*`
- Checkout and payment: `/proceed-payment`, `/payment`, order history routes
- Recommendation and prebuilds: `/api/recommendations`, `/recommended-prebuilds/*`, `/prebuild/checkout`
- Custom PC builder: `/custom-pc`, `/custom-pc/checkout`
- Service requests: `/service`, `/service/payment`
- Supporting utilities: product image route, setup image rules, user activity tracking

## 4. Scope

### 4.1 In Scope
- Functional testing of all user-facing pages and API endpoints.
- Integration testing of route-to-model persistence behavior.
- Data validation and negative testing for major form submissions.
- Cross-module workflow testing (for example: product -> cart -> payment -> order history).
- Regression testing for previously stable modules after changes.

### 4.2 Out of Scope (Current Plan)
- Deep load/performance benchmarking at production traffic scale.
- Penetration testing by external security tools.
- Infrastructure/network failover testing.
- Mobile app testing (project is web-based).

## 5. Test Strategy

### 5.1 Test Levels
- Unit Tests: utility functions, parsing helpers, recommendation logic, validator behavior.
- Integration Tests: Flask routes + DB interaction using a test database.
- End-to-End (E2E) Tests: full browser/user flows for critical business journeys.
- Manual Exploratory Tests: UI behavior, edge navigation, and usability.

### 5.2 Test Types
- Functional testing
- Negative/error-path testing
- Regression testing
- Basic security testing (auth access control, input sanity, session behavior)
- Compatibility testing (major desktop browsers)

### 5.3 Recommended Tooling
- `pytest` + Flask test client for unit/integration
- Optional: `pytest-cov` for coverage tracking
- Optional E2E: Playwright or Selenium for key user journeys
- Manual test checklists for UI and exploratory validation

## 6. Test Environment

### 6.1 Environments
- Local QA environment (developer machine, isolated test DB)
- Staging-like environment (release candidate validation before demo/deployment)

### 6.2 Baseline Configuration
- Python environment with `requirements.txt`
- Database initialized with migrations
- Seeded product records across major categories (CPU, GPU, RAM, SSD, Monitor, etc.)

### 6.3 Browser Matrix
- Chrome (latest stable)
- Edge (latest stable)
- Firefox (latest stable)

## 7. Test Data Plan

### 7.1 User Accounts
- Standard user account (non-admin)
- Admin user account
- Invalid credential sets for negative tests

### 7.2 Product Data
- In-stock products
- Out-of-stock or low-stock products (where applicable)
- Products with rich specs/tags for search and recommendation checks

### 7.3 Transaction Data
- Cart with single item
- Cart with multiple items and quantity updates
- Saved wishlist items and saved setup entries
- Multiple addresses per user
- Completed orders and service requests for history verification

## 8. Entry and Exit Criteria

### 8.1 Entry Criteria
- Application starts successfully with configured dependencies.
- Database schema is up to date via migrations.
- Required seed data and test users are available.
- Critical environment issues are resolved.

### 8.2 Exit Criteria
- 100% of P0 and P1 test cases pass.
- No open P0/P1 defects; P2 defects have documented workaround or release acceptance.
- Critical end-to-end journeys pass on all target browsers.
- Regression suite pass rate >= 95%.

## 9. Defect Severity and Priority
- P0 Critical: checkout/order corruption, auth bypass, crash on core journey.
- P1 High: core module behavior incorrect but workaround exists.
- P2 Medium: non-critical behavior issue affecting usability or consistency.
- P3 Low: cosmetic or minor content issues.

## 10. Structured Test Scenario Matrix

| ID | Module | Scenario | Type | Priority | Expected Result |
|---|---|---|---|---|---|
| AUTH-01 | Authentication | Register with valid username/email/password | Functional | P0 | User account created; login possible |
| AUTH-02 | Authentication | Register with duplicate email/username | Negative | P1 | Registration blocked with clear message |
| AUTH-03 | Authentication | Login with valid credentials | Functional | P0 | Session created; protected pages accessible |
| AUTH-04 | Authentication | Login with invalid credentials | Negative | P1 | Login denied without server error |
| AUTH-05 | Authentication | Logout from active session | Functional | P1 | Session cleared and protected pages locked |
| PROF-01 | Profile | Open profile as logged-in user | Functional | P1 | User data, orders, addresses rendered |
| PROD-01 | Catalog | Open `/products` and view product cards | Functional | P0 | Product list loads with key item details |
| PROD-02 | Product Detail | Open `/product/<id>` valid and invalid IDs | Functional/Negative | P1 | Valid shows details; invalid handled safely |
| SEARCH-01 | Search | Search by exact product term | Functional | P1 | Relevant products ranked and displayed |
| SEARCH-02 | Search | Search by partial/fuzzy term | Functional | P2 | Useful fuzzy matches shown |
| SEARCH-03 | Suggestions | Call `/api/product_suggestions` | API | P2 | Suggestions return expected JSON structure |
| CART-01 | Cart | Add product to cart via API | API/Functional | P0 | Item added with correct quantity |
| CART-02 | Cart | Update quantity for existing cart item | API/Functional | P0 | Quantity updated and totals recalculated |
| CART-03 | Cart | Remove selected cart items | API/Functional | P1 | Selected items removed correctly |
| CART-04 | Cart | Clear full cart | API/Functional | P1 | Cart becomes empty |
| CART-05 | Cart | Move cart items to wishlist | Integration | P1 | Item removed from cart and present in wishlist |
| WISH-01 | Wishlist | Add product to wishlist | API/Functional | P1 | Wishlist entry created |
| WISH-02 | Wishlist | Prevent duplicate wishlist entries | Negative | P2 | Duplicate blocked or merged safely |
| WISH-03 | Wishlist | Move wishlist items to cart | Integration | P1 | Item appears in cart with expected state |
| ADDR-01 | Address | Add address from profile/checkout | Functional | P1 | Address saved and selectable |
| ADDR-02 | Address | Update existing address | Functional | P2 | Address updated correctly |
| ADDR-03 | Address | Delete address and verify absence | Functional | P2 | Address removed from user list |
| PAY-01 | Checkout | Proceed payment with valid cart + address | Integration | P0 | Payment step opens successfully |
| PAY-02 | Checkout | Attempt payment with empty cart | Negative | P0 | Blocked with proper user feedback |
| ORDER-01 | Orders | Complete payment and create order record | Integration | P0 | Order + order items persisted correctly |
| ORDER-02 | Orders | View order in `/profile/orders/<id>` | Functional | P1 | Correct order details rendered |
| REC-01 | Recommendation | Call `/api/recommendations` with known profile text | API/Functional | P1 | Recommendation payload returned with setup data |
| REC-02 | Recommendation | Use unknown profile text fallback | Negative/Functional | P2 | Fallback category returned safely |
| PRE-01 | Prebuild | Open recommended prebuild listing/detail pages | Functional | P1 | Prebuild pages load with setup and products |
| PRE-02 | Prebuild Checkout | Checkout selected prebuild setup | Integration | P0 | Prebuild converts into order/cart flow correctly |
| CPC-01 | Custom PC | Open `/custom-pc` and select components | Functional | P1 | Builder loads and selections persist |
| CPC-02 | Custom PC Checkout | Submit `/custom-pc/checkout` with valid selection | Integration | P0 | Valid custom build enters checkout/order flow |
| CPC-03 | Custom PC Checkout | Submit invalid/missing component set | Negative | P1 | Request rejected with clear error |
| SRV-01 | Service | Create service request for repair/installation/upgrade | Functional | P1 | Service request persisted with selected fields |
| SRV-02 | Service Payment | Complete `/service/payment` flow | Integration | P1 | Payment confirmation and status update succeed |
| SEC-01 | Security | Access protected routes without login | Security | P0 | Redirect/denial enforced |
| SEC-02 | Security | Validate unsafe/malformed form input handling | Security/Negative | P1 | Input handled safely without crash or injection |
| ADM-01 | Admin | Verify admin-only management access | Functional/Security | P1 | Admin permitted, non-admin blocked |
| IMG-01 | Image Utilities | Product/setup image fallback behavior | Functional | P2 | Valid image or fallback shown consistently |

## 11. Regression Suites

### 11.1 Smoke Suite (Build Verification)
- AUTH-03, PROD-01, CART-01, PAY-01, ORDER-01, SEC-01

### 11.2 Critical Regression Suite (Pre-Release)
- All P0 + selected P1 scenarios impacting purchase/service conversion.

### 11.3 Full Regression Suite
- Complete matrix in Section 10 across target browsers.

## 12. Non-Functional Checks (Basic Baseline)
- Page load sanity on key pages (`/products`, `/cart`, `/custom-pc`, `/service`).
- UI responsiveness and readability on desktop/laptop resolutions.
- Session stability across login/logout and checkout transitions.
- Error-message clarity for failed forms and blocked actions.

## 13. Risks and Mitigations
- Risk: Missing seed data can block scenario execution.  
  Mitigation: Maintain repeatable seed setup script and QA data checklist.
- Risk: Complex cross-module flow defects (wishlist/cart/prebuild/custom checkout).  
  Mitigation: Keep dedicated integration regression set for these linked modules.
- Risk: Single large `app.py` increases regression impact of changes.  
  Mitigation: Run smoke suite on every change; full regression before releases.

## 14. Deliverables
- This test plan document
- Executable test cases (manual checklist + automated tests where available)
- Defect log with priority and status
- Test summary report per test cycle (pass/fail, blockers, release recommendation)

## 15. Approval Checklist
- Test lead/developer confirms scenario coverage of all critical routes.
- Product owner/supervisor agrees with release criteria.
- Final regression report accepted before demonstration or deployment.

