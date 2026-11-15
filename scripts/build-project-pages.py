#!/usr/bin/env python3
"""Build the /projects/<slug>/ pages.

Single source of truth for every project page's chrome (nav, header, "At a glance"
panel, next-project footer) and copy. Outputs are committed; nothing runs at deploy.

    python3 scripts/build-project-pages.py

Two kinds of page:

* HAND pages (Eildon Park, pedestrian counts, property prices) are generated in
  full from the dicts below. Edit the copy HERE, not in the HTML.

* REPORT pages (Brownlow 2023/2024, arbitrage finder) are knitr/pandoc output.
  Their bodies are left untouched; this script only:
    - swaps the head stylesheet links for ../site.css + ../report.css,
    - removes the old pasted-in nav / theme script / download bar,
    - injects the shared nav, project header, "At a glance" panel and jump links,
    - folds every R code chunk (and long printed outputs) into <details>,
    - appends the next-project footer.
  It is idempotent (injected blocks sit between <!-- cd:… --> markers), so after
  re-knitting a report from its .Rmd, just run this script again.

The arbitrage page's headline numbers are COMPUTED from the report's own embedded
DataTables data on every run, so they can never drift from the snapshot shown.
"""

from __future__ import annotations

import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = ROOT / "public" / "projects"
SITE = "https://cooperdenny.github.io"
GA_ID = "G-GPHTSF6Q5B"

# --------------------------------------------------------------------------
# Icons — Font Awesome Free 6.5.2 paths (CC BY 4.0, https://fontawesome.com/license/free)
# --------------------------------------------------------------------------
ICONS = {
    "arrowRight": ("0 0 448 512", "M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"),
    "arrowLeft": ("0 0 448 512", "M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"),
    "external": ("0 0 512 512", "M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"),
    "download": ("0 0 512 512", "M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"),
    "fileLines": ("0 0 384 512", "M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM112 256H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"),
}


def icon(name: str) -> str:
    vb, d = ICONS[name]
    return f'<svg class="cd-icon" viewBox="{vb}" aria-hidden="true" focusable="false"><path fill="currentColor" d="{d}"/></svg>'


# --------------------------------------------------------------------------
# Page order (drives "Next project") and the short blurbs used in that card
# --------------------------------------------------------------------------
ORDER = [
    ("afl-brownlow-2024", "Predicting the 2024 Brownlow Medal", "Called Cripps and Daicos as the top two, in order, on an unseen season."),
    ("afl-brownlow-2023", "Predicting the 2023 Brownlow Medal", "Version one of the model, and what it taught me for 2024."),
    ("h2h-arbitrage-finder", "Australian Betting Arbitrage Finder", "Live odds from 12 bookmakers, scanned for guaranteed-profit markets."),
    ("eildon-park-cricket-club", "Cricket Club Records & Stats Platform", "A club’s playing history turned into self-updating records."),
    ("melbourne-pedestrian-counting", "Melbourne Pedestrian Traffic Dashboard", "~100 city sensors, hourly since 2010, in Power BI."),
    ("victorian-property-prices-dashboard", "Victorian Property Prices Dashboard", "Median prices and trends by region, suburb and type."),
]


def next_of(slug: str) -> tuple[str, str, str]:
    i = [s for s, _, _ in ORDER].index(slug)
    return ORDER[(i + 1) % len(ORDER)]


# --------------------------------------------------------------------------
# Shared fragments
# --------------------------------------------------------------------------
FONTS = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700'
    '&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">'
)
GA = f"""<script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','{GA_ID}');</script>"""


def nav_html() -> str:
    return f"""<!-- cd:nav -->
<a href="#cd-main" class="cd-skip">Skip to content</a>
<nav class="cd-nav" aria-label="Primary">
  <div class="cd-nav__inner">
    <a href="/" class="cd-nav__brand">Cooper Denny</a>
    <a href="/#projects" class="cd-nav__link">{icon('arrowLeft')} Projects</a>
    <a href="/resume/" class="cd-btn cd-btn--primary cd-btn--small">Résumé</a>
  </div>
</nav>
<!-- /cd:nav -->"""


