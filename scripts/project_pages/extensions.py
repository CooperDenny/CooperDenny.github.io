"""Report extensions: page-specific behaviour plugged into ReportPage without editing it."""

from __future__ import annotations

import json
import re
from abc import ABC
from dataclasses import dataclass

from .model import Metric, PageCopy
from .transforms import RemoveUpdatedBullet, Transform

MONTHS = "January February March April May June July August September October November December".split()


class ReportExtension(ABC):
    """Hook points a report page can use. Defaults do nothing."""

    def enrich(self, copy: PageCopy, src: str) -> PageCopy:
        """Return the copy with anything computed from the report's own content."""
        return copy

    def transforms(self) -> list[Transform]:
        """Extra edits to run after the standard ones."""
        return []


# --- DataTables (htmlwidgets) embedded in knitr output -------------------------------

@dataclass(frozen=True)
class DataTable:
    """One DataTables widget's data, column-oriented (as htmlwidgets serialises it)."""

    heads: list[str]
    data: list[list]

    def has(self, *columns: str) -> bool:
        """True if the table has all of these columns."""
        return all(c in self.heads for c in columns)

    def column(self, name: str) -> list:
        """The values of one column."""
        return self.data[self.heads.index(name)]


def read_datatables(src: str) -> list[DataTable]:
    """Every DataTables widget embedded in a knitr page, in document order."""
    tables = []
    for m in re.finditer(r'<script type="application/json" data-for="[^"]+">(.*?)</script>', src, flags=re.S):
        x = json.loads(m.group(1))["x"]
        heads = [h.strip() for h in re.findall(r"<th>(.*?)</th>", x.get("container", ""))]
        tables.append(DataTable(heads, x.get("data", [])))
    return tables


# --- the arbitrage finder ------------------------------------------------------------

@dataclass(frozen=True)
class MarketScan:
    """Summary of one results table: one row per outcome, grouped into markets."""

    markets: int
    sports: int
    arbitrages: int
    best_return: float  # % guaranteed return of the best arbitrage
    top_odds: float  # highest decimal odds used in any arbitrage

    @classmethod
    def from_table(cls, t: DataTable) -> "MarketScan":
        """Group outcome rows into markets; a market whose combined book is under 100% is an arbitrage."""
        markets: dict[tuple, tuple[float, list[float]]] = {}
        for home, away, start, book, odds in zip(
            t.column("home_team"), t.column("away_team"), t.column("commence_time"), t.column("market"), t.column("converted_odds")
        ):
            markets.setdefault((home, away, start), (float(book), []))[1].append(float(odds))
        arbs = [m for m in markets.values() if m[0] < 100]
        return cls(
            markets=len(markets),
            sports=len(set(t.column("sport"))),
            arbitrages=len(arbs),
            best_return=max(((100 / book - 1) * 100 for book, _ in arbs), default=0.0),
            top_odds=max((o for _, odds in arbs for o in odds), default=0.0),
        )


class ArbitrageFacts(ReportExtension):
    """Headline metrics computed from the report's embedded result tables on every run,
    so a re-knit can never leave stale numbers in the summary."""

    SNAPSHOT = (r"Updated as of (\d{4})-(\d{2})-(\d{2})", r"cd:snapshot (\d{4})-(\d{2})-(\d{2})")

    def enrich(self, copy: PageCopy, src: str) -> PageCopy:
        h2h, back_lay = self._scans(src)
        return copy.with_results(meta=self._meta(src), metrics=self._metrics(h2h, back_lay), note=self._finding(h2h, back_lay))

    def transforms(self) -> list[Transform]:
        return [RemoveUpdatedBullet()]

    @staticmethod
    def _scans(src: str) -> tuple[MarketScan, MarketScan]:
        tables = [t for t in read_datatables(src) if t.has("market", "converted_odds")]
        if len(tables) < 2:
            raise ValueError("arbitrage report: expected the H2H and back/lay result tables — has the report changed?")
        return MarketScan.from_table(tables[0]), MarketScan.from_table(tables[1])

    @staticmethod
    def _metrics(h2h: MarketScan, back_lay: MarketScan) -> tuple[Metric, ...]:
        return (
            Metric(f"{h2h.markets:,}", f"Head-to-head markets scanned, {h2h.sports} sports"),
            Metric(str(h2h.arbitrages), "Head-to-head arbitrages found"),
            Metric(f"{h2h.best_return:.2f}%", "Best guaranteed return (head-to-head)"),
            Metric(str(back_lay.arbitrages), f"Back/lay opportunities (best {back_lay.best_return:.2f}%)"),
        )

    @staticmethod
    def _finding(h2h: MarketScan, back_lay: MarketScan) -> str:
        best = max(h2h.best_return, back_lay.best_return)
        longshot = max(h2h.top_odds, back_lay.top_odds)
        ceiling = "under 1%" if best < 1 else f"at most {best:.2f}%"
        note = f"<strong>The finding:</strong> genuine edges are rare and thin. Every opportunity in this snapshot returned {ceiling}"
        if longshot >= 20:
            return note + (
                f", and the biggest leaned on extreme long-shot prices (up to ${longshot:g}), which are the most likely "
                "to be stale or stake-limited. In practice this is a monitoring tool, not a money machine."
            )
        return note + ". In practice this is a monitoring tool, not a money machine."

    def _meta(self, src: str) -> str:
        """Snapshot date: from knitr's 'Updated as of' bullet (fresh knit) or our marker (re-run)."""
        date = next((m for p in self.SNAPSHOT if (m := re.search(p, src))), None)
        meta = "Snapshot: {} · 12 bookmakers incl. Betfair exchange · Written in R"
        if not date:
            return meta.format("latest run")
        y, mo, d = date.groups()
        return meta.format(f"{int(d)} {MONTHS[int(mo) - 1]} {y}") + f" <!-- cd:snapshot {y}-{mo}-{d} -->"
