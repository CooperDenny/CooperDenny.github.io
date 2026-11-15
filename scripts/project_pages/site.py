"""Composition root: the one place that knows which pages exist and how they're wired."""

from __future__ import annotations

from .catalog import Catalog
from .content import HAND_PAGES, REPORT_PAGES
from .extensions import ArbitrageFacts, ReportExtension
from .icons import IconSet
from .model import PageCopy
from .pages import HandPage, ProjectPage, ReportPage
from .render import Renderer
from .settings import CONTENT_DIR, PROJECTS_DIR, Settings

# Page-specific behaviour, plugged in by slug. Add an extension here, not an `if` in ReportPage.
EXTENSIONS: dict[str, ReportExtension] = {
    "h2h-arbitrage-finder": ArbitrageFacts(),
}


def build_pages() -> list[ProjectPage]:
    """Create one page object per catalog entry, wired with the shared renderer and any extension.

    Raises ValueError if content/projects.json lists a page that has no copy.
    """
    catalog = Catalog.load(CONTENT_DIR / "projects.json")
    renderer = Renderer(Settings.load(), catalog, IconSet.load(CONTENT_DIR / "icons.json"))
    copy = lambda slug, d: PageCopy.from_dict(slug, d, catalog)  # noqa: E731

    pages: list[ProjectPage] = [HandPage(copy(s, d), renderer, PROJECTS_DIR) for s, d in HAND_PAGES.items()]
    pages += [ReportPage(copy(s, d), renderer, PROJECTS_DIR, EXTENSIONS.get(s)) for s, d in REPORT_PAGES.items()]

    missing = set(catalog.slugs) - {p.slug for p in pages}
    if missing:
        raise ValueError(f"in content/projects.json but no page copy: {sorted(missing)}")
    return pages