def hero_html(p: dict) -> str:
    chips = "".join(f"<li>{c}</li>" for c in p["stack"])
    actions = "".join(
        f'<a href="{a["href"]}" class="cd-btn cd-btn--{"primary" if i == 0 else "ghost"}"'
        + (' target="_blank" rel="noopener noreferrer"' if a.get("external") else "")
        + (" download" if a.get("download") else "")
        + f'>{icon(a["icon"])} {a["label"]}</a>'
        for i, a in enumerate(p["actions"])
    )
    meta = f'<p class="cd-hero__meta">{p["meta"]}</p>' if p.get("meta") else ""
    return f"""<header class="cd-hero">
  <div class="cd-wrap">
    <p class="cd-kicker">{p["kicker"]}</p>
    <h1>{p["title"]}</h1>
    <p class="cd-hero__lede">{p["lede"]}</p>
    {meta}
    <ul class="cd-chips" aria-label="Tools used">{chips}</ul>
    <div class="cd-hero__actions">{actions}</div>
  </div>
</header>"""


def glance_html(p: dict) -> str:
    g = p["glance"]
    did = "".join(f"<li>{x}</li>" for x in g["did"])
    metrics = ""
    if g.get("metrics"):
        cls = " cd-metrics--3" if len(g["metrics"]) == 3 else ""
        metrics = f'<dl class="cd-metrics{cls}">' + "".join(
            f'<div class="cd-metric"><dt>{label}</dt><dd>{value}</dd></div>' for value, label in g["metrics"]
        ) + "</dl>"
    outcome = f'<div><h3>Outcome</h3><p>{g["outcome"]}</p></div>' if g.get("outcome") else ""
    note = f'<p class="cd-glance__note">{g["note"]}</p>' if g.get("note") else ""
    toc = ""
    if p.get("toc"):
        key_cls = ' class="cd-toc__key"'
        toc = '<nav class="cd-toc" aria-label="On this page"><h2>On this page</h2><ol>' + "".join(
            f'<li><a href="#{anchor}"{key_cls if key else ""}>{label}</a></li>'
            for label, anchor, key in p["toc"]
        ) + "</ol></nav>"
    return f"""<section class="cd-glance" aria-labelledby="cd-glance-title">
  <h2 id="cd-glance-title">At a glance</h2>
  <div class="cd-glance__grid">
    <div><h3>The question</h3><p>{g["question"]}</p></div>
    <div><h3>What I did</h3><ul>{did}</ul></div>
    {outcome}
  </div>
  {metrics}
  {note}
</section>
{toc}"""


def next_html(slug: str) -> str:
    nslug, ntitle, ndesc = next_of(slug)
    return f"""<!-- cd:next -->
<aside class="cd-next" aria-label="More work">
  <div class="cd-wrap">
    <p class="cd-next__label">Next project</p>
    <a class="cd-next__card" href="/projects/{nslug}/">
      <span class="cd-next__title">{ntitle} {icon('arrowRight')}</span>
      <p class="cd-next__desc">{ndesc}</p>
    </a>
    <div class="cd-next__actions">
      <a href="/#projects" class="cd-btn cd-btn--ghost">{icon('arrowLeft')} All projects</a>
      <a href="/resume/" class="cd-btn cd-btn--primary">{icon('fileLines')} View résumé</a>
    </div>
  </div>
</aside>
<footer class="cd-footer"><div class="cd-wrap"><p>© Cooper Denny · Data Scientist · Melbourne, Australia</p></div></footer>
<!-- /cd:next -->"""


def head_common(p: dict, slug: str) -> str:
    desc = html.escape(p["description"], quote=True)
    title = html.escape(f'{p["title"]} — Cooper Denny', quote=True)
    return f"""<meta name="description" content="{desc}">
<meta name="theme-color" content="#0b1120">
<meta name="color-scheme" content="dark">
<link rel="canonical" href="{SITE}/projects/{slug}/">
<link rel="icon" href="/favicon.svg">
<meta property="og:type" content="article">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{SITE}/projects/{slug}/">
<meta property="og:image" content="{SITE}/images/hero-image.png">"""


