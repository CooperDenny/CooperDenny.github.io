"""Builds the static /projects/<slug>/ pages. Entry point: scripts/build-project-pages.py.

Architecture (dependencies point downwards):

    cli          parse args, run, report
    site         composition root: wires catalog + renderer + pages + extensions
    pages        ProjectPage (ABC) -> HandPage (generated) | ReportPage (knitr, enhanced in place)
    extensions   ReportExtension (ABC) -> ArbitrageFacts (metrics computed from report data)
    transforms   Transform (ABC) + small, single-purpose HTML edits and a Pipeline
    render       Renderer: the shared chrome as HTML fragments
    model        immutable dataclasses for page copy
    content      the copy itself (data only)
    catalog / icons / settings   read the repo-wide JSON/CSS sources of truth
"""
