# XPChain Web Remaining Work Items

작성일: 2026-02-25  
상태: Active backlog

## 1) Wallet QA Finalization

- [ ] Windows x64 wallet install/sync/send/receive validation
- [ ] Windows x86 wallet install test on x64 host (호환성 확인)
- [ ] Linux and macOS validation summaries reflected on website docs page
- [ ] Final user-facing wallet guide (install, backup, recovery) from internal references

## 2) Content / Docs Completion

- [ ] Legacy docs final wording review (Korean first)
- [ ] Optional English patch pass across major pages
- [ ] Archive policy decision for old Wix links (if Wix shutdown, remove all legacy outward links)
- [ ] Publish a concise “history + current operation scope” public-safe statement

## 3) Network / Explorer Operations

- [ ] Confirm network status cache behavior in production (5-minute cache)
- [ ] Add simple monitoring alert for API failures (`/api/status`, explorer status endpoint)
- [ ] Final production check for explorer DB-sync banner logic

## 4) Deployment / Infra

- [ ] Production environment variable checklist document
- [ ] Deploy/redeploy runbook with rollback steps
- [ ] Domain transition checklist (Wix sunset -> standalone site DNS/cutover)

## 5) Security / Release Hygiene

- [ ] Verify all wallet download links + SHA256 values on each release
- [ ] Add release update checklist for wallets page (`vNext`, `stable`, hash, verify commands)
- [ ] Separate internal sensitive docs from public docs before any future repository opening

## 6) Nice-to-Have

- [ ] Footer/legal text microcopy final review
- [ ] Accessibility pass (heading hierarchy, focus states, contrast)
- [ ] Basic analytics/event tracking for download buttons