# --------------------------------------------------------------------------
# HAND pages — copy lives here
# --------------------------------------------------------------------------
HAND = {
    "eildon-park-cricket-club": {
        "title": "Cricket Club Records & Stats Platform",
        "description": "How Cooper Denny turned Eildon Park Cricket Club’s senior playing history into a structured dataset powering self-updating club records and player profiles.",
        "kicker": "Data engineering · Web · Cricket",
        "lede": "I turned Eildon Park Cricket Club’s scattered senior playing history into one structured dataset, then built the club website around it. Every record, leaderboard and career profile now updates itself when a new season’s data lands.",
        "stack": ["Data modelling", "Data cleaning", "Claude Code", "Netlify"],
        "actions": [
            {"label": "Open the live stats dashboard", "href": "https://eildonparkcc.netlify.app/stats", "icon": "external", "external": True},
        ],
        "glance": {
            "question": "How do you give a community club accurate, browsable records when its history lives in season-by-season scorebooks and spreadsheets?",
            "did": [
                "Compiled and cleaned batting and bowling data from every senior season into one consistent structure.",
                "Derived records, career aggregates and averages from that data, rather than typing them in by hand.",
                "Built and shipped the full club website with Claude Code, deployed on Netlify.",
            ],
            "outcome": "A live stats hub with club leaderboards and a profile for every senior player, filterable by team and season, with <strong>no manual upkeep</strong>: records recalculate from the data each season.",
        },
        "body": """
<h2>What’s in the dashboard</h2>
<div class="cd-gallery">
  <figure class="cd-figure">
    <img src="player-stats-dashboard.webp" width="1600" height="920" loading="lazy" alt="Club player stats dashboard showing leaderboards for most runs, most wickets and most matches played">
    <figcaption>Club leaderboards: all-time runs, wickets and matches played.</figcaption>
  </figure>
  <div class="cd-gallery cd-gallery--2">
    <figure class="cd-figure">
      <img src="individual-player-stats-1.webp" width="1600" height="977" loading="lazy" alt="Individual player profile with career batting and bowling summary and team and season filters">
      <figcaption>Player profile: career batting and bowling summary, filterable by team and season.</figcaption>
    </figure>
    <figure class="cd-figure">
      <img src="individual-player-stats-2.webp" width="1600" height="1002" loading="lazy" alt="Season-by-season performance charts and a breakdown table by team">
      <figcaption>Season-by-season charts and a breakdown by team.</figcaption>
    </figure>
  </div>
</div>

<h2>How the data works</h2>
<p>The hard part wasn’t the website. It was the data. Historical statistics came from club records spanning many seasons, in inconsistent formats. I cleaned and standardised them into a single season-by-season structure for batting and bowling, so every number on the site is <strong>derived</strong> rather than maintained:</p>
<ul>
  <li><strong>All-time records</strong> for individual players across batting and bowling.</li>
  <li><strong>Career aggregates and averages</strong>, recalculated from the underlying data.</li>
  <li><strong>Season-by-season breakdowns</strong> for every player.</li>
  <li><strong>Club record holders</strong> across the key statistical categories.</li>
</ul>
<p>Adding a new season means adding that season’s data. The leaderboards, profiles and records follow automatically.</p>

<h2>Built with Claude Code</h2>
<p>I built the whole site with Claude Code as my primary development tool. It took the project from first design to a production site deployed on Netlify, as a solo volunteer project. It’s a practical example of AI-assisted development getting a real community project shipped quickly, with the data work, not the boilerplate, getting the attention.</p>
""",
    },
    "melbourne-pedestrian-counting": {
        "title": "Melbourne Pedestrian Traffic Dashboard",
        "description": "Interactive Power BI dashboard by Cooper Denny analysing hourly pedestrian counts from about 100 City of Melbourne sensors since 2010.",
        "kicker": "Time series · BI · Open data",
        "lede": "An interactive Power BI dashboard over the City of Melbourne’s pedestrian sensor network (hourly counts from about 100 locations since 2010), built to show how foot traffic shifts by hour, weekday and year.",
        "stack": ["Python", "Jupyter", "Power BI", "DAX"],
        "actions": [
            {"label": "Open dashboard full screen", "href": "https://app.powerbi.com/view?r=eyJrIjoiMTdlMDVjYTItODBmMC00ZWQxLWFhNmItYzQ3NzMxYzlmNzJmIiwidCI6ImI2YTFjNzYxLWMxN2YtNDg5OC04MGM5LTQ4YzNhZDg5MTE0ZSJ9&pageName=61de34a7e603f2eee3b6", "icon": "external", "external": True},
            {"label": "Python notebook on GitHub", "href": "https://github.com/CooperDenny/MelbournePedestrianCountingSystem", "icon": "external", "external": True},
        ],
        "glance": {
            "question": "When and where is Melbourne’s CBD busiest, and how has that pattern changed over the years?",
            "did": [
                "Collected the City of Melbourne’s open sensor data with Python and reshaped it into a Power BI-ready table.",
                "Built DAX measures for 4-week and 52-week rolling averages to separate trend from weekly noise.",
                "Mapped every sensor by latitude and longitude, with slicers for sensor, day of week, weekday/weekend and year.",
            ],
            "metrics": [("~100", "Sensors across the city"), ("Hourly", "Count granularity"), ("2010", "Data starts"), ("4 &amp; 52 wk", "Rolling averages")],
        },
        "body": """
<h2>The dashboard</h2>
<div class="cd-embed">
  <iframe title="Melbourne pedestrian traffic dashboard (Power BI)" loading="lazy" allowfullscreen
    src="https://app.powerbi.com/view?r=eyJrIjoiMTdlMDVjYTItODBmMC00ZWQxLWFhNmItYzQ3NzMxYzlmNzJmIiwidCI6ImI2YTFjNzYxLWMxN2YtNDg5OC04MGM5LTQ4YzNhZDg5MTE0ZSJ9&amp;pageName=61de34a7e603f2eee3b6"></iframe>
</div>
<p class="cd-embed-actions">On a phone? The report is easier to use <a href="https://app.powerbi.com/view?r=eyJrIjoiMTdlMDVjYTItODBmMC00ZWQxLWFhNmItYzQ3NzMxYzlmNzJmIiwidCI6ImI2YTFjNzYxLWMxN2YtNDg5OC04MGM5LTQ4YzNhZDg5MTE0ZSJ9&amp;pageName=61de34a7e603f2eee3b6" target="_blank" rel="noopener noreferrer">full screen</a>, rotated to landscape.</p>

<h3>Two pages</h3>
<ul>
  <li><strong>Daily pedestrian count</strong>: total daily foot traffic across whichever sensors you select, with rolling averages to show the trend.</li>
  <li><strong>Pedestrian count summary</strong>: average traffic by hour of day, broken down by day of week, weekday vs weekend, and year.</li>
</ul>

<h2>Data and preparation</h2>
<p>The data is the City of Melbourne’s <a href="https://pedestrian.melbourne.vic.gov.au" target="_blank" rel="noopener noreferrer">Pedestrian Counting System</a>: hourly counts from sensors across the CBD, going back to January 2010.</p>
<ul>
  <li><strong>Python</strong> handled collection and transformation into a single tidy table for Power BI. The <a href="https://github.com/CooperDenny/MelbournePedestrianCountingSystem" target="_blank" rel="noopener noreferrer">Jupyter notebook is on GitHub</a>.</li>
  <li><strong>DAX measures</strong> add 4-week and 52-week rolling averages, so seasonal swings and long-term shifts are visible at a glance.</li>
  <li><strong>Geospatial</strong>: sensor latitude and longitude drive the map, and a slicer isolates any one of the ~100 sensors.</li>
</ul>
""",
    },
    "victorian-property-prices-dashboard": {
        "title": "Victorian Property Prices Dashboard",
        "description": "Interactive Power BI report by Cooper Denny on Victorian property sales: median prices, year-on-year change and suburb-level maps.",
        "kicker": "Geospatial · BI · Real estate",
        "lede": "An interactive Power BI report on Victorian residential property sales. Compare median prices and year-on-year change by region, suburb and property type, and see every sale on a map.",
        "stack": ["Power BI", "Power Query", "DAX"],
        "actions": [
            {"label": "Open dashboard full screen", "href": "https://app.powerbi.com/view?r=eyJrIjoiMmM1YmQwNzMtMzkwOS00NWYxLWJlZDItZTAzOWZiMTQ0MmFkIiwidCI6ImI2YTFjNzYxLWMxN2YtNDg5OC04MGM5LTQ4YzNhZDg5MTE0ZSJ9", "icon": "external", "external": True},
        ],
        "glance": {
            "question": "How do property prices differ across Victoria’s regions and suburbs, and which way are they moving?",
            "did": [
                "Cleaned a Kaggle dataset of Victorian property sales in Power Query: removed irrelevant rows, fixed data errors, and reshaped columns for geographic and time analysis.",
                "Wrote DAX measures for median sale price and year-on-year change.",
                "Built a map of sold properties with slicers for region, suburb and property attributes.",
            ],
            "outcome": "A self-serve report where anyone can drill from the whole state down to a single suburb and see prices, recent sales and the trend in a few clicks.",
        },
        "body": """
<h2>The dashboard</h2>
<div class="cd-embed">
  <iframe title="Victorian property prices dashboard (Power BI)" loading="lazy" allowfullscreen
    src="https://app.powerbi.com/view?r=eyJrIjoiMmM1YmQwNzMtMzkwOS00NWYxLWJlZDItZTAzOWZiMTQ0MmFkIiwidCI6ImI2YTFjNzYxLWMxN2YtNDg5OC04MGM5LTQ4YzNhZDg5MTE0ZSJ9"></iframe>
</div>
<p class="cd-embed-actions">On a phone? The report is easier to use <a href="https://app.powerbi.com/view?r=eyJrIjoiMmM1YmQwNzMtMzkwOS00NWYxLWJlZDItZTAzOWZiMTQ0MmFkIiwidCI6ImI2YTFjNzYxLWMxN2YtNDg5OC04MGM5LTQ4YzNhZDg5MTE0ZSJ9" target="_blank" rel="noopener noreferrer">full screen</a>, rotated to landscape.</p>

<h3>What you can do with it</h3>
<ul>
  <li><strong>Map</strong>: every sold property plotted across Victoria.</li>
  <li><strong>Filter</strong> by region, suburb and property attributes with slicers.</li>
  <li><strong>Compare</strong> prices, locations and key attributes in interactive tables.</li>
  <li><strong>Track</strong> median prices and year-on-year change with calculated measures.</li>
</ul>

<h2>Data and preparation</h2>
<p>The source is a Kaggle dataset of Victorian property sales, with location, price, property type and sale date for each sale. Preparation was done entirely in Power BI:</p>
<ul>
  <li><strong>Power Query</strong>: filtered out irrelevant entries, corrected data errors, and transformed columns to support geographic and time-based analysis.</li>
  <li><strong>DAX</strong>: calculated columns and measures for median prices and year-on-year trends.</li>
</ul>
""",
    },
}


