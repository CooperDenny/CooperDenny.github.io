# CooperDenny.github.io

Personal portfolio website for Cooper Denny, live at https://cooperdenny.github.io

## Stack

Static site — plain HTML, CSS, vanilla JavaScript. No build step, no framework.

## Structure

```
├── index.html          # Main page: hero, experience, tech stack, education, projects, contact
├── styles.css          # All styles including light/dark theme via CSS variables
├── config.js           # Site-wide config (e.g. contact email)
├── favicon.svg
├── images/             # Profile photo and other assets
└── projects/
    ├── project-styles.css          # Shared styles for all project pages
    ├── afl-brownlow-2024/          # 2024 Brownlow model project page
    ├── afl-brownlow-2023/          # 2023 Brownlow model project page
    ├── eildon-park-cricket-club/   # EPCC website project page
    ├── h2h-arbitrage-finder/       # Arbitrage finder project page
    ├── melbourne-pedestrian-counting/
    └── victorian-property-prices-dashboard/
```

## Theming

Light/dark mode is toggled via a button and persisted in `localStorage`. Theme is controlled by CSS custom properties on `:root` and `[data-theme="dark"]`.

## Deployment

Deployed automatically via GitHub Pages from the `main` branch. No CI/CD needed — push to main and it's live within seconds.

## Key things to know

- The projects grid in `index.html` uses CSS Grid (`projects-grid` class)
- Each project card links to its own subdirectory under `projects/`
- The Brownlow predictor is represented as a single consolidated card linking to both the 2023 and 2024 model pages
- Do not add a separate card per Brownlow year — keep them consolidated
