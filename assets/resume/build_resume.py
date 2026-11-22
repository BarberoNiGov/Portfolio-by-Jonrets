"""Build ATS-friendly resume variants as DOCX + print-ready HTML.

Single source of truth for content. The DOCX is the editable/ATS artifact;
the HTML is printed to PDF by Chrome headless so both stay in sync.

Usage:
    python build_resume.py
    # then print each HTML to PDF with Chrome (commands are printed on exit)
"""

from __future__ import annotations

import html
import os
import shutil
import subprocess
from pathlib import Path

from docx import Document
from docx.enum.text import WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor

HERE = Path(__file__).resolve().parent

NAME = "JONRICH BASCUG"
CONTACT = [
    "Valenzuela City, Philippines",
    "jbbascug20@gmail.com",
    "0908 668 3254",
    "linkedin.com/in/jonrich-bascug",
    "portfolio-by-jonrets.netlify.app",
]

EXPERIENCE = {
    "company": "CDO Foodsphere, Inc.",
    "location": "Valenzuela City, Philippines | Remote-first",
    "role": "Application Support Specialist",
    "dates": "Dec 2024 - Present",
}

AI = {
    "title": "AI Application Engineer \u2014 Agentic Systems & Enterprise Software",
    "summary": (
        "AI application engineer who designs enterprise systems and builds them with AI agents. "
        "I own specification, architecture, code review, and verification; a custom agent harness handles "
        "implementation. Delivered a paid AI security-analysis trial, hardened five legacy systems, and "
        "shipped an AI-assisted analysis view used by operations managers and executives."
    ),
    "skills": [
        ("Agentic Engineering", "Spec-driven development, context engineering, context handoff, subagent orchestration, verification gates, structured output validation, MCP tool boundaries"),
        ("AI Integration", "LLM API integration (OpenAI, Gemini, OpenRouter), prompt design, JSON Schema validation, LLM triage, provider fallback, injection-resistant boundaries"),
        ("Systems & Security", "System design, architecture decision records, non-functional requirements, failure-state design, RBAC, MFA, audit logging, OWASP"),
        ("Application Development", "Laravel, PHP, MySQL, SQL Server, Vue 3, Inertia.js, Blade, Python, FastAPI, REST APIs"),
        ("Tools", "Git, GitHub, GitLab, Bitbucket, Docker, pytest, k6"),
        ("AI Coding", "OpenCode, Claude Code, Codex, custom agent harness"),
    ],
    "groups": [
        ("AI & Agentic Delivery", [
            "Owned a five-system hardening program end to end: one implementation spec, adapted per system, executed through a phased agent loop with a verification gate; remediated 100+ vulnerable dependencies and upgraded legacy Laravel/PHP systems to supported releases.",
            "Built an AI-assisted analysis view for the complaint tracking system, used by the Customer Operations Manager, QA, and executives, answering questions in 3\u20137 seconds across a system serving 20+ departments, with a fallback LLM provider.",
            "Introduced agentic AI workflows to a small team and shared informal guidance on MCP-based tooling (Chrome DevTools MCP) for QA, testing, debugging, and code generation.",
        ]),
        ("Security & Reliability", [
            "Designed MFA for a mixed workforce \u2014 TOTP and email OTP, bcrypt recovery codes, and a deskless/shared-terminal mode; lockout and reset tickets rose for three weeks, then returned to normal.",
            "Designed three-tier audit logging \u2014 global observer, trait-based per-model, and manual for non-CRUD events \u2014 with device/location enrichment, explicit fallback, and the admin screens that expose it.",
        ]),
        ("Enterprise Systems", [
            "Shipped an event check-in system across two plant sites for four events a year (700\u20135,000+ attendees), cutting check-in from 1\u20132 minutes to a 2\u20133 second scan.",
            "Built a clinic system used by 15+ nurses and doctors across two sites and both shifts, managing 2,000\u20135,000 records a quarter; replaced paper intake and cut lookup from ~10s to ~2s.",
            "Built an event platform that has run 15+ company events, plus Reverse Bingo, a 600-person live-event system with pre-event card lock, offline PNG/PWA fallback, and revision-stamped WebSocket draws.",
        ]),
    ],
    "projects": [
        ("AI Security Agent", "Paid trial | Client accepted", "2026", [
            "Built a static-analysis agent for legacy Laravel/PHP systems under a locked output contract: schema-validated JSON, a deterministic detection core, LLM triage, 190+ tests, CLI/REST parity, an MCP tool boundary, and a read-only container.",
        ]),
        ("Troupe \u2014 Persona-Conditioned Coding Agents", "Meta Global AI Developer Hackathon | Public MIT repo", "2026", [
            "Selected as one of 20,000 participants from 34,000+ applicants. Built a studio where 11 persona-conditioned agents generated 8/8 valid outputs in 2D, 3D, and Hybrid with zero render errors; 56 tests; blind-voted for visual and palette diversity.",
        ]),
        ("NotiLog \u2014 Private Notification History", "Live on Google Play | 70+ installs", "2026", [
            "Shipped a Kotlin Android app: encrypted on-device notification history, no account/ads/analytics, plus optional end-to-end encrypted partner sharing.",
        ]),
    ],
    "also": "Also built: Laya-Jev, a typed-decision exploration with calibrated confidence gates, a 67-test offline suite, and per-decision audit trails.",
}

