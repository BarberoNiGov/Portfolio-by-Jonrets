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
    "location": "Valenzuela City, Philippines",
    "role": "Web Application Developer / Application Support Specialist",
    "dates": "Dec 2024 - Present",
}

AI = {
    "title": "AI Application Engineer \u2014 Agentic Systems & Enterprise Software",
    "summary": (
        "AI application engineer who designs enterprise systems and builds them with AI agents. "
        "Specification, architecture, and verification are mine; a custom agent harness handles implementation. "
        "Led a five-system security hardening program by writing one implementation spec and adapting it per "
        "system through a phased agent loop."
    ),
    "skills": [
        ("Agentic Engineering", "Spec-driven development, context engineering, context handoff, subagent orchestration, verification gates, structured output validation, MCP tool boundaries"),
        ("AI Integration", "LLM API integration, prompt design, JSON Schema validation, LLM triage, provider fallback, injection-resistant boundaries"),
        ("Systems & Security", "System design, architecture decision records, non-functional requirements, failure-state design, RBAC, MFA, audit logging, OWASP"),
        ("Application Development", "Laravel, PHP, MySQL, Python, FastAPI, REST APIs, JavaScript, Vue 3, Inertia.js, Blade"),
        ("Tools", "Git, GitLab, OpenCode, Claude Code, Codex, Docker, pytest, Figma"),
    ],
    "groups": [
        ("AI & Agentic Delivery", [
            "Authored a shared implementation spec for MFA, audit logging, password expiry, and account lockout, then adapted and executed it across five internal systems through a phased agent loop with a verification gate per system.",
            "Built an AI-assisted analysis interface for the complaint tracking system that summarizes records, surfaces trends, and answers natural-language questions in 3-7 seconds for 100+ complaints per month across 20+ departments.",
            "Worked through written specs, context handoff packs, and read-only QA passes; reviewed every diff and validated each change in staging before release.",
        ]),
        ("Security & Reliability", [
            "Remediated 100+ vulnerabilities across five legacy systems and rolled out MFA, audit logging, password expiry, and 3-attempt auto-lock in ~1 month (2-3 months with post-deployment fixes and documentation).",
            "Designed MFA for a mixed workforce: TOTP and email OTP, bcrypt-hashed recovery codes, a deskless/shared-terminal mode, and proactive expiry messaging.",
            "Designed a three-tier audit logging architecture (global observer, trait-based, manual) with device and location enrichment and explicit fallback behavior.",
        ]),
        ("Enterprise Systems", [
            "Shipped an event-driven check-in system across two plant sites for company-wide events (700-5,000+ attendees), cutting per-person check-in from 1-2 minutes to a 2-3 second scan.",
            "Built a clinic system handling 2,000-5,000 patient records per quarter, and a CMS-style event system that lets non-technical staff customize registration and raffle pages.",
        ]),
    ],
    "projects": [
        ("AI Security Analysis Agent", "Locked output contract, deterministic core, LLM triage", "2026", [
            "Built a static-analysis agent returning schema-validated JSON against a locked output contract, with a deterministic detection core and an LLM triage layer; 190+ tests, a CLI/REST parity check, and an MCP tool boundary in a read-only container.",
        ]),
        ("Job Finder Platform for AI Agents \u2014 Architecture Package", "Design complete, not implemented", "2026", [
            "Produced 57 functional requirements, 40+ measurable non-functional requirements, 6 architecture decision records, and a 1,047-line API contract for an agent marketplace through a four-agent pipeline with written handoffs.",
        ]),
        ("Laya-Jev \u2014 Typed Decision Agent", "Personal exploration", "2026", [
            "Explored typed decisions with calibrated confidence gates, verified by a 67-test offline pytest suite and per-decision audit trails.",
        ]),
    ],
    "also": "Also shipped: NotiLog, a Kotlin Android app live on Google Play \u2014 encrypted on-device notification history with no account and no analytics, plus optional end-to-end encrypted partner sharing.",
}

