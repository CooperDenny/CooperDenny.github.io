"""The shared chrome of every project page, as HTML fragments. Pure: copy in, HTML out."""

from __future__ import annotations

import html
import re
from typing import Callable, Optional

from .catalog import Catalog
from .icons import IconSet
from .model import BarChart, Gallery, Glance, PageCopy
from .settings import Settings

TOKENS_CSS, SITE_CSS, REPORT_CSS = "/tokens.css", "../site.css", "../report.css"


class Renderer:
    """Renders the chrome shared by every project page. Methods are pure: copy in, HTML string out."""

    def __init__(self, settings: Settings, catalog: Catalog, icons: IconSet):
        self.settings, self.catalog, self.icons = settings, catalog, icons
        self.icon = icons.svg

    # --- document-level pieces ----------------------------------------------------

    def page_title(self, copy: PageCopy) -> str:
        """'<Page title> — <Name>' for <title> and Open Graph."""
        return f"{copy.title} — {self.settings.identity.name}"

    def head_meta(self, copy: PageCopy) -> str:
        """Description, theme colour, canonical URL, favicon and Open Graph tags."""
        s = self.settings
        url = f"{s.url}/projects/{copy.slug}/"
        desc = html.escape(copy.description, quote=True)
        title = html.escape(self.page_title(copy), quote=True)
        return f"""<meta name="description" content="{desc}">
<meta name="theme-color" content="{s.theme_color}">
<meta name="color-scheme" content="dark">
<link rel="canonical" href="{url}">
<link rel="icon" href="/favicon.svg">
<meta property="og:type" content="article">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{s.url}/images/hero-image.png">"""

    def fonts(self) -> str:
        """Google Fonts preconnects and stylesheet (URL from config/site.json)."""
        return (
            '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
            f'<link href="{self.settings.fonts_href}" rel="stylesheet">'
        )

    def analytics(self) -> str:
        """Google Analytics (gtag.js) snippet."""
        ga = self.settings.ga_id
        return (
            f'<script async src="https://www.googletagmanager.com/gtag/js?id={ga}"></script>\n'
            f"<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}"
            f"gtag('js',new Date());gtag('config','{ga}');</script>"
        )

    @staticmethod
    def stylesheets(*hrefs: str) -> str:
        """<link rel=stylesheet> tags, in the order given."""
        return "\n".join(f'<link rel="stylesheet" href="{h}">' for h in hrefs)

    # --- body chrome --------------------------------------------------------------

    def nav(self) -> str:
        """Skip link and top bar: brand, back to Projects, CV."""
        return f"""<a href="#cd-main" class="cd-skip">Skip to content</a>
<nav class="cd-nav" aria-label="Primary">
  <div class="cd-nav__inner">
    <a href="/" class="cd-nav__brand">{self.settings.identity.name}</a>
    <a href="/#projects" class="cd-nav__link" aria-label="All projects">{self.icon('arrowLeft')} <span class="cd-nav__label">Projects</span></a>
    <a href="/cv/" class="cd-btn cd-btn--primary cd-btn--small">CV</a>
  </div>
</nav>"""

    def hero(self, copy: PageCopy) -> str:
        """Project header: kicker, title, lede, meta line, tool chips, action buttons."""
        meta = f'<p class="cd-hero__meta">{copy.meta}</p>' if copy.meta else ""
        return f"""<header class="cd-hero">
  <div class="cd-wrap">
    <p class="cd-kicker">{copy.kicker}</p>
    <h1>{copy.title}</h1>
    <p class="cd-hero__lede">{copy.lede}</p>
    {meta}
    <ul class="cd-chips" aria-label="Tools used">{self._items(copy.stack)}</ul>
    <div class="cd-hero__actions">{self._actions(copy)}</div>
  </div>
</header>"""

    def summary(self, copy: PageCopy) -> str:
        """The "At a glance" panel followed by the "On this page" jump links."""
        return f"{self._glance(copy.glance)}\n{self._toc(copy)}"

    SLOT = re.compile(r"<!-- cd:(chart|gallery):([\w-]+) -->")
    # Widest a grid thumbnail may be: 2x its largest display width in the 860px reading column (D04).
    THUMB_MAX = {1: 1656, 2: 820, 3: 540}

    def article(self, copy: PageCopy, size_of: Callable[[str], Optional[tuple[int, int]]]) -> str:
        """A hand page's body, with each `<!-- cd:chart:<id> -->` / `<!-- cd:gallery:<id> -->` slot filled in.

        `size_of(relative path)` returns an image's (width, height) next to the page, or None if it's missing.
        Raises ValueError if a slot names nothing the copy defines, a chart or gallery is never placed,
        a thumbnail is missing, or a thumbnail is wider than its grid allows.
        """
        defined = {"chart": copy.charts, "gallery": copy.galleries}
        used = {(kind, key) for kind, key in self.SLOT.findall(copy.body)}
        for kind, items in defined.items():
            ids = {key for k, key in used if k == kind}
            unknown, unused = ids - items.keys(), items.keys() - ids
            if unknown or unused:
                plural = {"chart": "charts", "gallery": "galleries"}[kind]
                raise ValueError(f"{copy.slug}: {kind} slots without a {kind} {sorted(unknown)}, {plural} without a slot {sorted(unused)}")

        def fill(m: "re.Match[str]") -> str:
            kind, key = m.group(1), m.group(2)
            if kind == "chart":
                return self.bar_chart(key, copy.charts[key])
            return self.gallery(copy.slug, key, copy.galleries[key], size_of)

        return self.SLOT.sub(fill, copy.body.strip())

    def gallery(self, slug: str, gallery_id: str, g: Gallery, size_of: Callable[[str], Optional[tuple[int, int]]]) -> str:
        """A titled screenshot grid. Each thumbnail links to its full-size copy when one exists."""
        limit = self.THUMB_MAX[g.columns]
        figures = []
        for s in g.shots:
            thumb, full = f"{g.folder}/{s.name}.webp", f"{g.folder}/full/{s.name}.webp"
            size = size_of(thumb)
            if size is None:
                raise ValueError(f"{slug}: gallery '{gallery_id}' needs {thumb}")
            if size[0] > limit:
                raise ValueError(f"{slug}: {thumb} is {size[0]}px wide; a {g.columns}-column gallery allows {limit}px")
            alt = html.escape(s.alt, quote=True)
            img = f'<img src="{thumb}" width="{size[0]}" height="{size[1]}" loading="lazy" decoding="async" alt="{alt}">'
            if size_of(full):
                img = f'<a class="cd-figure__zoom" href="{full}" aria-label="Full-size image: {alt}">{img}</a>'
            figures.append(f'<figure class="cd-figure">{img}<figcaption>{s.caption}</figcaption></figure>')
        title_id = f"cd-gallery-{gallery_id}"
        return f"""<section class="cd-tour" aria-labelledby="{title_id}">
  <h3 id="{title_id}">{g.title}</h3>
  <p>{g.intro}</p>
  <div class="cd-gallery cd-gallery--{g.columns}">
    {"".join(figures)}
  </div>
</section>"""

    @staticmethod
    def bar_chart(chart_id: str, chart: BarChart) -> str:
        """A single-series bar chart as an ordered list: every value is visible text, bars scale to the max."""
        top = max(b.value for b in chart.bars) or 1
        fmt = lambda v: f"{v:,.0f}" if float(v).is_integer() else f"{v:,}"  # noqa: E731
        bars = "".join(
            f'<li class="cd-chart__bar" style="--v:{b.value / top:.3f}">'
            f'<span class="cd-chart__value">{fmt(b.value)}<span class="cd-sr"> {chart.unit}</span></span>'
            f'<span class="cd-chart__fill" aria-hidden="true"></span>'
            f'<span class="cd-chart__label">{b.label}</span></li>'
            for b in chart.bars
        )
        title_id = f"cd-chart-{chart_id}"
        return f"""<figure class="cd-chart" aria-labelledby="{title_id}">
  <p class="cd-chart__title" id="{title_id}">{chart.title}</p>
  <ol class="cd-chart__bars" style="--n:{len(chart.bars)}">{bars}</ol>
  <figcaption>{chart.caption}</figcaption>
</figure>"""

    def next_project(self, slug: str) -> str:
        """Next-project card (catalog order, wrapping), All projects / CV buttons, and footer."""
        nxt, who = self.catalog.next_after(slug), self.settings.identity
        return f"""<aside class="cd-next" aria-label="More work">
  <div class="cd-wrap">
    <p class="cd-next__label">Next project</p>
    <a class="cd-next__card" href="{nxt.href}">
      <span class="cd-next__title">{nxt.title} {self.icon('arrowRight')}</span>
      <p class="cd-next__desc">{nxt.teaser}</p>
    </a>
    <div class="cd-next__actions">
      <a href="/#projects" class="cd-btn cd-btn--ghost">{self.icon('arrowLeft')} All projects</a>
      <a href="/cv/" class="cd-btn cd-btn--primary">{self.icon('fileLines')} View CV</a>
    </div>
  </div>
</aside>
<footer class="cd-footer"><div class="cd-wrap"><p>© {who.name} · {who.role} · {who.location}</p></div></footer>"""

    # --- private building blocks ---------------------------------------------------

    @staticmethod
    def _items(items) -> str:
        return "".join(f"<li>{i}</li>" for i in items)

    def _actions(self, copy: PageCopy) -> str:
        def one(i: int, a) -> str:
            variant = "primary" if i == 0 else "ghost"
            attrs = (' target="_blank" rel="noopener noreferrer"' if a.external else "") + (" download" if a.download else "")
            return f'<a href="{a.href}" class="cd-btn cd-btn--{variant}"{attrs}>{self.icon(a.icon)} {a.label}</a>'
        return "".join(one(i, a) for i, a in enumerate(copy.actions))

    def _glance(self, g: Glance) -> str:
        outcome = f'<div><h3>Outcome</h3><p>{g.outcome}</p></div>' if g.outcome else ""
        note = f'<p class="cd-glance__note">{g.note}</p>' if g.note else ""
        return f"""<section class="cd-glance" aria-labelledby="cd-glance-title">
  <h2 id="cd-glance-title">At a glance</h2>
  <div class="cd-glance__grid">
    <div><h3>The question</h3><p>{g.question}</p></div>
    <div><h3>What I did</h3><ul>{self._items(g.did)}</ul></div>
    {outcome}
  </div>
  {self._metrics(g)}
  {note}
</section>"""

    @staticmethod
    def _metrics(g: Glance) -> str:
        if not g.metrics:
            return ""
        cls = " cd-metrics--3" if len(g.metrics) == 3 else ""
        tiles = "".join(f'<div class="cd-metric"><dt>{m.label}</dt><dd>{m.value}</dd></div>' for m in g.metrics)
        return f'<dl class="cd-metrics{cls}">{tiles}</dl>'

    @staticmethod
    def _toc(copy: PageCopy) -> str:
        if not copy.toc:
            return ""
        key_class = ' class="cd-toc__key"'
        links = "".join(f'<li><a href="#{t.anchor}"{key_class if t.key else ""}>{t.label}</a></li>' for t in copy.toc)
        return f'<nav class="cd-toc" aria-label="On this page"><h2>On this page</h2><ol>{links}</ol></nav>'
