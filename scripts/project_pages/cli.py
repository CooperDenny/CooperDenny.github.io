"""Command line: build the project pages, or --check that they're up to date."""

from __future__ import annotations

import argparse
import sys

from .site import build_pages


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Build the /projects/<slug>/ pages.")
    parser.add_argument("--check", action="store_true", help="don't write; exit 1 if any page would change")
    args = parser.parse_args(argv)

    changed = [p.slug for p in build_pages() if p.build(write=not args.check)]
    verb = "would change" if args.check else "updated"
    print(f"{verb}: {', '.join(changed)}" if changed else "all project pages up to date")
    return 1 if (args.check and changed) else 0


if __name__ == "__main__":
    sys.exit(main())
