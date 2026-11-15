"""Repo paths and site-wide constants, read from the same files the Next.js app uses."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONTENT_DIR = ROOT / "content"
PROJECTS_DIR = ROOT / "public" / "projects"


@dataclass(frozen=True)
class Identity:
    name: str
    role: str
    location: str


@dataclass(frozen=True)
class Settings:
    url: str
    ga_id: str
    fonts_href: str
    theme_color: str
    theme_script: str  # lib/theme.js, inlined in every page's <head>
    identity: Identity

    @classmethod
    def load(cls, root: Path = ROOT) -> "Settings":
        site = json.loads((root / "config" / "site.json").read_text(encoding="utf-8"))
        who = json.loads((root / "content" / "identity.json").read_text(encoding="utf-8"))
        return cls(
            url=site["url"],
            ga_id=site["gaId"],
            fonts_href=site["fontsHref"],
            theme_color=_design_token(root / "public" / "tokens.css", "bg"),
            theme_script=(root / "lib" / "theme.js").read_text(encoding="utf-8").strip(),
            identity=Identity(who["name"], who["role"], who["location"]),
        )


def _design_token(tokens_css: Path, name: str) -> str:
    match = re.search(rf"--{name}:\s*([^;]+);", tokens_css.read_text(encoding="utf-8"))
    if not match:
        raise ValueError(f"design token --{name} not found in {tokens_css}")
    return match.group(1).strip()
