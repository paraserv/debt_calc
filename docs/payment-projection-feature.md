## Payment Projections (future changes to total monthly payment)

### Summary
Allow users to model raises or changes to the "Total Monthly Payment" starting at a specific future month.

### Proposal
- New section: "Payment Projections"
- Users add entries: (Start Month, New Total Monthly Payment)
- Engine uses the latest projection whose month <= current month when calculating base extra (i.e., monthly payment - total minimums)

### UI
- Table with add/remove rows similar to Extra Payments
- Optional: quick presets (+$100 in 6 months, etc.)

### Engine integration
- When computing base extra in `calculatePayoffSchedule`, derive `totalMonthlyPayment` per month based on the projection table, not a single global value.

### Acceptance criteria
- Schedule reflects increased/decreased payments at the selected month
- Exports include the effective monthly payment per month
