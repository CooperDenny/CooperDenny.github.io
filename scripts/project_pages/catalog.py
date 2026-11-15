"""The canonical, ordered list of project pages (content/projects.json)."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class CatalogEntry:
    """One project page: its URL slug, title, and the teaser shown in the previous page's Next card."""

    slug: str
    title: str
    teaser: str

    @property
    def href(self) -> str:
        """Site-relative URL, e.g. '/projects/afl-brownlow-2024/'."""
        return f"/projects/{self.slug}/"


class Catalog:
    """The ordered list of project pages from content/projects.json (order = Next-project chain)."""

    def __init__(self, entries: list[CatalogEntry]):
        self._entries = entries
        self._index = {e.slug: i for i, e in enumerate(entries)}

    @classmethod
    def load(cls, path: Path) -> "Catalog":
        """Read the catalog JSON."""
        pages = json.loads(path.read_text(encoding="utf-8"))["pages"]
        return cls([CatalogEntry(p["slug"], p["title"], p["teaser"]) for p in pages])

    @property
    def slugs(self) -> list[str]:
        """All page slugs, in catalog order."""
        return [e.slug for e in self._entries]

    def get(self, slug: str) -> CatalogEntry:
        """The entry for `slug`; raises KeyError naming the file if it isn't registered."""
        try:
            return self._entries[self._index[slug]]
        except KeyError:
            raise KeyError(f"'{slug}' is not in content/projects.json") from None

    def next_after(self, slug: str) -> CatalogEntry:
        """The page shown in the "Next project" card (wraps around)."""
        return self._entries[(self._index[slug] + 1) % len(self._entries)]
