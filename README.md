# XPChain Web

Official website project for XPChain (`www.xpchain.co.kr`).

## Stack

- Next.js 14
- TypeScript
- Tailwind CSS

## Local Development

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000`

## Environment

Copy `.env.example` to `.env` and set values for runtime APIs.

## Project Structure

- `app/`: Next.js App Router pages and API routes
- `components/`: shared UI components
- `lib/`: links/config/utilities
- `public/`: static assets (docs, whitepapers, images)
- `docs/`: planning, internal notes, migration records

## Notes

- This repository is intended to be private while internal/operational docs remain in `docs/internal`.
- Public-safe content can be separated later if open-sourcing is needed.
