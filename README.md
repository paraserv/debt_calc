# Advanced Debt Payoff Calculator

A single-file, client-side calculator to compare debt payoff strategies and generate payoff schedules. No backend required.

- Live site: https://paraserv.github.io/debt_calc/

## Features
- Multiple strategies: Snowball, Avalanche, Cash Flow Index, Credit Score, Custom
- Method Comparison modal with interest and time savings/loss
- Extra payment scheduler with calendar and preview
- Payoff schedule with totals and CSV export (simple and detailed)
- Dark mode with localStorage persistence
- Drag and drop to customize payoff order

## Quick start
- Open `debt-snowball-calculator.html` directly in a browser, or visit the live site above.

## Development
- The app is a single HTML file with embedded CSS/JS for portability.
- Dark mode is toggled via the button in the header and persisted in `localStorage` under the key `theme`.
- To contribute:
  1. Fork and clone
  2. Create a branch
  3. Make changes and open a PR

## Deploy (GitHub Pages)
This repo uses GitHub Pages + Actions. On push to `main`, the site is deployed automatically to GitHub Pages.

## License
MIT — see `LICENSE`.
