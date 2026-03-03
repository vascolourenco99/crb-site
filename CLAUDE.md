# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page website for **Clube de Radiomodelismo de Benfica (CRB)** — a Portuguese radio-controlled modelling club. No build system, no dependencies, no framework — just vanilla HTML/CSS/JS.

## Development

No build or install step needed. Open `index.html` directly in a browser or serve it with any static HTTP server:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

There are no lint tools or tests configured.

## Architecture

Everything lives in a single file: `index.html` (~30 KB).

### Sections (in order)

- `#sobre` — Hero with club stats
- `#eventos` — Upcoming events grid
- `#pista` — Monsanto track info
- `#documentos` — Password-protected member documents
- `#contacto` — Contact form and info

### Hardcoded data (inline JS near bottom of `index.html`)

- `EVENTOS` array — event objects with `data`, `titulo`, `local`, `tipo`, `descricao`
- `DOCS` object — keyed by year (`"2025"`, `"2024"`, ...), each an array of `{ titulo, tipo, link }`
- `CORRECT_PASSWORD` — client-side only; the comment in code notes this should be protected server-side with `.htaccess` in production

### Design system

CSS custom properties defined in `:root`:
- Primary accent: `--cyan: #00C8E8`
- Secondary accent: `--pink: #FF2D6B`
- Background: near-black (`#0A0A0F`, `#12121A`)
- Fonts: Bebas Neue (display), IBM Plex Sans (body), IBM Plex Mono (UI/code)

Single responsive breakpoint at `max-width: 900px`.

## Google integrations

Both integrations share a single `CONFIG.apiKey` (one Google Cloud project, enable both Calendar API and Drive API).

### Google Calendar (events section)

Fetches upcoming events via Calendar API v3. Config in `CONFIG.calendar`:
- `id` — public calendar ID (Calendar settings → "Integrate calendar" → "Calendar ID")
- `maxEvents` — how many upcoming events to show (default 9)

The calendar must be shared publicly. The event **Description** field is used as the tag (`Treino`, `Competição`, `Workshop`, etc.) — if empty, defaults to `Evento`.

Falls back to the hardcoded `EVENTOS` array if Calendar is not configured.

### Google Drive (documents section)

Fetches files from per-year folders via Drive API v3. Config in `CONFIG.drive.folderIds` — one folder ID per year. Folders must be shared as "Anyone with the link → Viewer". Setup steps: see `SETUP_GOOGLE_DRIVE.md`.

Supports PDFs (download link) and Google Docs/Sheets (PDF export link), sorted by upload date newest first.

## Content Updates

- Add/modify events: edit the `EVENTOS` array in `index.html`
- Club contact info, track hours, and other static text is inline HTML — search for the relevant string to locate it
