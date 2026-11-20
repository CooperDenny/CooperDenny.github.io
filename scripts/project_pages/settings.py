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
    """Who the site is about (content/identity.json)."""

    name: str
    role: str
    location: str


@dataclass(frozen=True)
class Settings:
    """Site-wide constants, loaded from the same files the Next.js app reads."""

    url: str
    ga_id: str
    fonts_href: str
    theme_color: str
    identity: Identity

    @classmethod
    def load(cls, root: Path = ROOT) -> "Settings":
        """Read config/site.json, content/identity.json and public/tokens.css (--band)."""
        site = json.loads((root / "config" / "site.json").read_text(encoding="utf-8"))
        who = json.loads((root / "content" / "identity.json").read_text(encoding="utf-8"))
        return cls(
            url=site["url"],
            ga_id=site["gaId"],
            fonts_href=site["fontsHref"],
            theme_color=_design_token(root / "public" / "tokens.css", "band"),
            identity=Identity(who["name"], who["role"], who["location"]),
        )


def _design_token(tokens_css: Path, name: str) -> str:
    """A design token from the plain `:root { … }` block of tokens.css."""
    defaults = re.search(r"^:root\s*\{([^}]*)\}", tokens_css.read_text(encoding="utf-8"), flags=re.M)
    match = re.search(rf"--{name}:\s*([^;]+);", defaults.group(1) if defaults else "")
    if not match:
        raise ValueError(f"design token --{name} not found in {tokens_css}")
    return match.group(1).strip()