FULLSTACK = {
    "title": "Full-Stack Web Application Developer",
    "scope": "Builds and maintains internal business applications in Laravel/PHP/MySQL/Vue.",
    "summary": (
        "Full-stack web application developer who builds and maintains internal business systems end to end \u2014 "
        "workflow, database, UI, security, and deployment. Shipped systems across complaint tracking, company "
        "events, clinic operations, and operational workflows, hardened five legacy systems, and moved them onto "
        "supported Laravel/PHP releases. Product and UX mindset; I use AI agents to accelerate implementation while keeping "
        "specification, code review, and verification in human hands."
    ),
    "skills": [
        ("Application Development", "Laravel, PHP, MySQL, SQL Server, Vue 3, Inertia.js, Blade, Tailwind, jQuery, AJAX, REST APIs, Python, FastAPI"),
        ("Systems & Product", "System design, workflow analysis, information architecture, requirements discovery, failure-state design, RBAC"),
        ("Security & Reliability", "MFA (TOTP + email OTP), audit logging, password policy and expiry, brute-force protection, OWASP, dependency/CVE remediation"),
        ("UI/UX", "UI design, user flows, forms, tables, data-entry UX, dashboards, admin interfaces, Figma"),
        ("AI-Assisted Delivery", "Spec-driven development, context handoff, verification gates, MCP-based tooling, LLM integration (OpenAI, Gemini, OpenRouter)"),
        ("Tools", "Git, GitHub, GitLab, Bitbucket, Docker, pytest, k6"),
    ],
    "groups": [
        ("Enterprise Systems", [
            "Shipped an event check-in system across two plant sites for four events a year (700\u20135,000+ attendees), cutting check-in from 1\u20132 minutes to a 2\u20133 second scan and replacing manual name-and-detail writing.",
            "Built a clinic system used by 15+ nurses and doctors across P2 and P3 on both shifts, managing 2,000\u20135,000 records a quarter; replaced paper intake and cut lookup from ~10s to ~2s.",
            "Built an event platform that has run 15+ company events \u2014 CMS-style registration/raffle pages, kiosks, participant management, and Deal or No Deal \u2014 removing the recurring developer ticket for every template change.",
            "Led development of three interactive systems for IT Week in one month for 500+ attendees, including a 200+ photo AI pipeline and a 6x6 game ranked #1 for engagement with 500+ players and 1,000+ sessions; coordinated a 30+ person IT department, and the IT Head endorsed an annual repeat.",
        ]),
        ("Security & Reliability", [
            "Owned a five-system hardening program end to end: remediated 100+ vulnerable dependencies in legacy Laravel 6/7 and PHP systems, upgraded them to supported releases, and shipped MFA, audit logging, password expiry, and 3-attempt auto-lock; the follow-up scan showed fewer findings.",
            "Designed MFA for a mixed workforce \u2014 TOTP and email OTP, bcrypt recovery codes, and a deskless/shared-terminal mode; lockout and reset tickets rose for three weeks, then returned to normal.",
            "Designed three-tier audit logging \u2014 global observer, trait-based per-model, and manual for non-CRUD events \u2014 with device/location enrichment and the admin screens that expose it.",
        ]),
        ("Product & Modernization", [
            "Built an AI-assisted analysis view for the Customer Complaint Tracking System (CCTR), used by the Customer Operations Manager, QA, and executives; answers questions in 3\u20137 seconds across a system serving 20+ departments, with a fallback LLM provider.",
            "Completed a phased major-version migration of 60\u2013100+ Blade files across the five hardening systems (Bootstrap 4 to 5.3, AdminLTE 3 to 4, DataTables 1.10 to 2.3), with faster page load and build time, no regressions, and an unused rollback plan; also redesigned and shipped three internal security/admin screens.",
        ]),
    ],
    "projects": [
        ("Reverse Bingo \u2014 Live Event Platform", "Laravel + Vue | 600-person live event", "2026", [
            "Built a live-event platform that ran at a 600-person event on 2\u20133 browser clients: cards lock before the event, offline players use a PNG/PWA card, and revision-stamped WebSocket draws resync on a gap; 287 tests / 1,668 assertions.",
        ]),
        ("NotiLog \u2014 Private Notification History", "Kotlin | Android | Google Play | 70+ installs", "2026", [
            "Shipped a Kotlin Android app, live on Google Play: encrypted on-device notification history with no account, ads, or analytics, plus optional end-to-end encrypted partner sharing.",
        ]),
    ],
    "also": None,
}