def build_hand(slug: str, p: dict) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{p["title"]} — Cooper Denny</title>
{head_common(p, slug)}
{GA}
{FONTS}
<link rel="stylesheet" href="../site.css">
<!-- Generated by scripts/build-project-pages.py — edit the copy there, then re-run it. -->
</head>
<body class="cd-page">
{nav_html()}
<main id="cd-main">
{hero_html(p)}
<div class="cd-wrap">
{glance_html(p)}
<article class="cd-article">
{p["body"].strip()}
</article>
</div>
</main>
{next_html(slug)}
</body>
</html>
"""


# --------------------------------------------------------------------------
# REPORT pages
# --------------------------------------------------------------------------
BROWNLOW_NOTE = (
    "<strong>Why not accuracy?</strong> Game-level accuracy was about 93%, but roughly 93.5% of "
    "player-games poll zero votes, so a model that predicts nobody ever polls scores about the same. "
    "Per-class recall and season-level error are the meaningful measures."
)

REPORTS = {
    "afl-brownlow-2024": {
        "title": "Predicting the 2024 Brownlow Medal",
        "description": "Cooper Denny’s ordinal logistic regression for AFL Brownlow Medal votes, tested on the unseen 2024 season: r = 0.93 on season tallies, Cripps and Daicos called as the top two.",
        "kicker": "Statistical modelling · AFL",
        "lede": "An ordinal logistic regression that predicts every player’s 3-2-1 umpire votes, game by game. Trained on 2015–2023 and scored on the unseen 2024 season, it named <strong>Patrick Cripps and Nick Daicos as the top two, in order</strong>, and had Cripps breaking the all-time vote record.",
        "meta": "Trained on 2015–2023 · Tested on 2024 · Written in R",
        "stack": ["R", "ordinal (CLM)", "tidyverse", "DT", "Feature engineering"],
        "actions": [
            {"label": "Download the dataset (CSV)", "href": "brownlow_data_2024.csv", "icon": "download", "download": True},
            {"label": "See the 2023 model", "href": "/projects/afl-brownlow-2023/", "icon": "arrowRight"},
        ],
        "glance": {
            "question": "Brownlow votes are given by umpires, not by a formula. How much of who polls can player-game statistics explain?",
            "did": [
                "Built a player-game dataset from fitzRoy, afl.com.au, AFL Tables and the AFL Coaches Association, then engineered features such as ineffective disposals and prior-season polling.",
                "Fitted an ordinal logistic regression (cumulative link model) on 2015–2023 home-and-away games, adding <strong>player position</strong> after the 2023 model over-rated ruckmen.",
                "Turned vote probabilities into expected votes and allocated 3-2-1 within each game, just as the umpires do.",
            ],
            "metrics": [
                ("r = 0.93", "Predicted vs actual season tallies"),
                ("2.0", "Mean absolute error, votes per player"),
                ("56%", "Games where it found the 3-vote player, of 46"),
                ("Top 2", "Cripps &amp; Daicos, in the right order"),
            ],
            "note": BROWNLOW_NOTE,
        },
        "toc": [
            ("Introduction", "introduction", False),
            ("Data", "data-preparation", False),
            ("Model", "model-training", False),
            ("Testing", "model-testing", False),
            ("Season results", "season-votes", True),
            ("Conclusion", "conclusion", False),
        ],
    },
    "afl-brownlow-2023": {
        "title": "Predicting the 2023 Brownlow Medal",
        "description": "Version one of Cooper Denny’s AFL Brownlow Medal prediction model: an ordinal logistic regression trained on 2015–2022 and tested on 2023.",
        "kicker": "Statistical modelling · AFL",
        "lede": "Version one of my Brownlow model: an ordinal logistic regression trained on 2015–2022 and tested on the unseen 2023 season. It didn’t pick the winner, Lachie Neale, but <strong>the real top three all finished inside its predicted top four</strong>.",
        "meta": "Trained on 2015–2022 · Tested on 2023 · Written in R",
        "stack": ["R", "ordinal (CLM)", "tidyverse", "DT"],
        "actions": [
            {"label": "Download the dataset (CSV)", "href": "brownlow_data.csv", "icon": "download", "download": True},
            {"label": "See the improved 2024 model", "href": "/projects/afl-brownlow-2024/", "icon": "arrowRight"},
        ],
        "glance": {
            "question": "Brownlow votes are given by umpires, not by a formula. How much of who polls can player-game statistics explain?",
            "did": [
                "Compiled a player-game dataset from fitzRoy, afl.com.au, AFL Tables and the AFL Coaches Association, and engineered features such as ineffective disposals and prior-season votes.",
                "Fitted an ordinal logistic regression (cumulative link model) on 2015–2022 home-and-away games.",
                "Allocated 3-2-1 within each game from expected votes and compared it with the umpires’ actual votes.",
            ],
            "outcome": "Ruckmen such as Max Gawn and Tim English came out well above what they actually polled. That finding drove the <strong>player position</strong> variable in the 2024 model, which lifted correlation from 0.885 to 0.928.",
            "metrics": [
                ("r = 0.885", "Predicted vs actual season tallies"),
                ("2.17", "Mean absolute error, votes per player"),
                ("57%", "Games where it found the 3-vote player, of 46"),
                ("3 of 3", "Actual top three inside its predicted top four"),
            ],
            "note": BROWNLOW_NOTE,
        },
        "toc": [
            ("Introduction", "introduction", False),
            ("Data", "data-preparation", False),
            ("Model", "model-training", False),
            ("Testing", "model-testing", False),
            ("Season results", "season-votes", True),
            ("Conclusion", "conclusion", False),
        ],
    },
    "h2h-arbitrage-finder": {
        "title": "Australian Betting Arbitrage Finder",
        "description": "An R pipeline by Cooper Denny that pulls live head-to-head odds from 12 Australian bookmakers via The Odds API and flags guaranteed-profit (arbitrage) markets.",
        "kicker": "APIs · Data pipelines · R",
        "lede": "An R pipeline that pulls live head-to-head odds from 12 Australian bookmakers through The Odds API, adjusts for exchange commission, and flags any market where backing every outcome locks in a profit.",
        "meta": None,  # filled in from the report: "Snapshot: <date> · …"
        "stack": ["R", "REST API (The Odds API)", "oddsapiR", "tidyverse", "DT"],
        "actions": [
            {"label": "Jump to the results", "href": "#identifying-head-to-head-arbitrage-opportunities", "icon": "arrowRight"},
            {"label": "Download the R Markdown", "href": "H2H-Arbitrage-Finder.Rmd", "icon": "download", "download": True},
        ],
        "glance": {
            "question": "Bookmakers price the same game differently. How often do those gaps add up to a guaranteed profit, and how big is it?",
            "did": [
                "Queried every active sport through The Odds API and collected head-to-head odds from 12 Australian bookmakers.",
                "Kept the best price for each outcome, netted off Betfair commission, and converted lay odds to their back-bet equivalent.",
                "Summed the implied probabilities. Any market whose book adds up to under 100% is an arbitrage.",
            ],
            # metrics + note computed from the report data in arbitrage_facts()
        },
        "toc": [
            ("Introduction", "introduction", False),
            ("Collecting odds", "extracting-head-to-head-odds", False),
            ("Head-to-head results", "identifying-head-to-head-arbitrage-opportunities", True),
            ("Back/lay results", "identifying-back-and-lay-arbitrage-opportunities", False),
            ("Conclusion", "conclusion", False),
        ],
    },
}

MONTHS = "January February March April May June July August September October November December".split()


def datatables(src: str) -> list[dict]:
    out = []
    for m in re.finditer(r'<script type="application/json" data-for="[^"]+">(.*?)</script>', src, flags=re.S):
        x = json.loads(m.group(1))["x"]
        heads = [h.strip() for h in re.findall(r"<th>(.*?)</th>", x.get("container", ""))]
        out.append({"heads": heads, "data": x.get("data", [])})
    return out


def arbitrage_facts(src: str) -> tuple[str, list[tuple[str, str]], str]:
    """Headline numbers for the arbitrage page, computed from its own embedded tables."""
    # Fresh knit: the "* Updated as of `r Sys.Date()`" bullet. Re-run: the marker we left in the header.
    date = re.search(r"Updated as of (\d{4})-(\d{2})-(\d{2})", src) or re.search(r"cd:snapshot (\d{4})-(\d{2})-(\d{2})", src)
    snapshot = f"{int(date.group(3))} {MONTHS[int(date.group(2)) - 1]} {date.group(1)}" if date else "latest run"

    def summarise(tbl: dict) -> dict:
        h, d = tbl["heads"], tbl["data"]
        col = lambda name: d[h.index(name)]
        n = len(col("market"))
        markets = {}
        for i in range(n):
            key = (col("home_team")[i], col("away_team")[i], col("commence_time")[i])
            markets.setdefault(key, (float(col("market")[i]), []))[1].append(float(col("converted_odds")[i]))
        arbs = {k: v for k, v in markets.items() if v[0] < 100}
        best = max((100 / v[0] - 1) * 100 for v in arbs.values()) if arbs else 0.0
        top_odds = max((o for v in arbs.values() for o in v[1]), default=0.0)
        return {"markets": len(markets), "sports": len(set(col("sport"))), "arbs": len(arbs), "best": best, "top_odds": top_odds}

    tables = [t for t in datatables(src) if "market" in t["heads"] and "converted_odds" in t["heads"]]
    if len(tables) < 2:
        raise SystemExit("arbitrage report: expected the H2H and back/lay result tables — has the report changed?")
    h2h, bl = summarise(tables[0]), summarise(tables[1])

    metrics = [
        (f'{h2h["markets"]:,}', f'Head-to-head markets scanned, {h2h["sports"]} sports'),
        (str(h2h["arbs"]), "Head-to-head arbitrages found"),
        (f'{h2h["best"]:.2f}%', "Best guaranteed return (head-to-head)"),
        (str(bl["arbs"]), f'Back/lay opportunities (best {bl["best"]:.2f}%)'),
    ]
    overall_best = max(h2h["best"], bl["best"])
    longshot = max(h2h["top_odds"], bl["top_odds"])
    ceiling = "under 1%" if overall_best < 1 else f"at most {overall_best:.2f}%"
    note = f"<strong>The finding:</strong> genuine edges are rare and thin. Every opportunity in this snapshot returned {ceiling}"
    if longshot >= 20:
        note += (
            f", and the biggest leaned on extreme long-shot prices (up to ${longshot:g}), which are the most likely "
            "to be stale or stake-limited. In practice this is a monitoring tool, not a money machine."
        )
    else:
        note += ". In practice this is a monitoring tool, not a money machine."
    meta = f"Snapshot: {snapshot} · 12 bookmakers incl. Betfair exchange · Written in R"
    if date:
        meta += f" <!-- cd:snapshot {date.group(1)}-{date.group(2)}-{date.group(3)} -->"
    return meta, metrics, note


def fold_code(src: str) -> str:
    """Wrap knitr code chunks, and long printed outputs, in <details>. Idempotent."""
    # R source chunks
    src = re.sub(
        r'(?<!<summary>R code</summary>)\n?<pre class="r"><code>(.*?)</code></pre>',
        lambda m: f'\n<details class="cd-code"><summary>R code</summary><pre class="r"><code>{m.group(1)}</code></pre></details>',
        src,
        flags=re.S,
    )

    # Printed outputs: fold anything long, except the confusion matrix (it's the result).
    def fold_output(m: re.Match) -> str:
        body = m.group(1)
        lines = body.count("\n") + 1
        if lines <= 14 or "Confusion Matrix" in body:
            return m.group(0)
        return f'<details class="cd-output"><summary>Printed output · {lines} lines</summary><pre><code>{body}</code></pre></details>'

    src = re.sub(r'(?<!</summary>)<pre><code>(##.*?)</code></pre>', fold_output, src, flags=re.S)
    return src


def replace_between(src: str, start: str, end: str, new: str) -> tuple[str, bool]:
    i, j = src.find(start), src.find(end)
    if i == -1 or j == -1:
        return src, False
    return src[:i] + new + src[j + len(end):], True


def build_report(slug: str, p: dict) -> None:
    path = PROJECTS / slug / "index.html"
    src = path.read_text(encoding="utf-8")

    p = dict(p)
    p["glance"] = dict(p["glance"])
    if slug == "h2h-arbitrage-finder":
        meta, metrics, note = arbitrage_facts(src)
        p["meta"], p["glance"]["metrics"], p["glance"]["note"] = meta, metrics, note
        # The "Updated as of" bullet now lives in the header meta line.
        src = re.sub(r"<ul>\s*<li>Updated as of [^<]*</li>\s*</ul>\s*", "", src)

    # <title> + head assets (old per-folder rmd-styles.css and Font Awesome go away).
    src = re.sub(r"<title>.*?</title>", f'<title>{html.escape(p["title"])} — Cooper Denny</title>', src, count=1, flags=re.S)
    src = re.sub(r'\s*<link href="https://fonts.googleapis.com/css2[^"]*" rel="stylesheet">', "", src)
    src = re.sub(r'\s*<link rel="stylesheet" href="rmd-styles.css">', "", src)
    src = re.sub(r'\s*<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/[^"]*">', "", src)
    head_block = f"""<!-- cd:head -->
