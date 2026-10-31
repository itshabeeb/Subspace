# Subspace End-to-End Integration Scenarios

These scenarios test multiple components together. They are not claims that
the workflows are already implemented.

| ID | Workflow | Steps | Expected outcome |
|---|---|---|---|
| INT-001 | Customer registration | Register, then log in | Customer can access their portal |
| INT-002 | Product setup | Admin creates product and variant | Product is available for plan configuration |
| INT-003 | Plan setup | Admin creates a billing plan | Plan is available in subscription flow |
| INT-004 | Quotation conversion | Staff creates quotation and confirms it | Subscription is created/updated according to agreed rules |
| INT-005 | Invoice generation | A subscription becomes due | One invoice is generated; duplicate billing is prevented |
| INT-006 | Payment recording | Payment is recorded against invoice | Invoice/payment status is updated consistently |
| INT-007 | Discount application | Eligible discount is applied | Correct discount appears in invoice calculation |
| INT-008 | Renewal reminder | A subscription approaches renewal | Scheduled notification is sent once |
| INT-009 | Customer data isolation | Customer tries to access another customer's records | Access is denied |
| INT-010 | Dashboard reporting | Finance user opens dashboard | Counts and totals match underlying records |

## Background task checks

- Verify Celery worker is running.
- Verify Celery Beat schedule is loaded.
- Verify failed tasks are visible in logs/monitoring.
- Verify retry behavior does not create duplicate invoices or payments.
- Verify email failures do not corrupt subscription or invoice records.

## Payment gateway checks

Use the gateway's sandbox/test mode only.
- Successful test payment
- Declined test payment
- Duplicate webhook/event delivery
- Invalid webhook signature
- Delayed payment notification

Never use real card details in development tests.
