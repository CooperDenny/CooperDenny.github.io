#!/usr/bin/env python3
"""Build the /projects/<slug>/ pages.

    python3 scripts/build-project-pages.py           # rebuild (idempotent)
    python3 scripts/build-project-pages.py --check   # exit 1 if any page is out of date

Edit copy in scripts/project_pages/content.py. After re-knitting a report from its
.Rmd, just run this again. Architecture: see scripts/project_pages/__init__.py.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from project_pages.cli import main  # noqa: E402

sys.exit(main())
