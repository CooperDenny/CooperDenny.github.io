"""The canonical, ordered list of project pages (content/projects.json)."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class CatalogEntry:
    slug: str
    title: str
    teaser: str

    @property
    def href(self) -> str:
        return f"/projects/{self.slug}/"


class Catalog:
    def __init__(self, entries: list[CatalogEntry]):
        self._entries = entries
        self._index = {e.slug: i for i, e in enumerate(entries)}

    @classmethod
    def load(cls, path: Path) -> "Catalog":
        pages = json.loads(path.read_text(encoding="utf-8"))["pages"]
        return cls([CatalogEntry(p["slug"], p["title"], p["teaser"]) for p in pages])

    @property
    def slugs(self) -> list[str]:
        return [e.slug for e in self._entries]

    def get(self, slug: str) -> CatalogEntry:
        try:
            return self._entries[self._index[slug]]
        except KeyError:
            raise KeyError(f"'{slug}' is not in content/projects.json") from None

    def next_after(self, slug: str) -> CatalogEntry:
        """The page shown in the "Next project" card (wraps around)."""
        return self._entries[(self._index[slug] + 1) % len(self._entries)]