EDUCATION = {
    "school": "Our Lady of Fatima University",
    "degree": "B.S. Computer Science",
    "location": "Valenzuela, PH",
    "dates": "Jan 2020 - Aug 2024",
}

CERTIFICATIONS = [("CompTIA ITF+", "Aug 2024")]


# --------------------------------------------------------------------------
# DOCX
# --------------------------------------------------------------------------

def _bottom_border(paragraph, size=6, color="999999"):
    p_pr = paragraph._p.get_or_add_pPr()
    borders = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), str(size))
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), color)
    borders.append(bottom)
    p_pr.append(borders)


def _run(paragraph, text, *, bold=False, italic=False, size=None, color=None):
    run = paragraph.add_run(text)
    run.bold = bold
    run.italic = italic
    if size:
        run.font.size = Pt(size)
    if color:
        run.font.color.rgb = RGBColor(*color)
    run.font.name = "Calibri"
    return run


def _spacing(paragraph, *, before=0, after=2, line=1.05):
    pf = paragraph.paragraph_format
    pf.space_before = Pt(before)
    pf.space_after = Pt(after)
    pf.line_spacing = line


def _heading(doc, text):
    p = doc.add_paragraph()
    _run(p, text.upper(), bold=True, size=10.5, color=(0x1A, 0x1A, 0x2E))
    _bottom_border(p)
    _spacing(p, before=7, after=3, line=1.0)
    p.paragraph_format.keep_with_next = True
    return p


def _bullet(doc, text):
    p = doc.add_paragraph(style="List Bullet")
    _run(p, text)
    pf = p.paragraph_format
    pf.left_indent = Inches(0.18)
    pf.first_line_indent = Inches(-0.18)
    _spacing(p, before=0, after=1.5, line=1.03)
    return p


