# Subspace API Test Cases

**Status:** Test plan template. Execute only after the backend endpoints are available.

| ID | Module | Scenario | Expected result |
|---|---|---|---|
| API-001 | Authentication | Register with valid details | Account created; agreed success status and response |
| API-002 | Authentication | Register with an existing email | Validation/conflict response; no duplicate account |
| API-003 | Authentication | Register with invalid password | Validation error |
| API-004 | Authentication | Login with valid credentials | Authenticated response/token according to chosen method |
| API-005 | Authentication | Login with invalid credentials | Authentication failure without sensitive detail leakage |
| API-006 | Products | List products | Only permitted product data returned |
| API-007 | Products | Request unknown product ID | Not-found response |
| API-008 | Plans | List plans | Plans and billing frequencies returned |
| API-009 | Subscriptions | Customer requests own subscriptions | Only that customer's subscriptions returned |
| API-010 | Subscriptions | Customer requests another customer's subscription | Access denied or not found, according to security design |
| API-011 | Invoices | Customer lists invoices | Only that customer's invoices returned |
| API-012 | Discounts | Apply expired discount | Discount rejected |
| API-013 | Payments | Submit invalid payment amount | Validation error; no incorrect payment recorded |
| API-014 | Reports | Customer requests admin report | Access denied |
| API-015 | Users | Staff attempts to create staff account | Access denied if only admin may create staff |

## Record actual results

For each test, record:
- Date and tester
- Environment and API version
- Request used (remove secrets/tokens)
- Actual HTTP status and response
- Pass/fail
- Bug/ticket reference
