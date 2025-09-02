## Consistent outside-click behavior for pop-ups

### Current elements
- Comparison modal (already closes on outside click)
- Schedule modal (new recurring payments)
- Calendar popovers (start date + schedule date pickers)
- Tooltips (ℹ️)

### Recommendation
- Modals: outside click closes and discards unsaved changes (explicit buttons for Apply/Cancel drive commits). Rationale: prevents accidental partial state.
- Popovers (calendars/tooltips): outside click closes; selecting a value commits immediately. Provide a small "Clear" action when applicable.
- Tooltips: hover shows; click toggles sticky (click outside closes). Maintain accessibility via ESC to close.

### Implementation notes
- Add a shared `registerOutsideClickClose(element, onClose)` helper.
- For schedule modal, ensure values not applied until pressing "Apply Schedule"; outside click == Cancel.
- For date popovers, date selection immediately updates hidden input and closes.