def build_docx(variant, out_path: Path):
    doc = Document()

    sec = doc.sections[0]
    sec.top_margin = Inches(0.45)
    sec.bottom_margin = Inches(0.45)
    sec.left_margin = Inches(0.5)
    sec.right_margin = Inches(0.5)

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(9.5)
    normal.element.rPr.rFonts.set(qn("w:eastAsia"), "Calibri")

    p = doc.add_paragraph()
    _run(p, NAME, bold=True, size=18)
    _spacing(p, after=0, line=1.0)

    p = doc.add_paragraph()
    _run(p, variant["title"], size=10, color=(0x44, 0x44, 0x44))
    _spacing(p, after=1, line=1.0)

    p = doc.add_paragraph()
    _run(p, "  |  ".join(CONTACT), size=8.5, color=(0x55, 0x55, 0x55))
    _spacing(p, after=1, line=1.0)

    _heading(doc, "Summary")
    p = doc.add_paragraph()
    _run(p, variant["summary"])
    _spacing(p, after=1)

    _heading(doc, "Core Skills")
    for label, values in variant["skills"]:
        p = doc.add_paragraph()
        _run(p, label + ": ", bold=True)
        _run(p, values)
        _spacing(p, after=1, line=1.02)

    _heading(doc, "Experience")
    width = Inches(7.5)

    p = doc.add_paragraph()
    p.paragraph_format.tab_stops.add_tab_stop(width, WD_TAB_ALIGNMENT.RIGHT)
    _run(p, EXPERIENCE["company"], bold=True, size=10)
    _run(p, "\t" + EXPERIENCE["dates"], size=9)
    _spacing(p, after=0, line=1.0)
    p.paragraph_format.keep_with_next = True

    p = doc.add_paragraph()
    _run(p, EXPERIENCE["role"], italic=True, size=9.5)
    _run(p, " \u2014 " + EXPERIENCE["location"], size=9.5, color=(0x55, 0x55, 0x55))
    _spacing(p, after=1, line=1.0)
    p.paragraph_format.keep_with_next = True

    if variant.get("scope"):
        p = doc.add_paragraph()
        _run(p, variant["scope"], italic=True, size=9, color=(0x55, 0x55, 0x55))
        _spacing(p, after=2, line=1.0)
        p.paragraph_format.keep_with_next = True

    for heading, bullets in variant["groups"]:
        p = doc.add_paragraph()
        _run(p, heading, bold=True, size=9.5, color=(0x03, 0x66, 0xD6))
        _spacing(p, before=4, after=1, line=1.0)
        p.paragraph_format.keep_with_next = True
        for b in bullets:
            _bullet(doc, b)

    _heading(doc, "Selected Projects")
    for name, meta, year, bullets in variant["projects"]:
        p = doc.add_paragraph()
        p.paragraph_format.tab_stops.add_tab_stop(width, WD_TAB_ALIGNMENT.RIGHT)
        _run(p, name, bold=True, size=9.5)
        _run(p, "  \u2014  " + meta, italic=True, size=9, color=(0x55, 0x55, 0x55))
        _run(p, "\t" + year, size=9)
        _spacing(p, after=0, line=1.0)
        p.paragraph_format.keep_with_next = True
        for b in bullets:
            _bullet(doc, b)

    if variant.get("also"):
        p = doc.add_paragraph()
        _run(p, variant["also"], size=9, color=(0x55, 0x55, 0x55))
        _spacing(p, before=2, after=1, line=1.03)

    _heading(doc, "Education & Certifications")
    p = doc.add_paragraph()
    p.paragraph_format.tab_stops.add_tab_stop(width, WD_TAB_ALIGNMENT.RIGHT)
    _run(p, f"{EDUCATION['degree']} \u2014 {EDUCATION['school']}", bold=True, size=9.5)
    _run(p, "\t" + EDUCATION["dates"], size=9)
    _spacing(p, after=0, line=1.0)

    p = doc.add_paragraph()
    _run(p, "  |  ".join(f"{n} ({d})" for n, d in CERTIFICATIONS))
    _spacing(p, after=0, line=1.0)

    doc.save(out_path)


# --------------------------------------------------------------------------
# HTML (printed to PDF by Chrome)
# --------------------------------------------------------------------------

