"""Image facts the generator needs from disk: a WebP's pixel size, read from its header (standard library only)."""

from __future__ import annotations

import struct
from pathlib import Path
from typing import Optional


def webp_size(path: Path) -> Optional[tuple[int, int]]:
    """(width, height) of a WebP file, or None if it doesn't exist or isn't a WebP.

    Handles the three WebP layouts: lossy (VP8), lossless (VP8L) and extended (VP8X).
    """
    if not path.exists():
        return None
    head = path.read_bytes()[:30]
    if head[:4] != b"RIFF" or head[8:12] != b"WEBP":
        return None
    chunk = head[12:16]
    if chunk == b"VP8 ":
        w, h = struct.unpack("<HH", head[26:30])
        return w & 0x3FFF, h & 0x3FFF
    if chunk == b"VP8L":
        b = head[21:25]
        w = 1 + (((b[1] & 0x3F) << 8) | b[0])
        h = 1 + (((b[3] & 0x0F) << 10) | (b[2] << 2) | ((b[1] & 0xC0) >> 6))
        return w, h
    if chunk == b"VP8X":
        w = 1 + int.from_bytes(head[24:27], "little")
        h = 1 + int.from_bytes(head[27:30], "little")
        return w, h
    return None
