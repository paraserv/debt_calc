# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Advanced Debt Payoff Calculator - A single-file, client-side web application for comparing debt payoff strategies. The app is entirely contained in `debt-calculator.html` with embedded CSS and JavaScript for maximum portability.

## Architecture

### Single-File Design
- **Main Application**: `debt-calculator.html` - Contains all HTML, CSS, and JavaScript
- **No build process required** - Open directly in browser
- **No external dependencies** - All functionality is self-contained
- **LocalStorage persistence** - Theme and analytics settings persist locally

### Core Payoff Strategies
The calculator implements 5 debt payoff methods:
1. **Snowball**: Lowest balance first
2. **Avalanche**: Highest interest rate first  
3. **Cash Flow Index (CFI)**: Best cash flow improvement ratio
4. **Credit Score (Waterfall)**: 5-phase credit optimization strategy
   - Phase 1: Emergency Recovery (89% utilization threshold)
   - Phase 2: Critical Threshold (49%)
   - Phase 3: Good Standing (29%)
   - Phase 4: Premium Qualification (10% overall)
   - Phase 5: AZEO Optimization (All Zero Except One)
5. **Custom**: User-defined order via drag-and-drop

### Key Algorithms
- **Waterfall Credit Score Optimization**: See `determineWaterfallPhase()` and `allocateWaterfallPayment()` functions
- **CFI Calculation**: `balance / (minPayment - monthlyInterest)` 
- **Amortization**: Monthly payment allocation with interest calculation
- **Extra Payment Scheduling**: Calendar-based additional payment system

## Development Commands

### Testing
```bash
# Run unit tests (Node.js)
node tests.js

# Run comprehensive browser tests
node run-tests.js

# Run HTML-based tests
node run-html-tests.js

# Validate calculations
node validate-calculations.js
```

### Local Development
```bash
# Open the calculator directly in browser
open debt-calculator.html

# Or use any local server
python3 -m http.server 8000
# Then navigate to http://localhost:8000/debt-calculator.html
```

### Deployment
The site auto-deploys to GitHub Pages on push to `main` branch via `.github/workflows/pages.yml`

## Testing Approach

### Test Files
- `tests.js` - Minimal unit tests for core functions
- `run-tests.js` - Comprehensive test suite for payment allocation algorithms
- `test-debt-calculator.html` - Browser-based integration tests
- `comprehensive-tests.html` - Full UI and calculation tests
- `validate-calculations.js` - Mathematical validation of payoff calculations

### Running Tests in CI
GitHub Actions runs `node tests.js` on every push/PR. See `.github/workflows/tests.yml`

## Key Implementation Details

### Waterfall Strategy Implementation
The waterfall credit score optimization is the most complex strategy:
- Tracks current phase based on card utilizations
- Allocates payments to reach specific utilization thresholds
- Implements AZEO (All Zero Except One) in final phase
- Shows phase progress in UI with visual indicators

### State Management
- Debts stored in `window.debts` array
- Extra payments in `window.extraPayments` object
- Theme and analytics preferences in localStorage
- No external state management libraries

### Export Functionality
- CSV export with simple and detailed formats
- JSON configuration save/load
- Copy to clipboard for configuration sharing

## Code Conventions

### JavaScript Style
- Vanilla JavaScript (no frameworks)
- Functions use camelCase naming
- Global state on `window` object for debugging
- Event handlers attached via `addEventListener`

### CSS Organization
- All styles embedded in `<style>` tag
- Dark mode via `body.dark-mode` class
- Responsive design with CSS Grid and Flexbox
- Utility classes for common patterns

### HTML Structure
- Semantic HTML5 elements
- Accessibility attributes (aria-labels, titles)
- Modal dialogs for complex interactions
- Keyboard shortcuts (Esc to close, Enter to confirm)

## Common Modifications

### Adding a New Payoff Strategy
1. Add option to strategy `<select>` element
2. Implement sorting logic in `updatePayoffOrder()`
3. Update `generatePayoffSchedule()` if special allocation needed
4. Add tooltip explanation in method cards

### Modifying Waterfall Thresholds
Edit the phase definitions in `determineWaterfallPhase()` function

### Changing UI Theme
Modify CSS variables in `:root` and `body.dark-mode` selectors

### Adding Export Formats
Extend `exportSchedule()` function with new format handling

## Important Notes

- **Single-file constraint**: Keep everything in `debt-calculator.html` for portability
- **No external APIs**: All calculations are client-side only
- **Browser compatibility**: Modern browsers only (ES6+ features used)
- **Performance**: Handles up to ~20 debts efficiently
- **Precision**: Financial calculations use 2 decimal places throughout