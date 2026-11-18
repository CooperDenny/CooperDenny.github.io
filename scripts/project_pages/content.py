"""Project-page copy — data only.

HAND_PAGES are generated in full; REPORT_PAGES only get the shared header/summary
injected above their knitr body. Titles come from content/projects.json (the catalog)
when a page omits "title". Whether an action opens in a new tab is derived from its URL.
Rule: every claim must be traceable to the project itself. No invented metrics.
"""

from __future__ import annotations

HAND_PAGES: dict[str, dict] = {
    "eildon-park-cricket-club": {
        "description": "How Cooper Denny designed, built and still runs epcc.org.au: a production Next.js and Supabase platform for Eildon Park Cricket Club, with 37 seasons of stats, live Play Cricket data, an admin portal, an email platform, an in-browser video editor, a clubroom TV and an MCP server for AI assistants. 531 commits and 131 pull requests in its first eight months.",
        "kicker": "Data engineering · Full-stack · Cricket",
        "lede": "I designed, built and still run <a href=\"https://epcc.org.au\" target=\"_blank\" rel=\"noopener noreferrer\">epcc.org.au</a>, Eildon Park Cricket Club’s website. It began as a stats page and is now the club’s platform: <strong>every senior season since 1989/90 joined to live Play Cricket data</strong>, an admin portal the committee runs the club from, an email platform, an in-browser highlights editor, a clubroom TV and an MCP server for AI assistants. 531 commits and 131 merged pull requests in its first eight months, from March to November 2026.",
        "meta": "Since March 2026 · Solo, built with Claude Code",
        "stack": ["Next.js 14", "TypeScript", "Supabase (Postgres, RLS)", "Play Cricket API", "Amazon SES", "WebCodecs", "MCP", "Claude Code", "Netlify"],
        "actions": [
            {"label": "Visit epcc.org.au", "href": "https://epcc.org.au", "icon": "external"},
            {"label": "Open the player stats", "href": "https://epcc.org.au/stats", "icon": "external"},
        ],
        "glance": {
            "question": "Can one volunteer give a community cricket club a website it owns, with decades of accurate records, live match data and the tools to run the club, and keep it improving every week without it falling over?",
            "did": [
                "Cleaned 36 seasons of club records into one player-season dataset and joined it to 1,100+ archived Play Cricket scorecards, with live figures from 2026/27, so every number on the site is derived, never typed in.",
                "Built the whole platform with Claude Code, by November 2026: 21 public pages, a 20-screen invite-only admin portal, 8 Postgres tables behind 19 row-level security policies, and integrations with Play Cricket, Amazon SES and Open-Meteo.",
                "Ran it like a product: every change through a pull request, architecture decision records for every load-bearing choice, and a rulebook (<code>CLAUDE.md</code>) that turns each outage or near miss into a rule.",
            ],
            "outcome": "The club’s front door, mailing list, match centre, video desk and clubroom screen in one system, with <strong>no manual upkeep</strong> for stats: 800+ players, 320,000+ runs and 15,000+ wickets that recalculate themselves as games are played.",
            "metrics": [("800+", "Players with a page, since 1989/90"), ("1,100+", "Play Cricket scorecards archived"), ("131", "Pull requests merged in the first 8 months"), ("8", "Read-only MCP tools for AI assistants, at launch")],
            "note": "Build figures (commits, pull requests, pages, tables) are from the first eight months, to November 2026. Player, scorecard, run and wicket counts are minimums: the live site’s totals only grow.",
        },
        "toc": [
            ("The brief", "brief", False),
            ("What’s on it", "tour", False),
            ("Architecture", "architecture", False),
            ("The data", "data", False),
            ("Decisions", "decisions", False),
            ("Hard problems", "problems", True),
            ("How I build it", "workflow", False),
            ("Still iterating", "iterating", False),
        ],
        "charts": {
            "commits": {
                "title": "Commits to the site’s main branch, by month (2026)",
                "caption": "531 commits from 22 March to 16 November 2026, merge commits included. The peaks are the Play Cricket integration and email platform (July–August) and the highlights editor, live stats and clubroom TV (October). November is a part month.",
                "unit": "commits",
                "bars": [("Mar", 65), ("Apr", 15), ("May", 40), ("Jun", 13), ("Jul", 143), ("Aug", 109), ("Sep", 20), ("Oct", 90), ("Nov", 36)],
            },
        },
        "body": """
<h2 id="brief">The brief</h2>
<p>Eildon Park is a community club in Rowville, in Melbourne’s south-east, with senior, veteran, junior and women’s teams. In early 2026 its online presence was Facebook, Instagram and a dormant Team App page. Nobody searching for a club to join would find it, sponsors had nothing to be shown on, and match reports disappeared down a feed within a week.</p>
<p>I made the case to the committee for a site the club owns, not a page on a platform, and built a working prototype in the first ten days (65 commits). The alternatives on the table were a site builder at $360–$420 a year, or $2,000+ up front for an agency site that would cost more every time it changed. The plan instead was free hosting (GitHub and Netlify), with the domain the only fixed cost. And the goal was never just a website: it was one place for the club’s history, its weekly cricket and its communications, documented well enough that it doesn’t depend on me.</p>

<h2 id="tour">What’s on it</h2>
<div class="cd-gallery">
  <figure class="cd-figure">
    <img src="player-profile.webp" width="1600" height="950" loading="lazy" alt="Player page for Cooper Denny: 108 games, 1,433 runs, 117 wickets, all-time club ranks, and tabs for batting, bowling, fielding, teammates, matches and seasons">
    <figcaption>A player page (mine): career figures, all-time club ranks, and tabs for batting, bowling, fielding, teammates, matches and seasons. Every player has one.</figcaption>
  </figure>
  <figure class="cd-figure">
    <img src="phone-views.webp" width="1600" height="1125" loading="lazy" alt="Three phone screenshots of epcc.org.au: the homepage with a Register to play button, a match centre showing Eildon Park 2nd XI 6/124 beating FTG Footballers 122, and the stats hub showing 818 players, 320,731 runs and 15,631 wickets over 37 seasons">
    <figcaption>Built for the phone first: homepage, a match centre, and the stats hub (818 players, 320,731 runs, 15,631 wickets).</figcaption>
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
  <figure class="cd-figure">
    <img src="clubroom-tv.webp" width="1600" height="902" loading="lazy" alt="Four slides from the clubroom TV: a 1st XI round-up with scorecard and ladder, upcoming senior games, the latest results for every team, and a 7-day forecast with game days marked">
    <figcaption>The clubroom TV at <code>/tv</code>: a self-refreshing slideshow of live scores, round-ups, ladders, results, forecasts, milestones and sponsors, on the TV in the clubrooms.</figcaption>
  </figure>
</div>
<ul>
  <li><strong>Stats hub</strong>: club totals, record holders, an explorer of every career and season, and a page per player with match-by-match deep dives (every innings and spell, worms, dismissals, partnerships, teammates, milestones).</li>
  <li><strong>Match centre</strong> for every game: scorecard, ball-by-ball, highlight clips, graphs, weather, line-ups and the match report.</li>
  <li><strong>Admin portal</strong>, invite-only with three roles: news with scheduled publishing, match reports, the events calendar, player profiles, and a mailing list with segments and PlayHQ registration imports.</li>
  <li><strong>Email platform</strong> on Amazon SES: branded News and Flyer templates, segment-targeted and scheduled sends, inbox previews, self-service unsubscribe, sent history.</li>
  <li><strong>Highlights editor</strong>: cuts branded highlights videos from a match’s Play Cricket clips, in landscape or as a 9:16 reel for TikTok and Instagram, and renders the MP4 <strong>entirely in the browser</strong>.</li>
  <li><strong>Built for AI search</strong>: one schema.org entity across every page, <code>/llms.txt</code> rebuilt every 30 minutes with live fixtures and results, and a public MCP server, so Claude or ChatGPT can answer questions about the club with live data.</li>
</ul>

<h2 id="architecture">Architecture</h2>
<p>One Next.js app on Netlify, serving cached public pages, the admin portal and a few API routes, in front of Supabase and four outside services. The rule that makes it hold together: <strong>only <code>lib/</code> talks to the outside world</strong>, and pages and components never do.</p>
<div class="cd-arch" role="group" aria-label="System map">
  <section class="cd-arch__lane">
    <h3>Who uses it</h3>
    <ul class="cd-arch__nodes">
      <li><strong>Visitors</strong> Players, parents, sponsors, recruits</li>
      <li><strong>Committee</strong> Admins in the portal</li>
      <li><strong>Clubroom TV</strong> A browser on the wall</li>
      <li><strong>AI assistants</strong> Claude, ChatGPT via MCP</li>
    </ul>
  </section>
  <section class="cd-arch__lane cd-arch__lane--core">
    <h3>Netlify · Next.js 14</h3>
    <ul class="cd-arch__nodes">
      <li><strong>CDN cache</strong> Public pages are static (ISR) and refresh in the background, every 5 min to hourly</li>
      <li><strong>Server Actions</strong> Every write, one module per domain, each checking the admin first</li>
      <li><strong>API routes</strong> Search, uploads, stats rows, <code>/api/mcp</code></li>
      <li><strong>Scheduled function</strong> Every 10 min: resumes due email sends</li>
    </ul>
  </section>
  <section class="cd-arch__lane">
    <h3>Data &amp; services</h3>
    <ul class="cd-arch__nodes">
      <li><strong>Supabase</strong> Postgres, Auth, Storage; row-level security on every table</li>
      <li><strong>Play Cricket</strong> Unofficial API: fixtures, scorecards, ball-by-ball, clips</li>
      <li><strong>Stats archive</strong> 4,800 player-season rows since 1989/90, in the repo</li>
      <li><strong>Amazon SES · Open-Meteo</strong> Email; weather</li>
    </ul>
  </section>
</div>

<h2 id="data">The data</h2>
<p>The hard part wasn’t the website. It was the data. The club’s history came from records spanning nearly four decades, in inconsistent formats. Three sources now feed one model, so every number on the site is <strong>derived</strong>, never typed in:</p>
<ul>
  <li><strong>The archive</strong>: a cleaned player-season table of every senior Saturday season from 1989/90 to 2025/26 (4,800 rows: runs, wickets, averages, hundreds, five-fors). Names are normalised to one form per person, and overs are kept in cricket notation (<code>120.3</code> is 120 overs and 3 balls), not decimals.</li>
  <li><strong>Scorecards</strong>: 1,100+ Play Cricket scorecards since 2009/10, built into match-level archives that power single-game records (highest scores, best bowling, partnerships, fastest fifties), each player’s match-by-match tab, and an “On this day” feed of 1,600+ fifties, hundreds and four-wicket hauls.</li>
  <li><strong>Live data</strong>: from 2026/27 the senior XIs’ figures come straight from Play Cricket, refreshed hourly. A name map links Play Cricket IDs to archive names where they differ, and an archive row for a live season overrides Play Cricket’s figures, so a scoring error can be corrected without touching code.</li>
</ul>
<p>Adding a season takes no work at all: the leaderboards, profiles and records follow the games.</p>

<h2 id="decisions">Decisions that hold it up</h2>
<p>Each load-bearing choice is written down as an architecture decision record: the context that forced it, the decision, and what it costs. Six of them:</p>
<div class="cd-cards cd-cards--2">
  <div class="cd-card">
    <span class="cd-card__tag">ADR 0003 · Performance</span>
    <h3>Public pages are static</h3>
    <p><span class="cd-card__k">Why</span>The homepage once took 1.7–3.5 s to first byte, because one Supabase client read cookies, which silently makes a whole route render per request.</p>
    <p><span class="cd-card__k">Cost</span>Data can be up to one cache window old, so every write refreshes exactly the pages it changes.</p>
  </div>
  <div class="cd-card">
    <span class="cd-card__tag">ADR 0007 · Reliability</span>
    <h3>The unofficial API fails soft</h3>
    <p><span class="cd-card__k">Why</span>Play Cricket’s API is reverse-engineered, with no documentation or SLA, and endpoints that disagree on shape.</p>
    <p><span class="cd-card__k">Cost</span>In an outage a section renders empty, never a broken page. New fields are checked against live responses before they’re used.</p>
  </div>
  <div class="cd-card">
    <span class="cd-card__tag">ADR 0004 · Security</span>
    <h3>Invite-only, checked twice</h3>
    <p><span class="cd-card__k">Why</span>The site holds a mailing list of members’ and parents’ emails. A login only proves someone has an account.</p>
    <p><span class="cd-card__k">Cost</span>Every Server Action checks the admin’s role, and every database policy checks it again. Personal data has no public read path.</p>
  </div>
  <div class="cd-card">
    <span class="cd-card__tag">ADR 0006 · Email</span>
    <h3>Sends are resumable batches</h3>
    <p><span class="cd-card__k">Why</span>400+ recipients at SES’s 14 a second outlasts a serverless function. A killed send once left no record of who was missed.</p>
    <p><span class="cd-card__k">Cost</span>At most one batch of 60 can be duplicated if a process dies mid-batch.</p>
  </div>
  <div class="cd-card">
    <span class="cd-card__tag">ADR 0008 · Data</span>
    <h3>Archive plus live, one model</h3>
    <p><span class="cd-card__k">Why</span>Thirty-six seasons predate Play Cricket’s data, and Play Cricket’s own figures are sometimes wrong.</p>
    <p><span class="cd-card__k">Cost</span>Two sources to reconcile, by a name map and an explicit override rule rather than by hand.</p>
  </div>
  <div class="cd-card">
    <span class="cd-card__tag">ADR 0011 · AI</span>
    <h3>An MCP server, hand-written</h3>
    <p><span class="cd-card__k">Why</span>Assistants answer from whatever page they happen to fetch, which can’t answer “how many runs has X made?” for 800+ players.</p>
    <p><span class="cd-card__k">Cost</span>About 100 lines, no dependency, checked against the official SDK client. Read-only and public data only, so it needs no auth.</p>
  </div>
</div>

<h2 id="problems">Hard problems</h2>
<p>The bugs worth telling are the ones that changed how the system is built.</p>
<div class="cd-cards">
  <div class="cd-card">
    <span class="cd-card__tag">Security</span>
    <h3>Middleware doesn’t protect Server Actions</h3>
    <p>Next.js makes every export of a <code>'use server'</code> module callable from any page that imports one of them, so an admin-only write behind a protected route isn’t protected at all. I closed it by checking the admin at the top of every action and on uploads, split the actions into one module per domain, and made “every action starts with an auth check” the first rule in the rulebook, with row-level security in Postgres as the backstop.</p>
  </div>
  <div class="cd-card">
    <span class="cd-card__tag">In-browser video</span>
    <h3>A rendering bug only production could see</h3>
    <p>The highlights editor renders MP4s in the browser: hls.js streams each clip into a hidden video element, frames go through WebCodecs’ <code>VideoEncoder</code> into <code>mp4-muxer</code>, and the animated intros are rasterised through SVG <code>&lt;foreignObject&gt;</code>. On the live site, every intro frame failed with “The source image cannot be decoded”. The cause: production’s minified CSS writes font variables in double quotes, which cut an inline <code>style=""</code> attribute short. Development CSS uses single quotes, so it never showed up locally. Moving the declarations into a <code>&lt;style&gt;</code> block fixed it. The same feature also taught me that the muxer rejects every chunk unless the first frame sits at timestamp exactly zero.</p>
  </div>
  <div class="cd-card">
    <span class="cd-card__tag">Data</span>
    <h3>Dates that lie about their time zone</h3>
    <p>Older Play Cricket records store local Melbourne times labelled <code>+00:00</code>, and Netlify runs in UTC, so a naive conversion puts games on the wrong day. Play Cricket dates are now read exactly as written, club-side dates go through one Melbourne time-zone module, and the single-match endpoint, which isn’t shaped like the team list, has its quirks recorded where the next change will see them.</p>
  </div>
</div>

<h2 id="workflow">How I build it</h2>
<p>I’m the only person working on it, and Claude Code is my primary development tool: <strong>in the first eight months, 277 of 531 commits were written by Claude Code sessions</strong>, and none reach the live site without a pull request I review. My job is product owner, architect, reviewer and the person who knows the cricket data. The system that keeps that fast <em>and</em> safe is mostly writing:</p>
<ul>
  <li><strong>A rulebook, not a wiki.</strong> <code>CLAUDE.md</code> holds the non-negotiable rules, each one there because breaking it caused, or would cause, an outage, a security hole or silent data loss, and each linked to the doc that explains it.</li>
  <li><strong>Decisions on record.</strong> Architecture decision records (eleven by November 2026), so a later change can’t quietly undo what an earlier one was protecting.</li>
  <li><strong>Docs ship with the code.</strong> 40+ Markdown documents (architecture, features, runbooks, a design system, a security model), updated in the same pull request as the change they describe.</li>
  <li><strong>A definition of done.</strong> Lint, type-check and production build clean, the change tried in a browser at phone width, and a pull-request template that lists any manual steps outside the code.</li>
  <li><strong>Repeatable jobs as skills.</strong> A custom Claude Code skill writes a match report from a game’s Play Cricket scorecard, with season context from both teams’ earlier rounds, and publishes it to the database.</li>
  <li><strong>Cost discipline.</strong> Netlify build minutes are rationed, so documentation-only pushes skip the build, and player pages render on first visit rather than at build time.</li>
</ul>

<h2 id="iterating">Still iterating</h2>
<p>In the first eight months, something shipped in 29 of 35 weeks. The busy months line up with the cricket calendar: the platform work before the season, the match-day features once games started.</p>
<!-- cd:chart:commits -->
<ol class="cd-timeline">
  <li><span class="cd-timeline__when">March</span><h3>Prototype for the committee</h3><p>News, the first stats page, committee, sponsors, weather and a season countdown, in ten days.</p></li>
  <li><span class="cd-timeline__when">April – June</span><h3>Foundations</h3><p>SEO and analytics, a formal design system with tokens and primitives, governance documents, and the first <code>CLAUDE.md</code>.</p></li>
  <li><span class="cd-timeline__when">July – August</span><h3>Live cricket and the email platform</h3><p>Play Cricket integration (fixtures, ladders, scorecards, worm and Manhattan graphs, ball-by-ball, highlight clips), then subscriber imports, segments, scheduled sends, templates and unsubscribe.</p></li>
  <li><span class="cd-timeline__when">September – October</span><h3>The season starts</h3><p>The admin portal redesign, the highlights editor with in-browser MP4 export and reels, live player stats from Play Cricket, the redesigned stats hub, tiered sponsors and the clubroom TV.</p></li>
  <li><span class="cd-timeline__when">November</span><h3>Hardening and AI discoverability</h3><p>Admin actions split by domain, the documentation restructured around eleven ADRs, then <code>/llms.txt</code>, a club FAQ, one structured-data entity and the public MCP server.</p></li>
  <li class="cd-timeline__now"><span class="cd-timeline__when">Since</span><h3>The same loop</h3><p>Fixes and features through each season, every one through a pull request, and every lesson into the rulebook.</p></li>
</ol>
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
