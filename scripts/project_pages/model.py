"""Immutable page-copy model. Built from the plain dicts in content.py."""

from __future__ import annotations

import re
from dataclasses import dataclass, field, replace
from typing import Optional

from .catalog import Catalog


@dataclass(frozen=True)
class Action:
    label: str
    href: str
    icon: str
    download: bool = False

    @property
    def external(self) -> bool:
        """Derived from the URL, exactly as lib/links.ts does on the Next.js side."""
        return bool(re.match(r"https?://", self.href))


@dataclass(frozen=True)
class Metric:
    value: str
    label: str


@dataclass(frozen=True)
class TocItem:
    label: str
    anchor: str
    key: bool = False


@dataclass(frozen=True)
class Glance:
    question: str
    did: tuple[str, ...]
    outcome: Optional[str] = None
    metrics: tuple[Metric, ...] = ()
    note: Optional[str] = None


@dataclass(frozen=True)
class PageCopy:
    slug: str
    title: str
    description: str
    kicker: str
    lede: str
    stack: tuple[str, ...]
    actions: tuple[Action, ...]
    glance: Glance
    meta: Optional[str] = None
    toc: tuple[TocItem, ...] = ()
    body: str = ""

    @classmethod
    def from_dict(cls, slug: str, d: dict, catalog: Catalog) -> "PageCopy":
        g = d["glance"]
        return cls(
            slug=slug,
            title=d.get("title") or catalog.get(slug).title,
            description=d["description"],
            kicker=d["kicker"],
            lede=d["lede"],
            meta=d.get("meta"),
            stack=tuple(d["stack"]),
            actions=tuple(Action(**a) for a in d["actions"]),
            glance=Glance(
                question=g["question"],
                did=tuple(g["did"]),
                outcome=g.get("outcome"),
                metrics=tuple(Metric(v, l) for v, l in g.get("metrics", ())),
                note=g.get("note"),
            ),
            toc=tuple(TocItem(*t) for t in d.get("toc", ())),
            body=d.get("body", ""),
        )

    def with_results(self, *, meta: str, metrics: tuple[Metric, ...], note: str) -> "PageCopy":
        """Copy with computed results filled in (used by report extensions)."""
        return replace(self, meta=meta, glance=replace(self.glance, metrics=metrics, note=note))
