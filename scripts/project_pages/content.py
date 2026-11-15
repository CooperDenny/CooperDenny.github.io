"""Project-page copy — data only.

HAND_PAGES are generated in full; REPORT_PAGES only get the shared header/summary
injected above their knitr body. Titles come from content/projects.json (the catalog)
when a page omits "title". Whether an action opens in a new tab is derived from its URL.
Rule: every claim must be traceable to the project itself. No invented metrics.
"""

from __future__ import annotations

HAND_PAGES: dict[str, dict] = {
    "eildon-park-cricket-club": {
        "description": "How Cooper Denny turned Eildon Park Cricket Club’s senior playing history into a structured dataset powering self-updating club records and player profiles.",
        "kicker": "Data engineering · Web · Cricket",
        "lede": "I turned Eildon Park Cricket Club’s scattered senior playing history into one structured dataset, then built the club website around it. Every record, leaderboard and career profile now updates itself when a new season’s data lands.",
        "stack": ["Data modelling", "Data cleaning", "Claude Code", "Netlify"],
        "actions": [
            {"label": "Open the live stats dashboard", "href": "https://eildonparkcc.netlify.app/stats", "icon": "external"},
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
        "description": "Interactive Power BI dashboard by Cooper Denny analysing hourly pedestrian counts from about 100 City of Melbourne sensors since 2010.",
        "kicker": "Time series · BI · Open data",
        "lede": "An interactive Power BI dashboard over the City of Melbourne’s pedestrian sensor network (hourly counts from about 100 locations since 2010), built to show how foot traffic shifts by hour, weekday and year.",
        "stack": ["Python", "Jupyter", "Power BI", "DAX"],
        "actions": [
            {"label": "Open dashboard full screen", "href": "https://app.powerbi.com/view?r=eyJrIjoiMTdlMDVjYTItODBmMC00ZWQxLWFhNmItYzQ3NzMxYzlmNzJmIiwidCI6ImI2YTFjNzYxLWMxN2YtNDg5OC04MGM5LTQ4YzNhZDg5MTE0ZSJ9&pageName=61de34a7e603f2eee3b6", "icon": "external"},
            {"label": "Python notebook on GitHub", "href": "https://github.com/CooperDenny/MelbournePedestrianCountingSystem", "icon": "external"},
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
        "description": "Interactive Power BI report by Cooper Denny on Victorian property sales: median prices, year-on-year change and suburb-level maps.",
        "kicker": "Geospatial · BI · Real estate",
        "lede": "An interactive Power BI report on Victorian residential property sales. Compare median prices and year-on-year change by region, suburb and property type, and see every sale on a map.",
        "stack": ["Power BI", "Power Query", "DAX"],
        "actions": [
            {"label": "Open dashboard full screen", "href": "https://app.powerbi.com/view?r=eyJrIjoiMmM1YmQwNzMtMzkwOS00NWYxLWJlZDItZTAzOWZiMTQ0MmFkIiwidCI6ImI2YTFjNzYxLWMxN2YtNDg5OC04MGM5LTQ4YzNhZDg5MTE0ZSJ9", "icon": "external"},
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


BROWNLOW_NOTE = (
    "<strong>Why not accuracy?</strong> Game-level accuracy was about 93%, but roughly 93.5% of "
    "player-games poll zero votes, so a model that predicts nobody ever polls scores about the same. "
    "Per-class recall and season-level error are the meaningful measures."
)

REPORT_PAGES: dict[str, dict] = {
    "afl-brownlow-2024": {
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