FULLSTACK = {
    "title": "Web Application Developer \u2014 Enterprise Systems, Security & UX",
    "summary": (
        "Web application developer with a product and UX mindset, focused on internal enterprise systems. "
        "Experienced designing, building, securing, and improving applications across HR, clinic, complaints, "
        "events, payroll, and admin. Builds with AI agents using written specifications, context handoff, and a "
        "verification gate before release."
    ),
    "skills": [
        ("Application Development", "Laravel, PHP, MySQL, REST APIs, JavaScript, jQuery, AJAX, Blade, Vue 3, Inertia.js, Tailwind, Python, FastAPI"),
        ("Systems & Product", "System design, workflow analysis, information architecture, requirements discovery, process mapping, failure-state design, RBAC"),
        ("Security & Reliability", "MFA (TOTP + email OTP), audit logging, password policy and expiry, brute-force protection, OWASP, secrets redaction, CVE audit"),
        ("Design & UX", "UI/UX design, user flows, forms, tables, data-entry UX, dashboards, admin interfaces, security-sensitive UX, Figma"),
        ("Agentic Engineering", "Spec-driven development, context engineering, context handoff, subagent orchestration, verification gates, structured output validation"),
        ("Tools", "Git, GitHub, GitLab, Bitbucket, OpenCode, Claude Code, Codex, Docker, pytest"),
    ],
    "groups": [
        ("Enterprise Systems", [
            "Shipped an event-driven check-in system across two plant sites for company-wide events (700-5,000+ attendees), cutting per-person check-in from 1-2 minutes to a 2-3 second scan.",
            "Mapped clinic intake and records workflows and built a clinic management system handling 2,000-5,000 patient records per quarter; replaced paper intake and cut HRIS patient lookup from ~10s to ~2s.",
            "Built a CMS-style event and raffle system that lets non-technical staff customize registration and raffle pages themselves.",
            "Led technical delivery for IT Week with 500+ attendees; shipped three interactive web systems in one month, including a 200+ photo AI pipeline and a 6x6 game with 500+ unique players.",
        ]),
        ("Security & Reliability", [
            "Led a post-incident hardening program across five internal systems: authored one implementation spec for MFA, audit logging, password expiry, and account lockout, adapted it per system, remediated 100+ vulnerabilities, and shipped the controls in ~1 month.",
            "Designed MFA for a mixed workforce \u2014 TOTP and email OTP, bcrypt-hashed recovery codes, a deskless/shared-terminal mode, and proactive expiry messaging instead of surprise lockouts.",
            "Designed a three-tier audit logging architecture (global observer, trait-based, manual) with device and location enrichment, plus the admin interfaces that expose it.",
        ]),
        ("Product, Data & Modernization", [
            "Maintained and enhanced the Customer Complaint Tracking System (CCTR), handling 100+ complaints per month for 20+ departments; added filtering, KPI summaries, charts, and an AI-assisted analysis view answering in 3-7 seconds.",
            "Led a major-version front-end migration across 60+ Blade files (Bootstrap 4 to 5.3, AdminLTE 3 to 4, DataTables 1.10 to 2.3) with a phase-by-phase audit, per-phase verification, and a documented rollback plan.",
        ]),
    ],
    "projects": [
        ("NotiLog \u2014 Private Notification History", "Live on Google Play", "2026", [
            "Shipped a Kotlin Android app that keeps an encrypted, on-device history of dismissed notifications \u2014 no account, no analytics, no backend that stores notifications \u2014 plus optional end-to-end encrypted partner sharing (SQLCipher + Android Keystore).",
        ]),
        ("Job Finder Platform for AI Agents \u2014 Architecture Package", "Design complete", "2026", [
            "Produced 57 functional requirements, 40+ measurable non-functional requirements, 6 architecture decision records, and a 1,047-line API contract for an agent marketplace.",
        ]),
        ("Laya-Jev \u2014 Typed Decision Agent", "Personal exploration", "2026", [
            "Built two demos on a typed-decision model with calibrated confidence gates, verified by a 67-test offline pytest suite and per-decision audit trails.",
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
