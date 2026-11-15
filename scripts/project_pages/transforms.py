"""Small, single-purpose, idempotent HTML edits for knitr reports, and a Pipeline to run them.

Each Transform does one thing. ReportPage composes them; adding behaviour means adding a
Transform, not editing the pipeline runner (open/closed).
"""

from __future__ import annotations

import html
import re
from abc import ABC, abstractmethod
from typing import Callable, Iterable


class Transform(ABC):
    """One HTML edit. Implementations must be idempotent: applying twice equals applying once."""

    @abstractmethod
    def apply(self, src: str) -> str:
        """Return the edited HTML."""


class Pipeline:
    """Runs transforms in order."""

    def __init__(self, transforms: Iterable[Transform]):
        self._transforms = list(transforms)

    def run(self, src: str) -> str:
        """Apply every transform to `src`, in order."""
        for t in self._transforms:
            src = t.apply(src)
        return src


# --- marked blocks -----------------------------------------------------------------

class MarkedBlock:
    """A region delimited by <!-- cd:NAME --> … <!-- /cd:NAME -->, so it can be found and replaced on re-runs."""

    def __init__(self, name: str):
        self.start, self.end = f"<!-- cd:{name} -->", f"<!-- /cd:{name} -->"

    def wrap(self, inner: str) -> str:
        """`inner` between this block's start and end markers."""
        return f"{self.start}\n{inner}\n{self.end}"

    def replace_in(self, src: str, block_html: str) -> tuple[str, bool]:
        """Replace the marked region with `block_html`; returns (html, whether the markers were found)."""
        i, j = src.find(self.start), src.find(self.end)
        if i == -1 or j == -1:
            return src, False
        return src[:i] + block_html + src[j + len(self.end):], True


class UpsertBlock(Transform):
    """Replace a marked block if present; otherwise insert it with `insert_first_time`."""

    def __init__(self, block: MarkedBlock, block_html: str, insert_first_time: Callable[[str, str], str]):
        self.block, self.block_html, self.insert = block, block_html, insert_first_time

    def apply(self, src: str) -> str:
        src, replaced = self.block.replace_in(src, self.block_html)
        return src if replaced else self.insert(src, self.block_html)


def insert_before(anchor: str) -> Callable[[str, str], str]:
    """First-run insertion strategy: put the block just before the first `anchor`."""
    return lambda src, block: src.replace(anchor, block + "\n" + anchor, 1)


def insert_after(anchor: str) -> Callable[[str, str], str]:
    """First-run insertion strategy: put the block just after the first `anchor`."""
    return lambda src, block: src.replace(anchor, anchor + "\n" + block, 1)


def replace_pattern(pattern: str, what: str) -> Callable[[str, str], str]:
    """First-run insertion strategy: replace the first match of `pattern`; error (naming `what`) if absent."""
    def insert(src: str, block: str) -> str:
        new, n = re.subn(pattern, lambda _m: block, src, count=1, flags=re.S)
        if n != 1:
            raise ValueError(f"couldn't find {what} to replace")
        return new
    return insert


# --- head / body -------------------------------------------------------------------

class SetTitle(Transform):
    """Set the document <title>."""

    def __init__(self, title: str):
        self.title = title

    def apply(self, src: str) -> str:
        return re.sub(r"<title>.*?</title>", f"<title>{html.escape(self.title)}</title>", src, count=1, flags=re.S)


class RemoveLegacyHeadAssets(Transform):
    """The per-folder rmd-styles.css, old Google Fonts link and Font Awesome are replaced by shared assets."""

    PATTERNS = (
        r'\s*<link href="https://fonts.googleapis.com/css2[^"]*" rel="stylesheet">',
        r'\s*<link rel="stylesheet" href="rmd-styles.css">',
        r'\s*<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/[^"]*">',
    )

    def apply(self, src: str) -> str:
        for pattern in self.PATTERNS:
            src = re.sub(pattern, "", src)
        return src


class SetBodyClass(Transform):
    """Replace the <body> tag's attributes with a class list."""

    def __init__(self, classes: str):
        self.tag = f'<body class="{classes}">'

    def apply(self, src: str) -> str:
        return re.sub(r"<body[^>]*>", self.tag, src, count=1)


class RemoveLegacyChrome(Transform):
    """First run only: the old pasted-in nav (+ its theme script) and the dataset download bar."""

    def apply(self, src: str) -> str:
        src = re.sub(r"<!-- Site Navigation -->\s*<nav class=\"site-nav\".*?</nav>\s*<script>.*?</script>", "", src, count=1, flags=re.S)
        return re.sub(r'<div class="rmd-download-bar".*?</a>\s*</div>', "", src, count=1, flags=re.S)


class RemoveUpdatedBullet(Transform):
    """knitr's '* Updated as of <date>' bullet (the date moves into the header meta line)."""

    def apply(self, src: str) -> str:
        return re.sub(r"<ul>\s*<li>Updated as of [^<]*</li>\s*</ul>\s*", "", src)


# --- code folding --------------------------------------------------------------------

class FoldCodeChunks(Transform):
    """Wrap every knitr R chunk in <details> ("R code"), so the narrative reads first."""

    def apply(self, src: str) -> str:
        return re.sub(
            r'(?<!<summary>R code</summary>)\n?<pre class="r"><code>(.*?)</code></pre>',
            lambda m: f'\n<details class="cd-code"><summary>R code</summary><pre class="r"><code>{m.group(1)}</code></pre></details>',
            src,
            flags=re.S,
        )


class FoldLongOutputs(Transform):
    """Fold printed output longer than `max_lines`, except output that *is* the result."""

    def __init__(self, max_lines: int = 14, keep_if_contains: tuple[str, ...] = ("Confusion Matrix",)):
        self.max_lines, self.keep = max_lines, keep_if_contains

    def apply(self, src: str) -> str:
        return re.sub(r"(?<!</summary>)<pre><code>(##.*?)</code></pre>", self._fold, src, flags=re.S)

    def _fold(self, m: re.Match) -> str:
        body = m.group(1)
        lines = body.count("\n") + 1
        if lines <= self.max_lines or any(k in body for k in self.keep):
            return m.group(0)
        return f'<details class="cd-output"><summary>Printed output · {lines} lines</summary><pre><code>{body}</code></pre></details>'