def build_html(variant, out_path: Path):
    def esc(s):
        return html.escape(s, quote=False)

    b = []
    b.append(f"<h1>{esc(NAME)}</h1>")
    b.append(f'<p class="title">{esc(variant["title"])}</p>')
    b.append(f'<p class="contact">{" | ".join(esc(c) for c in CONTACT)}</p>')

    b.append("<h2>Summary</h2>")
    b.append(f"<p>{esc(variant['summary'])}</p>")

    b.append("<h2>Core Skills</h2>")
    b.append("".join(
        f'<p class="skill"><b>{esc(label)}:</b> {esc(values)}</p>'
        for label, values in variant["skills"]
    ))

    b.append("<h2>Experience</h2>")
    b.append(
        '<div class="job">'
        f'<div class="line"><b>{esc(EXPERIENCE["company"])}</b><span>{esc(EXPERIENCE["dates"])}</span></div>'
        f'<p class="role">{esc(EXPERIENCE["role"])} &mdash; <span class="muted">{esc(EXPERIENCE["location"])}</span></p>'
    )
    if variant.get("scope"):
        b.append(f'<p class="scope">{esc(variant["scope"])}</p>')
    for heading, bullets in variant["groups"]:
        b.append(f'<p class="group">{esc(heading)}</p><ul>')
        b.extend(f"<li>{esc(x)}</li>" for x in bullets)
        b.append("</ul>")
    b.append("</div>")

    b.append("<h2>Selected Projects</h2>")
    for name, meta, year, bullets in variant["projects"]:
        b.append(
            '<div class="project">'
            f'<div class="line"><span><b>{esc(name)}</b> <span class="muted">&mdash; {esc(meta)}</span></span>'
            f'<span>{esc(year)}</span></div><ul>'
        )
        b.extend(f"<li>{esc(x)}</li>" for x in bullets)
        b.append("</ul></div>")

    if variant.get("also"):
        b.append(f'<p class="also">{esc(variant["also"])}</p>')

    b.append("<h2>Education &amp; Certifications</h2>")
    b.append(
        '<div class="line">'
        f'<b>{esc(EDUCATION["degree"])} &mdash; {esc(EDUCATION["school"])}</b>'
        f'<span>{esc(EDUCATION["dates"])}</span></div>'
    )
    b.append("<p>" + " | ".join(f"{esc(n)} ({esc(d)})" for n, d in CERTIFICATIONS) + "</p>")

    doc = f"""<!DOCTYPE html>
<html lang="en">
<head>
<!-- Generated by build_resume.py. Do not edit by hand. -->
<meta charset="utf-8">
<title>{esc(NAME)} - Resume</title>
<style>
  @page {{ size: Letter; margin: 0.45in 0.5in; }}
  * {{ box-sizing: border-box; }}
  html, body {{ margin: 0; padding: 0; }}
  body {{
    font-family: Calibri, Carlito, "Segoe UI", Arial, sans-serif;
    font-size: 9.5pt;
    line-height: 1.2;
    color: #111;
    font-variant-ligatures: none;
    font-feature-settings: "liga" 0, "clig" 0, "dlig" 0;
    -webkit-font-smoothing: antialiased;
  }}
  h1 {{ font-size: 18pt; margin: 0 0 1pt; letter-spacing: 0.02em; }}
  .title {{ font-size: 10pt; color: #444; margin: 0 0 1.5pt; }}
  .contact {{ font-size: 8.5pt; color: #555; margin: 0 0 3pt; }}
  h2 {{
    font-size: 10.5pt; text-transform: uppercase; letter-spacing: 0.05em;
    margin: 6pt 0 2.5pt; padding-bottom: 1.5pt;
    border-bottom: 0.75pt solid #999;
    page-break-after: avoid;
  }}
  p {{ margin: 0 0 2pt; }}
  .skill {{ margin: 0 0 1.2pt; }}
  .line {{ display: flex; justify-content: space-between; gap: 12pt; }}
  .line span {{ color: #444; font-size: 8.8pt; white-space: nowrap; }}
  .role {{ font-size: 9pt; margin: 0 0 1.5pt; }}
  .scope {{ font-size: 9pt; font-style: italic; color: #555; margin: 0 0 2pt; }}
  .muted {{ color: #555; }}
  .group {{ font-weight: bold; font-size: 9.5pt; color: #0366d6; margin: 3.5pt 0 1pt; }}
  ul {{ margin: 0 0 1.5pt; padding-left: 13pt; }}
  li {{ margin: 0 0 1.2pt; }}
  .also {{ font-size: 9pt; color: #555; margin-top: 2pt; }}
  .job, .project {{ page-break-inside: avoid; }}
  .project {{ margin-bottom: 2.5pt; }}
</style>
</head>
<body>
{chr(10).join(b)}
</body>
</html>
"""
    out_path.write_text(doc, encoding="utf-8")


CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
]

AI_PDF = HERE / "Jonrich_Bascug_AI_Engineer.pdf"
LEGACY_PDF = HERE.parent / "Jonrich_Bascug_Resume.pdf"


def find_browser():
    override = os.environ.get("CHROME_PATH")
    if override and Path(override).exists():
        return override
    for candidate in CHROME_CANDIDATES:
        if Path(candidate).exists():
            return candidate
    return shutil.which("chrome") or shutil.which("chrome.exe")


def print_pdf(browser: str, html_path: Path, pdf_path: Path):
    subprocess.run(
        [
            browser,
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={pdf_path}",
            html_path.as_uri(),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def main():
    for variant, stem in ((AI, "Jonrich_Bascug_AI_Engineer"), (FULLSTACK, "Jonrich_Bascug_Fullstack")):
        build_docx(variant, HERE / f"{stem}.docx")
        build_html(variant, HERE / f"{stem}.html")
        print(f"built {stem}.docx and {stem}.html")

    browser = find_browser()
    if not browser:
        print("\nChrome or Edge not found. Set CHROME_PATH and re-run, or print the HTML files manually.")
        return

    for stem in ("Jonrich_Bascug_AI_Engineer", "Jonrich_Bascug_Fullstack"):
        print_pdf(browser, HERE / f"{stem}.html", HERE / f"{stem}.pdf")
        print(f"built {stem}.pdf")

    shutil.copyfile(AI_PDF, LEGACY_PDF)
    print(f"updated legacy path {LEGACY_PDF.relative_to(HERE.parent)}")


if __name__ == "__main__":
    main()
