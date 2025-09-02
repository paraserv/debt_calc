## Credit Score method enhancements

### Current
- Priorities: >100% util to 100%, then >30% to 30%, then avalanche

### Enhancements
1) Display staged targets in UI
   - For each credit card, show target balance thresholds (100% and 30%)
   - In schedule rows, highlight when a card crosses under 100%/30%
2) Configurable thresholds
   - Allow editing the 30% target per card or globally (e.g., 25%)
3) Partial-pay visuals
   - In comparison and summary, add a note when Credit Score method focuses on utilization staging
4) Optional: “Stop-at-30% then Avalanche” toggle (no full payoff before moving on)

### Acceptance criteria
- Users can see and optionally tweak utilization thresholds
- Schedule indicates threshold milestones
- Method remains compatible with existing export logic
