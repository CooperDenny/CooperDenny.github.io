"""Project-page copy — data only.

HAND_PAGES are generated in full; REPORT_PAGES only get the shared header/summary
injected above their knitr body. Titles come from content/projects.json (the catalog)
when a page omits "title". Whether an action opens in a new tab is derived from its URL.
Rule: every claim must be traceable to the project itself. No invented metrics.
"""

from __future__ import annotations

HAND_PAGES: dict[str, dict] = {
    "eildon-park-cricket-club": {
        "description": "How Cooper Denny built epcc.org.au, Eildon Park Cricket Club’s website, around every senior season since 1989/90 and live Play Cricket data: records, player pages and match centres that update themselves.",
        "kicker": "Data engineering · Web · Cricket",
        "lede": "I built Eildon Park Cricket Club’s website, <a href=\"https://epcc.org.au\" target=\"_blank\" rel=\"noopener noreferrer\">epcc.org.au</a>, around one dataset: every senior Saturday season since 1989/90, joined to live Play Cricket data. Records, leaderboards and a page for every one of 800+ players update themselves as games are played.",
        "stack": ["Data modelling", "Data cleaning", "Play Cricket API", "Next.js", "Supabase", "Claude Code", "Netlify"],
        "actions": [
            {"label": "Open the player stats", "href": "https://epcc.org.au/stats", "icon": "external"},
            {"label": "Visit epcc.org.au", "href": "https://epcc.org.au", "icon": "external"},
        ],
        "glance": {
            "question": "How do you give a community club accurate, browsable records when its history lives in decades of scorebooks and spreadsheets, and new games are played every week?",
            "did": [
                "Cleaned 37 seasons of club statistics, from 1989/90 on, into one player-season dataset: 4,800 rows across 800+ players.",
                "Joined it to the Play Cricket API: 1,100+ archived scorecards since 2009/10 for match-level records, and live figures for the senior XIs from 2026/27, refreshed hourly.",
                "Built and shipped the whole club website with Claude Code (Next.js, Supabase, Netlify), including an admin portal the committee uses for news, match reports and emails.",
            ],
            "outcome": "A live stats hub with club totals, record holders and a profile for every player, plus a match centre for every game, with <strong>no manual upkeep</strong>: every number recalculates from the data.",
            "metrics": [("818", "Players on record"), ("37", "Seasons, since 1989/90"), ("1,100+", "Match scorecards archived"), ("Hourly", "Live refresh from Play Cricket")],
        },
        "body": """
<h2>What’s on the site</h2>
<div class="cd-gallery">
  <figure class="cd-figure">
    <img src="player-profile.webp" width="1600" height="950" loading="lazy" alt="Player page for Cooper Denny: 108 games, 1,433 runs, 117 wickets, all-time club ranks, and tabs for batting, bowling, fielding, teammates, matches and seasons">
    <figcaption>A player page (mine): career figures, all-time club ranks, and tabs for batting, bowling, fielding, teammates, matches and seasons.</figcaption>
  </figure>
  <div class="cd-gallery cd-gallery--2">
    <figure class="cd-figure">
      <img src="record-holders.webp" width="1600" height="718" loading="lazy" alt="Record holders: career leaders for runs, wickets, games and not outs, filterable by XI">
      <figcaption>Record holders: career leaders, best seasons and single-game records, filterable by XI.</figcaption>
    </figure>
    <figure class="cd-figure">
      <img src="match-centre-worm.webp" width="1600" height="708" loading="lazy" alt="Match centre worm graph comparing both teams' runs by over, with wickets marked">
      <figcaption>Match centre: worm, Manhattan and run-rate graphs from Play Cricket’s ball-by-ball data.</figcaption>
    </figure>
  </div>
</div>

<h2>How the data works</h2>
<p>The hard part wasn’t the website. It was the data. The club’s history came from records spanning nearly four decades, in inconsistent formats. Three sources now feed one model, so every number on the site is <strong>derived</strong>, never typed in:</p>
<ul>
  <li><strong>The archive</strong>: a cleaned player-season table of every senior Saturday season since 1989/90 (runs, wickets, averages, hundreds, five-fors) for 800+ players.</li>
  <li><strong>Scorecards</strong>: 1,100+ Play Cricket scorecards since 2009/10, which power single-game records (highest scores, best bowling, partnerships, fastest fifties), match-by-match deep dives for each player, and an “On this day” feed.</li>
  <li><strong>Live data</strong>: from 2026/27 the senior XIs’ figures come straight from Play Cricket, refreshed hourly. A name map links Play Cricket IDs to archive names where they differ, and a row in the archive can correct a live figure.</li>
</ul>
<p>Adding a season means nothing at all: the leaderboards, profiles and records follow the games.</p>

<h2>More than a stats site</h2>
<ul>
  <li><strong>Match centre</strong> for every game: scorecards, ball-by-ball, highlight clips, graphs, weather and line-ups.</li>
  <li><strong>Admin portal</strong> with invite-only roles: news and match reports, branded emails to the club’s mailing list (including imports from PlayHQ registration exports), an events calendar, and a tool that cuts highlight videos from a match’s clips.</li>
  <li><strong>Clubroom TV</strong>: a full-screen slideshow for the TV in the clubrooms, with live scores, results, season leaders, milestones and sponsors.</li>
</ul>

<h2>Built with Claude Code</h2>
<p>I built the whole site with Claude Code as my primary development tool, as a solo volunteer project: about 520 commits since March 2026, from first design to a production site on Netlify, with architecture decision records and documentation for whoever looks after it next. The data work, not the boilerplate, got the attention.</p>
""",
    },
    "melbourne-pedestrian-counting": {
        "description": "Interactive Power BI dashboard by Cooper Denny analysing hourly pedestrian counts from about 100 City of Melbourne sensors since 2010.",
        "kicker": "Time series · BI · Open data",
        "lede": "An interactive Power BI dashboard over the City of Melbourne’s pedestrian sensor network (hourly counts from about 100 locations, January 2010 to October 2024), built to show how foot traffic shifts by hour, weekday and year.",
        "stack": ["Python", "Jupyter", "Power BI", "DAX"],
        "actions": [
            {"label": "Open dashboard full screen", "href": "https://app.powerbi.com/view?r=eyJrIjoiMTdlMDVjYTItODBmMC00ZWQxLWFhNmItYzQ3NzMxYzlmNzJmIiwidCI6ImI2YTFjNzYxLWMxN2YtNDg5OC04MGM5LTQ4YzNhZDg5MTE0ZSJ9&pageName=61de34a7e603f2eee3b6", "icon": "external"},
            {"label": "Python notebook on GitHub", "href": "https://github.com/CooperDenny/MelbournePedestrianCountingSystem", "icon": "external"},
        ],
        "glance": {
            "question": "When and where is Melbourne’s CBD busiest, and how has that pattern changed over the years?",
            "did": [
                "Wrote a Python notebook that builds the URL for every yearly and monthly file, downloads and cleans almost 15 years of data, checks for missing dates, and reshapes it into one long table of hourly counts per sensor.",
                "Built DAX measures for 4-week and 52-week rolling averages to separate trend from weekly noise.",
                "Geocoded every sensor by hand from Google Maps so the dashboard can map them, with slicers for sensor, day of week, weekday/weekend and year.",
            ],
            "metrics": [("~100", "Sensors across the city"), ("Hourly", "Count granularity"), ("2010–24", "January 2010 to October 2024"), ("4 &amp; 52 wk", "Rolling averages")],
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
<p>The data is the City of Melbourne’s <a href="https://pedestrian.melbourne.vic.gov.au" target="_blank" rel="noopener noreferrer">Pedestrian Counting System</a>: hourly counts from sensors across the CBD, from January 2010 to October 2024.</p>
<ul>
  <li><strong>Python (pandas)</strong>: the City publishes one file per year to 2012 and one per month after that, so the notebook constructs each URL, downloads and cleans every file, checks for missing dates, combines date and hour into a timestamp, and melts the wide sensor columns into one long table. The <a href="https://github.com/CooperDenny/MelbournePedestrianCountingSystem" target="_blank" rel="noopener noreferrer">Jupyter notebook is on GitHub</a>.</li>
  <li><strong>DAX measures</strong> add 4-week and 52-week rolling averages, so seasonal swings and long-term shifts are visible at a glance.</li>
  <li><strong>Geospatial</strong>: the source has no coordinates, so I located each sensor in Google Maps and joined latitude and longitude onto the table. They drive the map, and a slicer isolates any one of the ~100 sensors.</li>
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
    "afl-brownlow-2025": {
        "description": "Year three of Cooper Denny’s AFL Brownlow Medal model: trained on 2015–2024 and tested on the unseen 2025 season, with its best 3-vote hit rate yet (59% of games) and top pick Nick Daicos finishing runner-up.",
        "kicker": "Statistical modelling · AFL",
        "lede": "The third season of my Brownlow model, retrained on 2015–2024 and scored on the unseen 2025 season. It found the 3-vote player in <strong>59% of games, its best hit rate yet</strong>, and its top pick, Nick Daicos, finished runner-up.",
        "meta": "Trained on 2015–2024 · Tested on 2025 · Written in R",
        "stack": ["R", "ordinal (CLM)", "tidyverse", "caret", "DT"],
        "actions": [
            {"label": "Code and data on GitHub", "href": "https://github.com/CooperDenny/AFLBrownlowPredictor/tree/main/2025", "icon": "external"},
            {"label": "See the 2024 model", "href": "/projects/afl-brownlow-2024/", "icon": "arrowRight"},
        ],
        "glance": {
            "question": "Does the 2024 model, position variable and all, hold up when it’s retrained on one more season and pointed at a new year?",
            "did": [
                "Extended the player-game dataset to 2025 with my <a href=\"https://github.com/CooperDenny/AFLPlayerStats\" target=\"_blank\" rel=\"noopener noreferrer\">AFLPlayerStats</a> pipeline, which refreshes player, team and coaches-vote data from fitzRoy, afl.com.au, AFL Tables and the AFLCA each week.",
                "Retrained the same ordinal logistic regression (cumulative link model) on 2015–2024, with numeric features standardised on the training seasons only.",
                "Scored every 2025 home-and-away game, allocated 3-2-1 within each game, and compared the season leaderboard with the count.",
            ],
            "outcome": "Daicos topped the predicted leaderboard on 36 votes and polled 32 for second. Winner Matt Rowell (39) was predicted sixth on 25: his pressure and contested work shows up less in the box score, which points to the next feature to add.",
            "metrics": [
                ("r = 0.885", "Predicted vs actual season tallies"),
                ("2.23", "Mean absolute error, votes per player"),
                ("59%", "Games where it found the 3-vote player (120 of 205)"),
                ("2nd", "Where its top pick, Daicos, finished"),
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
    "afl-brownlow-2024": {
        "description": "Cooper Denny’s ordinal logistic regression for AFL Brownlow Medal votes, tested on the unseen 2024 season: r = 0.93 on season tallies, Cripps and Daicos called as the top two.",
        "kicker": "Statistical modelling · AFL",
        "lede": "An ordinal logistic regression that predicts every player’s 3-2-1 umpire votes, game by game. Trained on 2015–2023 and scored on the unseen 2024 season, it named <strong>Patrick Cripps and Nick Daicos as the top two, in order</strong>, and had Cripps breaking the all-time vote record.",
        "meta": "Trained on 2015–2023 · Tested on 2024 · Written in R",
        "stack": ["R", "ordinal (CLM)", "tidyverse", "DT", "Feature engineering"],
        "actions": [
            {"label": "Download the dataset (CSV)", "href": "brownlow_data_2024.csv", "icon": "download", "download": True},
            {"label": "See the 2025 model", "href": "/projects/afl-brownlow-2025/", "icon": "arrowRight"},
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
