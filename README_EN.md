[中文](./README.md)

# Jingdezhen Travel Compass

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Language](https://img.shields.io/badge/language-TypeScript-3178c6.svg)

An interactive Jingdezhen travel planning site. It uses a fresh blue-and-white porcelain visual style to show city, Sanbao, Fuliang, Yaoli, and other destination clusters, with practical 1-day, 2-day, 3-day, and custom route planning.

## Features

- Cute Jingdezhen mini map with clickable attractions
- Animated traveler moving through selected routes
- Practical 1-day, 2-day, and 3-day route presets
- Custom route selection and drag sorting
- Time estimation, route warnings, and suburb travel reminders
- Lodging area recommendations
- Traffic, ceramic shopping, workshop, and holiday pitfall notes

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Image Assets

Run `npm run generate:assets` to generate blue-and-white porcelain assets locally with Gemini / nano banana. API keys must stay in `.env.local` or `~/.codex/CODEX.local.md` and must not be committed.

## Deployment

The project is deployed to GitHub Pages with GitHub Actions.
