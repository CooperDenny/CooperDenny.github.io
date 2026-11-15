"""Inline SVG icons from content/icons.json (shared with components/ui/Icon.tsx)."""

from __future__ import annotations

import json
from pathlib import Path


class IconSet:
    def __init__(self, icons: dict[str, list[str]]):
        self._icons = icons

    @classmethod
    def load(cls, path: Path) -> "IconSet":
        return cls(json.loads(path.read_text(encoding="utf-8"))["icons"])

    def svg(self, name: str) -> str:
        view_box, d = self._icons[name]
        return (
            f'<svg class="cd-icon" viewBox="{view_box}" aria-hidden="true" focusable="false">'
            f'<path fill="currentColor" d="{d}"/></svg>'
        )
