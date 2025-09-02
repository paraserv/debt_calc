## Summary
Schedule Recurring Payments modal fails to pre-select the month from the clicked Extra Payments row (repro on the very first row).

## Steps to reproduce
1. In Extra Payments Schedule, click the first row's calendar and select a month (e.g., September 2025).
2. Enter an amount.
3. Click the row's Schedule button.

## Expected
- Modal Start Date shows the row month immediately (e.g., September 2025).
- Modal calendar renders on the same month.

## Actual
- Start Date still shows “Select Month”.
- Calendar opens on September, but the header/label isn’t synced to the row and must be selected again.

## Attempts tried so far (unsuccessful)
- Read hidden YYYY-MM input from the row and fall back to global start date.
- Parse the row's visible label (e.g., “September 2025”) back to YYYY-MM.
- Focus the modal date button and set its label on open.
- Force render of the modal calendar using the selected month.
- Standardized modal calendar IDs and tried to pass them explicitly.

## Hypotheses
- Using `parentElement` may resolve the wrong row; use `button.closest('.extra-payment-row')` instead.
- Hidden date selector is too generic; scope to the resolved row.
- The visible label and hidden value can diverge; trust the hidden input as source-of-truth and update both in one place.
- Modal calendar/date-display IDs diverge; ensure both use the same `modalCalendarId` throughout.

## Proposed fix
1. Change `openScheduleModal(button)` to resolve the row with `closest('.extra-payment-row')`.
2. Read hidden date via `row.querySelector('[id^="date-input-"]')`.
3. Pass the resolved rowId (suffix) into modal init; set both hidden `#scheduleStartDate` and the modal date-display text together.
4. Ensure `renderModalCalendar(modalCalendarId, selectedDate)` uses the same id as `date-display-${modalCalendarId}`.
5. Add a unit test: set row hidden to YYYY-MM, call `openScheduleModal`, assert modal label === formatted month.

## Confidence
Low until event scoping/ID alignment is refactored and the unit test is added; previous fixes addressed symptoms rather than the underlying selector coupling.
