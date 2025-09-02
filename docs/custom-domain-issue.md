## Summary
Support configuring a custom domain for the GitHub Pages site with HTTPS enforced.

## Motivation
- Branded URL (e.g., debt.example.com)
- Trust via HTTPS and stable domain

## Proposed steps
1) Add DNS CNAME to point to paraserv.github.io (or A records if apex)
2) Add CNAME file with chosen domain to repo root
3) Enable custom domain in Pages settings and enforce HTTPS
4) Verify certificate issuance and redirect http->https

## Notes
- Pages already enabled with build_type=workflow and HTTPS enforced for the default domain.
- When a domain is chosen, open a follow-up PR adding CNAME.

## Acceptance criteria
- Custom domain resolves to the site over HTTPS; no mixed content.
- README updated with new URL.
