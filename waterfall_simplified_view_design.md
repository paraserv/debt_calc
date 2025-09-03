# Simplified Waterfall Schedule Design

## Problem Statement
The current amortization table shows ALL debts with payment/interest/balance for each, making it overwhelming and hard to track utilization changes and phase progression in the waterfall method.

## Proposed Solution: Utilization-Focused View

### Key Information to Display

**For Each Month:**
1. **Phase Indicator** - Which phase we're in (Emergency, Critical, etc.)
2. **Target Card(s)** - Which cards are being actively paid down
3. **Utilization Changes** - Start/End utilization for active cards
4. **Payment Breakdown** - Min payment, extra payment, total
5. **Progress Metrics** - Overall utilization, cards above threshold

### Display Format Ideas

#### Option 1: Focus on Active Cards Only
```
Month 1 | Phase 1: Emergency Recovery (89% threshold)
---------------------------------------------------------
Target: AMEX Platinum
  Utilization: 95.3% → 89.0% ↓6.3%
  Payment: $500 (min) + $1,174 (extra) = $1,674
  
Other cards: 4 at minimum payments ($800 total)
Overall utilization: 74.3% → 72.1%
```

#### Option 2: Utilization Grid View
```
Month 1 | Phase 1: Emergency Recovery
Card            Start%  → End%    Payment    Extra
AMEX Platinum   95.3%  → 89.0%   $1,674    $1,174 ←
REI MC          95.2%  → 94.8%   $200      -
Navy Federal    93.5%  → 93.1%   $150      -
[3 more at min...]                $450      -
Total                             $2,474    $1,174
```

#### Option 3: Phase Progress View
```
===== PHASE 1: Emergency Recovery (89% threshold) =====
Goal: Get 5 cards below 89% utilization

Month 1-2: AMEX Platinum (95.3% → 89.0%) ✓
Month 3-4: REI MC (95.2% → 89.0%) ✓
Month 5: Navy Federal (93.5% → 89.0%) ✓
[Phase Complete - Moving to Phase 2]

===== PHASE 2: Critical Threshold (49%) =====
Goal: Get 8 cards below 49% utilization
...
```

### Implementation Approach

1. **Data Structure Enhancement**
   - Track utilization at start and end of each month
   - Identify "active" cards (receiving extra payments)
   - Calculate phase transitions

2. **View Options**
   - Toggle button: "Detailed View" / "Simplified Waterfall View"
   - Only show simplified view when waterfall method selected
   - Keep existing detailed view as option

3. **Visual Elements**
   - Color-code utilization levels (red >89%, yellow >49%, green <30%)
   - Progress bars for utilization changes
   - Phase badges/indicators
   - Arrows showing utilization direction

### Benefits
- **Clarity**: Focus on what's changing each month
- **Phase Awareness**: Clear indication of progress through phases
- **Utilization Visibility**: See the key metric for credit score improvement
- **Less Overwhelming**: Hide cards at minimum payment
- **Goal Oriented**: Shows progress toward phase thresholds

### Technical Implementation

```javascript
function generateSimplifiedWaterfallView(schedule) {
    // Group months by phase
    const phaseGroups = groupMonthsByPhase(schedule);
    
    // For each phase, show:
    // - Phase header with goal
    // - Months in that phase
    // - Active cards with utilization changes
    // - Summary of inactive cards
    // - Phase completion milestone
    
    return formattedView;
}
```

### User Experience Flow

1. User selects "Credit Score (Waterfall)" method
2. New button appears: "Show Simplified View"
3. Clicking toggles between:
   - **Detailed**: Current full amortization table
   - **Simplified**: Utilization-focused waterfall view
4. Simplified view shows:
   - Current phase with progress bar
   - Active payment targets
   - Utilization trends
   - Phase milestones

## Recommended Approach

I recommend **Option 1 with enhancements**:
- Focus on one active card at a time (the waterfall target)
- Show before/after utilization clearly
- Summarize other cards in one line
- Add phase progress indicator
- Include visual utilization meter

This provides the clearest view of the waterfall strategy in action while keeping the display simple and focused.