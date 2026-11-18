"""Immutable page-copy model. Built from the plain dicts in content.py."""

from __future__ import annotations

import re
from dataclasses import dataclass, field, replace
from typing import Optional

from .catalog import Catalog


@dataclass(frozen=True)
class Action:
    """A header button on a project page. The first action is rendered as the primary button."""

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
    """A metric tile: a big `value` and the `label` under it."""

    value: str
    label: str


@dataclass(frozen=True)
class TocItem:
    """An "On this page" jump link; `key=True` highlights it (e.g. the results)."""

    label: str
    anchor: str
    key: bool = False


@dataclass(frozen=True)
class Bar:
    """One bar in a BarChart: a short category `label` (e.g. a month) and its `value`."""

    label: str
    value: float


@dataclass(frozen=True)
class BarChart:
    """A single-series bar chart placed in a hand page's body with `<!-- cd:chart:<id> -->`.

    Rendered as plain HTML (an ordered list), so it needs no JavaScript and every value is text.
    """

    title: str
    caption: str
    unit: str
    bars: tuple[Bar, ...]

    @classmethod
    def from_dict(cls, d: dict) -> "BarChart":
        """Build from a content.py chart dict: title, caption, unit and (label, value) bars."""
        return cls(d["title"], d["caption"], d["unit"], tuple(Bar(l, v) for l, v in d["bars"]))


@dataclass(frozen=True)
class Glance:
    """The "At a glance" panel: question, what I did, optional outcome, metrics and note."""

    question: str
    did: tuple[str, ...]
    outcome: Optional[str] = None
    metrics: tuple[Metric, ...] = ()
    note: Optional[str] = None


@dataclass(frozen=True)
class PageCopy:
    """Everything a project page says. Immutable; built from a content.py dict by from_dict()."""

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
    charts: dict[str, BarChart] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, slug: str, d: dict, catalog: Catalog) -> "PageCopy":
        """Build from a content.py entry. The title defaults to the catalog's (one source of truth)."""
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
            charts={k: BarChart.from_dict(v) for k, v in d.get("charts", {}).items()},
        )

    def with_results(self, *, meta: str, metrics: tuple[Metric, ...], note: str) -> "PageCopy":
        """Copy with computed results filled in (used by report extensions)."""
        return replace(self, meta=meta, glance=replace(self.glance, metrics=metrics, note=note))