<meta name="viewport" content="width=device-width, initial-scale=1">
{head_common(p, slug)}
{FONTS}
<link rel="stylesheet" href="../site.css">
<link rel="stylesheet" href="../report.css">
<!-- /cd:head -->"""
    src, had = replace_between(src, "<!-- cd:head -->", "<!-- /cd:head -->", head_block)
    if not had:
        src = src.replace("</head>", head_block + "\n</head>", 1)

    # Body class.
    src = re.sub(r"<body[^>]*>", '<body class="cd-page cd-report">', src, count=1)

    # Old pasted-in nav + its theme script (first run only).
    src = re.sub(r"<!-- Site Navigation -->\s*<nav class=\"site-nav\".*?</nav>\s*<script>.*?</script>", "", src, count=1, flags=re.S)
    # Old download bar (the CSV is now a header button).
    src = re.sub(r'<div class="rmd-download-bar".*?</a>\s*</div>', "", src, count=1, flags=re.S)

    # Nav right after <body>.
    src, had = replace_between(src, "<!-- cd:nav -->", "<!-- /cd:nav -->", nav_html())
    if not had:
        src = src.replace('<body class="cd-page cd-report">', '<body class="cd-page cd-report">\n' + nav_html(), 1)

    # Header: replace pandoc's #header block (first run) or our previous block.
    header = f'<!-- cd:header -->\n<div id="cd-main">\n{hero_html(p)}\n{glance_html(p)}\n</div>\n<!-- /cd:header -->'
    src, had = replace_between(src, "<!-- cd:header -->", "<!-- /cd:header -->", header)
    if not had:
        new, n = re.subn(r'<div id="header">.*?</div>', lambda _m: header, src, count=1, flags=re.S)
        if n != 1:
            raise SystemExit(f"{slug}: couldn't find pandoc's <div id=\"header\"> block")
        src = new

    src = fold_code(src)

    # Footer.
    src, had = replace_between(src, "<!-- cd:next -->", "<!-- /cd:next -->", next_html(slug))
    if not had:
        src = src.replace("</body>", next_html(slug) + "\n</body>", 1)

    path.write_text(src, encoding="utf-8")


def main() -> None:
    for slug, p in HAND.items():
        (PROJECTS / slug / "index.html").write_text(build_hand(slug, p), encoding="utf-8")
        print("built", slug)
    for slug, p in REPORTS.items():
        build_report(slug, p)
        print("enhanced", slug)


if __name__ == "__main__":
    sys.exit(main())
