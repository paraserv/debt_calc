## Improve keyboard tab order and focus behavior

### Summary
Ensure logical tab order across the Debt and Extra Payments tables and set initial focus to the date picker in the schedule modal and to the first field on row add.

### Acceptance criteria
- Debt table: left-to-right per row; Enter moves to next field; Esc cancels edits (where applicable).
- Extra Payments: date -> amount -> description -> buttons.
- Schedule modal: focus starts on date picker button; tabbing cycles within modal (focus trap).
