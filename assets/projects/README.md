# Project image guide

The profile gallery uses public-facing product imagery only. Never add dashboards containing customer data, credentials, private analytics, internal URLs, or environment details.

## Current assets

- `mytnr.jpg` — public repository hero artwork for the MyTNR platform at `https://www.mytnr.org/`.
- `northfxtrade.png` — public NorthFXTrade homepage at `https://northfxtradegb.vercel.app/`.
- `shia-taleem.png` — public SHIA TALEEM homepage at `https://shiataleem4.vercel.app/en`.
- `swissproperty.png` — public SwissProperty homepage at `https://swisproperty.vercel.app/`.
- `naseeb-chapati.png` — public Naseeb Chapati homepage at `https://www.naseebcapati.com/`.
- `rego.webp` — public REGO tourism marketplace homepage at `https://www.rego.services/`.
- `skardu-travel-planner.webp` — public Skardu Travel Planner homepage at `https://skardutravelplanner.com/`.
- `al-khalifa.webp` — public Al Khalifa Signature homepage at `https://www.restoranalkhalifa.com/`.
- `arifa-overseas.webp` — public Arifa Overseas homepage at `https://arifaoverseas.my/`.
- `northdigital-tech.webp` — public NorthDigital Tech portfolio homepage at `https://www.northdigitaltech.com/`.

The nine product screenshots were captured from public deployments at a desktop viewport. MyTNR uses its repository-owned public hero artwork because the live animated homepage does not produce a stable clean capture. All assets are optimized for the GitHub gallery.

The `animated/` directory contains GitHub-safe SVG presentation frames generated from these source images. Each frame adds a subtle staggered shimmer and breathing accent border, with a static fallback for visitors who prefer reduced motion. Regenerate them with `node scripts/generate-project-frames.mjs` after replacing a source screenshot.

## Adding another project

Use a 16:9 PNG or WebP at roughly 1280×720, keep the optimized file below 300 KB where practical, and provide all of the following before adding it to `README.md`:

1. A public-safe project name and one-line description.
2. A verified live URL, if one exists.
3. A public repository URL, if the repository is public.
4. A verified technology list.
5. Confirmation that the screenshot contains no private or customer information.
