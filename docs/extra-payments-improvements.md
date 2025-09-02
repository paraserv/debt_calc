## Extra payments enhancements

### 1) Remove/Delete All for Extra Payments
- Add a "🗑️ Remove All" button in the Extra Payments section header
- Confirmation dialog: "Remove all scheduled extra payments?"
- Clears internal `extraPayments` array and UI list, updates summary/schedule

### 2) Schedule modal default date
- When opening the schedule modal from a row, prefill the date picker with the row's current date (if set)
- If no date, use the global start date or current month

### Acceptance criteria
- One-click remove all with confirm
- Schedule modal opens with correct default date inferred from source row
