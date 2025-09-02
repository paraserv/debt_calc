## Reset / Clear All

### Goal
Provide a single action to reset the workspace to a clean state.

### Behavior
- Button: "Reset All" (confirm dialog)
- Resets:
  - `debts` to a minimal sample or to empty (configurable)
  - `extraPayments` to empty
  - `totalMonthlyPayment` to default
  - `startDate` cleared
  - Method reset to Snowball
- Clears local UI state and re-renders

### Acceptance criteria
- One confirm dialog (no accidental wipes)
- After reset, app shows valid default state and schedules compute
