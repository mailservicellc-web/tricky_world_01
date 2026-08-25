# TRICKY WORLD

> The game that doesn't play fair.

TRICKY WORLD is a lightweight, touch-first puzzle game being engineered for YouTube Playables and the web.

## Engineering principles

- Gameplay first: fast feedback, fair tricks, instant retry.
- TypeScript strict mode and small, explicit abstractions.
- Data-driven levels instead of level-specific conditionals.
- Platform integrations isolated behind adapters.
- Privacy and performance by design.
- No monetization in the foundation build.

## Stack

- Phaser
- TypeScript
- Vite
- Vitest

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Tests:

```bash
npm test
```

## Current milestone: M0

The repository currently contains the initial game foundation and a first `find-odd` interaction. This is intentionally small: we will validate the core game feel before adding content, monetization, or platform-specific integration.

## YouTube Playables

The game core is intentionally independent of YouTube. A dedicated platform adapter will be introduced only after the applicable official Playables API and certification requirements are verified.
