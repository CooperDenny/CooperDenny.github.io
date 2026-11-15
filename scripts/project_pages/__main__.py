"""Allows `python3 -m project_pages` (from scripts/); same as scripts/build-project-pages.py."""

import sys

from .cli import main

sys.exit(main())
