## Summary
Add a "Customize from current method" action that copies the current payoff method's order into the Custom method, so the user can fine‑tune by dragging without losing the method’s baseline ordering.

## Problem
- Today, switching to Custom requires manual reordering from the existing physical order.
- Dragging to tweak the order flips to Custom but doesn't preserve the method’s computed order; users lose the baseline as a starting point.

## Proposal
Add a small button next to the method selector (or inside the summary) that:
- Reads the current method's computed order
- Applies that order to the visible list (physically reorders `debts`)
- Switches the method to `custom`
- Keeps all other state the same

### UI/UX
- Button label: "Customize from <METHOD>" (e.g., "Customize from Avalanche")
- Tooltip: "Copy the current method’s order so you can tweak it"
- Disabled state when already in `custom` and the current physical order already matches the current method’s computed order
- Optional: toast confirmation (e.g., "Custom order synced from Avalanche")

### Implementation sketch
- Function: `syncCustomOrderToCurrentMethod()`
  1. Clone `debts` to `sorted = [...debts]`
  2. Call existing `sortDebtsCopy(sorted, currentMethod)` to get the order
  3. Set `debts = sorted` (reassign physical order)
  4. Update `customOrder` fields to 1..N for display consistency
  5. Call `setMethod('custom', true)` to switch without triggering an extra reorder, then `updateDebtTable()` and `updateAmortizationTable()`
- Add a button near the method selector, e.g. before "Compare All Methods"
- Add a small utility `ordersMatch(a,b)` to disable the button if already in sync

### Edge cases / safeguards
- If schedule is invalid (insufficient payment) still allow sync; it only changes order
- Preserve existing drag behavior and custom order thereafter
- Works for all methods: Snowball, Avalanche, CFI, Credit Score (utilization), and Custom (no‑op)

## Acceptance criteria
- Clicking the action sets the visible order to match the current method and switches to Custom
- Dragging afterwards adjusts Custom without switching away or resetting
- Button disabled when the physical order already matches the method's computed order
- No change to totals/schedule other than ordering effects

## Follow‑ups (optional)
- Keyboard shortcut (e.g., Shift+C)
- Toast system (non‑blocking confirmations)
- Persist last synced method for context in the UI
