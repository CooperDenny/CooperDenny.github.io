# CooperDenny.github.io

Personal portfolio and project showcase site for Cooper Denny, Data Scientist based in Melbourne, Victoria.

**Live site:** [cooperdenny.github.io](https://cooperdenny.github.io)

## Overview

A static site built with HTML, CSS, and vanilla JavaScript. Features a light/dark theme toggle (persisted via `localStorage`), responsive mobile layout, and individual project pages for data science work.

## Structure

```
├── index.html                  # Home page (experience, education, projects, contact)
├── styles.css                  # Home page styles (light/dark theme)
├── config.js                   # Site config
├── images/                     # Profile photo and assets
└── projects/
    ├── project-styles.css      # Shared styles for project pages
    ├── rmd-styles.css          # Styles for knitted R Markdown blog posts
    ├── AFL.Brownlow.Prediction.Model.2024.html   # 2024 Brownlow model (R Markdown)
    ├── AFL.Brownlow.Prediction.Model.html        # 2023 Brownlow model (R Markdown)
    ├── h2h-arbitrage-finder.html                 # Arbitrage finder (R Markdown)
    ├── melbourne-pedestrian-counting.html        # Melbourne pedestrian dashboard
    └── victorian-property-prices-dashboard.html  # Victorian property dashboard
```

## Projects

| Project | Tools | Description |
|---|---|---|
| [2024 AFL Brownlow Prediction Model](https://cooperdenny.github.io/projects/AFL.Brownlow.Prediction.Model.2024.html) | R, Machine Learning | Ordinal logistic regression predicting Brownlow Medal votes |
| [2023 AFL Brownlow Prediction Model](https://cooperdenny.github.io/projects/AFL.Brownlow.Prediction.Model.html) | R, Machine Learning | Same model applied to the 2023 season |
| [Australian Arbitrage Betting Finder](https://cooperdenny.github.io/projects/h2h-arbitrage-finder.html) | R, API | Real-time arbitrage detection across Australian bookmakers |
| [Melbourne Pedestrian Counting System](https://cooperdenny.github.io/projects/melbourne-pedestrian-counting.html) | Power BI, Python | Dashboard analysing pedestrian traffic from ~100 CBD sensors |
| [Victorian Property Prices Dashboard](https://cooperdenny.github.io/projects/victorian-property-prices-dashboard.html) | Power BI | Interactive property market explorer with geographic mapping |
