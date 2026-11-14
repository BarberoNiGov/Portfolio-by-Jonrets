(function () {
  var themeToggle = document.querySelector('.theme-toggle');
  var html = document.documentElement;
  var STORAGE_KEY = 'portfolio-theme';

  function getPreferredTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return 'light';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  setTheme(getPreferredTheme());

  var avatarImg = document.getElementById('avatar-img');
  var avatarSprite = document.getElementById('avatar-sprite');
  var spriteTimer = null;

  var SPRITE_COLS = 4;
  var SPRITE_ROWS = 3;
  var TOTAL_FRAMES = SPRITE_COLS * SPRITE_ROWS;
  var FRAME_MS = 80;

  function stopSprite() {
    if (spriteTimer) {
      clearInterval(spriteTimer);
      spriteTimer = null;
    }
  }

  function setSpriteFrame(index) {
    var col = index % SPRITE_COLS;
    var row = Math.floor(index / SPRITE_COLS);
    var xPct = (col / (SPRITE_COLS - 1)) * 100;
    var yPct = (row / (SPRITE_ROWS - 1)) * 100;
    avatarSprite.style.backgroundPosition = xPct + '% ' + yPct + '%';
  }

  function showSprite() {
    avatarImg.style.opacity = '0';
    avatarSprite.style.opacity = '1';
  }

  function showPhoto() {
    stopSprite();
    avatarSprite.style.opacity = '0';
    avatarImg.style.opacity = '';
  }

  // Keep the avatar in sync with the saved theme on load
  if (html.getAttribute('data-theme') === 'dark') {
    setSpriteFrame(TOTAL_FRAMES - 1);
    showSprite();
  }

  function playForward() {
    stopSprite();
    setSpriteFrame(0);
    showSprite();
    var frame = 0;
    spriteTimer = setInterval(function () {
      frame++;
      setSpriteFrame(frame);
      if (frame >= TOTAL_FRAMES - 1) {
        clearInterval(spriteTimer);
        spriteTimer = null;
      }
    }, FRAME_MS);
  }

  function playReverse() {
    stopSprite();
    setSpriteFrame(TOTAL_FRAMES - 1);
    showSprite();
    var frame = TOTAL_FRAMES - 1;
    spriteTimer = setInterval(function () {
      frame--;
      setSpriteFrame(frame);
      if (frame <= 0) {
        clearInterval(spriteTimer);
        spriteTimer = null;
        showPhoto();
      }
    }, FRAME_MS);
  }

  themeToggle.addEventListener('click', function () {
    var current = html.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);

    if (next === 'dark') {
      playForward();
    } else {
      playReverse();
    }
  });

  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  navToggle.addEventListener('click', function () {
    navLinks.classList.toggle('open');
  });

  document.addEventListener('click', function (e) {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });

  function mediaSrc(item) {
    return typeof item === 'string' ? item : item.src;
  }

  function mediaType(item) {
    return typeof item === 'string' ? 'image' : (item.type || 'image');
  }

  function mediaPoster(item) {
    return item.poster || '';
  }

  function cssBg(value) {
    if (!value) return '';
    if (value.indexOf('linear-gradient') === 0 || value.indexOf('url(') === 0) return value;
    return "url('" + value + "')";
  }

  var systemsData = [
    {
      id: 'agentic-delivery',
      name: 'Job Finder Platform for AI Agents — Architecture Package',
      shortDesc: 'Case study: 57 requirements, 6 ADRs, and a 1,047-line API contract for an agent marketplace — produced through a 4-agent pipeline',
      longDesc: 'A complete pre-implementation architecture and design package for a platform where people register AI agents, publish agent resumes, post work, and other agents apply. Produced through a four-agent sequential pipeline with explicit handoff documents between stages: requirements and flows, then system design and decision records, then implementation, then documentation. Status: design complete, implementation not started. This is the pre-code layer, not a shipped product.',
      badge: 'Case study',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0366d6 100%)',
      techStack: ['System Design', 'Architecture Decision Records', 'Requirements Engineering', 'API Contracts', 'Multi-agent Pipeline', 'Laravel'],
      features: [
        '57 functional requirements across 7 domains',
        '40+ non-functional requirements with measurable targets',
        '6 architecture decision records with options and rationale',
        '7-module modular monolith with explicit dependency rules',
        '1,047-line API contract and complete data model',
        'Four-agent pipeline with written handoffs between stages',
        'Status: design complete, implementation not started'
      ],
      link: { href: 'case-study-agentic-delivery.html', label: 'Read the full case study' },
      images: []
    },
    {
      id: 'troupe',
      name: 'Troupe — Persona-Conditioned Coding Agents',
      section: 'exploration',
      badge: 'Meta Hackathon',
      shortDesc: 'Selected for the 2026 Meta Global AI Developer Hackathon — 11 persona-conditioned coding agents generate and blind-score eight motion directions from one brief',
      longDesc: 'Built during the 2026 Meta Global AI Developer Hackathon, selected as one of 20,000 participants from 34,000+ applicants. Troupe is a controlled experiment: eleven coding agents, each with a Big Five-inspired record and design kernel, independently generate a self-contained HTML motion graphic from the same brief. The studio validates every output, measures visual and palette diversity, and hides identities for a blind vote. On Meta’s Muse Spark 1.3, the core eight generated 8/8 in 2D, 3D, and Hybrid with zero render errors; 2D was the most diverse (0.46 visual similarity), Hybrid the most legible and most homogeneous (0.62); a full run costs about $0.01. The repo is public and MIT-licensed. This is a pilot, not a study — one brief, one model, a handful of runs.',
      techStack: ['Python', 'FastAPI', 'Meta Muse Spark 1.3', 'OpenRouter', 'Three.js', 'JavaScript', 'pytest', 'Playwright'],
      features: [
        'Selected as one of 20,000 participants from 34,000+ applicants',
        '11 persona-conditioned coding agents, 8 in the room, one brief',
        '8/8 outputs in 2D/3D/Hybrid with zero render errors',
        'Blind vote plus visual and palette diversity metrics',
        'Self-contained HTML outputs; sandboxed, offline, CSP, vendored Three.js',
        '56 tests; public MIT repo',
        'Pilot, not a study: one brief, one model, a handful of runs'
      ],
      link: { href: 'https://github.com/BarberoNiGov/Troupe-Meta', label: 'View the public repo' },
      mediaFit: 'contain',
      carouselTall: true,
      images: [
        'assets/img/Portfolio Images/Troupe/1.webp',
        'assets/img/Portfolio Images/Troupe/2.webp',
        'assets/img/Portfolio Images/Troupe/3.webp'
      ]
    },
    {
      id: 'recipe-corpus',
      name: 'Recipe Corpus Ingestion',
      section: 'exploration',
      shortDesc: '1,574 documents normalized from a sitemap index — throttled, checkpointed, and resumable',
      longDesc: 'Enumerated 1,574 URLs from a three-part sitemap index and extracted normalized records from JSON-LD rather than parsing HTML, which avoids the fragility of layout-dependent scraping. Hard 1 request/second throttle, 3-retry exponential backoff, checkpointed batch writes, and resume-from-checkpoint for interrupted runs. About 3.8 MB of normalized output across 5 batches. Personal research use; no source content republished.',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 55%, #f59e0b 100%)',
      techStack: ['Python', 'requests', 'Sitemap Parsing', 'JSON-LD', 'Checkpointing', 'Exponential Backoff'],
      features: [
        '1,574 URLs enumerated from a three-part sitemap index',
        'Normalized extraction from JSON-LD instead of HTML layout',
        'Hard 1 req/s throttle to stay within polite crawl limits',
        '3-retry exponential backoff on transient responses',
        'Checkpointed batch writes with resume-from-checkpoint',
        '~3.8 MB of normalized output across 5 batches',
        'Personal research use — no source content republished'
      ],
      images: []
    },
    {
      id: 'notilog',
      name: 'NotiLog — Notification Log',
      section: 'exploration',
      shortDesc: 'Private, encrypted on-device notification history — plus optional end-to-end encrypted sharing with one trusted person',
      longDesc: 'Personal project, live on Google Play (Productivity, updated Oct 19, 2026). NotiLog keeps a private history of notifications even after they are dismissed, cleared, or missed — including messages a sender unsends. Privacy-first: no account, no ads, no analytics, and no backend that stores notifications; history is encrypted at rest with SQLCipher (AES-256) and the Android Keystore. Optional partner sharing pairs two phones by QR and sends content only to that paired device, end-to-end encrypted and off by default; the ciphertext is relayed through the public ntfy.sh service, which cannot read it but can observe metadata such as timing and IP address. Uninstalling erases everything.',
      techStack: ['Kotlin', 'Android', 'Notification Access', 'SQLCipher', 'Android Keystore', 'End-to-end Encryption', 'QR Pairing'],
      features: [
        'Background capture once Notification Access is granted, with auto-reconnect after reboot',
        'Read dismissed, cleared, and deleted notifications again — including messages a sender unsends',
        'Organized by app and conversation, with full-text search and date/app filters',
        'Favorites and pinned apps; detail view with full content and metadata',
        'Banking, 2FA, password manager, and OTP notifications excluded by default; custom app and keyword exclusions',
        'Optional PIN, plus encrypted backup and restore with a user-controlled passphrase',
        'Optional partner sharing: QR pairing, end-to-end encrypted, off by default, unpair anytime',
        'No account, no ads, no analytics; notification history stays encrypted on-device'
      ],
      link: { href: 'https://play.google.com/store/apps/details?id=com.notilog.app&hl=en', label: 'View on Google Play' },
      images: [
        'assets/img/Portfolio Images/NotiLog/1.webp',
        'assets/img/Portfolio Images/NotiLog/2.webp',
        'assets/img/Portfolio Images/NotiLog/3.webp',
        'assets/img/Portfolio Images/NotiLog/4.webp',
        'assets/img/Portfolio Images/NotiLog/5.webp'
      ]
    },
    {
      id: 'laya-jev',
      name: 'Laya-Jev — Exploring TypeSafe Jev Use Cases',
      section: 'exploration',
      shortDesc: 'Personal exploration (not production): testing what TypeSafe Jev can do — typed decisions with calibrated confidence',
      longDesc: 'Personal exploration — not used in production. Self-directed project focused on exploring the use cases and capabilities of the Jev model from TypeSafe AI (System One Model, not chat). Jev returns typed decisions with calibrated confidence instead of strings, so Python owns all control flow and side effects behind confidence gates. Two test demos — customer-support agent (SQLite tools, money-action gating, Tagalog/Taglish) and robot arm planner — served through hand-built web UIs that visualize each decision trace. Verified with a 67-test offline pytest suite plus live end-to-end runs.',
      techStack: ['Python', 'TypeSafe Jev (System One Model)', 'SQLite', 'Three.js', 'pytest'],
      features: [
        'Explores Jev capabilities: typed outputs software can act on, with calibrated confidence per decision',
        'Tests Jev vs chat LLMs: decisions, not strings — thresholds decide when to act vs escalate',
        'Customer-support demo: SQLite tools, money actions always escalate, Tagalog/Taglish inputs',
        'Robot-arm planner demo: closed action set, agent picks from menu only, never free-form commands',
        'Per-decision audit trail (JSONL) with probabilities for every run',
        '67-test pytest suite, all green offline with mocked Jev clients',
        'Live-verified: refund request correctly escalated at 0.99 confidence'
      ],
      images: [
        {
          type: 'video',
          src: 'assets/img/Portfolio Images/Laya-Jev/Video Project 2-compressed.mp4',
          poster: 'assets/img/Portfolio Images/Laya-Jev/Video Project 2-poster.webp'
        },
        {
          type: 'video',
          src: 'assets/img/Portfolio Images/Laya-Jev/Video Project 1-compressed.mp4',
          poster: 'assets/img/Portfolio Images/Laya-Jev/Video Project 1-poster.webp'
        }
      ]
    },
    {
      id: 'cctr',
      name: 'Customer Complaint Tracking System (CCTR)',
      shortDesc: 'Complaint dashboard with multi-dimensional filters, analysis charts, and AI-assisted analysis',
      longDesc: 'CCTR records and tracks customer complaints end to end. I maintain and support the system and added dashboard and analysis features: multi-dimensional complaint filters, KPI summaries, and analysis charts. Its AI-assisted analysis view summarizes complaint records, surfaces trends, suggests likely root causes, and answers natural-language questions about the data. The system also includes account security screens — MFA settings, login history, audit trail, and active users — used to monitor and protect access.',
      techStack: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'AJAX', 'AI-assisted Data Analysis'],
      features: [
        'Dashboard with multi-dimensional complaint filters',
        'KPI summaries — total complaints received and valid plant-related (VPR) share',
        'Analysis charts — monthly complaint trend and VPR vs. VNPR',
        'AI-assisted analysis: summarizes records, detects trends, suggests root causes, and answers natural-language questions',
        'Account security screens: MFA settings, login history, audit trail, and active users',
        'Maintains and supports the system; added the dashboard and analysis features'
      ],
      images: [
        {
          type: 'video',
          src: 'assets/img/Portfolio Images/CCTR/1.mp4',
          poster: 'assets/img/Portfolio Images/CCTR/3.webp'
        },
        'assets/img/Portfolio Images/CCTR/2.png',
        'assets/img/Portfolio Images/CCTR/3.webp',
        'assets/img/Portfolio Images/CCTR/4.png',
        'assets/img/Portfolio Images/CCTR/5.png',
        'assets/img/Portfolio Images/CCTR/6.png'
      ]
    },
    {
      id: 'vapt',
      name: 'Post-Incident Security Hardening',
      shortDesc: 'One implementation spec, reworked across five systems — 100+ vulnerabilities remediated and MFA, audit logging, and lockout shipped in ~1 month',
      longDesc: 'After an incident, five internal systems carried 100+ vulnerabilities from legacy dependencies. I wrote the MFA, audit logging, password expiry, and account lockout implementation once as a structured specification — requirements, integration points, acceptance criteria, verification steps — then reworked and executed it per system through a phased agent loop. Each system had different auth flows, legacy state, and admin surfaces; the invariant was the structure and the verification gate at the end of every run. Designed for a mixed workforce: email OTP and authenticator modes including deskless and shared terminals, recovery codes, auto-lock tuned against support-ticket load, and proactive expiry messaging instead of surprise lockouts.',
      techStack: ['Laravel', 'PHP', 'MySQL', 'MFA (Email OTP + Authenticator)', 'Spatie Audit Logging', 'OWASP / npm audit', 'Agent-assisted Delivery'],
      features: [
        'Authored one implementation spec, then adapted and executed it across five systems through a phased agent loop',
        'Remediated 100+ vulnerabilities; shipped MFA, audit logging, password expiry, and 3-attempt auto-lock in ~1 month',
        'Email OTP and authenticator modes, including a mode for deskless and shared-terminal staff',
        'Bcrypt-hashed recovery codes and proactive expiry messaging instead of surprise lockouts',
        'Spatie audit logging: invisible to users, full trail for admins',
        'Same acceptance criteria and verification gate applied to every system'
      ],
      images: []
    },
    {
      id: 'e-raffle',
      name: 'Event Management & E-Raffle',
      badge: '3 systems',
      shortDesc: 'Replacing manual tickets and check-ins with a self-service event platform: registration kiosks, e-Raffle, and Deal or No Deal',
      longDesc: 'Company events required designing and physically cutting raffle and attendance tickets for the entire workforce, and check-in was manual and slow. I designed the in/out flow across two plant sites and shipped a session-based event system: timestamped eligibility rules that block duplicate and late entries, a live participant dashboard for real-time turnout instead of paper reconciliation, prize sequencing with winner registration, and a CMS-style theme designer that lets non-technical staff customize registration and raffle pages themselves. The platform also includes registration and token kiosks, attendee details and statistics, e-Raffle prize and participant management, and a Deal or No Deal game with 20 briefcase holders, a Player of the Night, a Pick A Name side raffle, and remote stage control. Designed for bursts of simultaneous check-ins on event day. Screenshots are from test/demo events; participant data is redacted.',
      techStack: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'AJAX'],
      features: [
        'Automated event in/out + E-Raffle — removed manual ticket design and cutting',
        'Timestamped eligibility rules (blocks duplicate and late entries)',
        'Live participant dashboard — real-time turnout, no paper reconciliation',
        'Prize sequencing engine with winner registration UI',
        'CMS-style theme designer for self-service registration and raffle page customization',
        'Failure states handled: duplicate scan, invalid ticket, dropped connection',
        'Registration and token kiosks; attendee details, statistics, and participant management',
        'Deal or No Deal: 20 briefcase holders + Player of the Night + Pick A Name side raffle'
      ],
      children: ['reverse-bingo', 'dond'],
      childrenLabel: 'More from this platform',
      mediaFit: 'contain',
      carouselTall: true,
      images: [
        {
          type: 'video',
          src: 'assets/img/Portfolio Images/E-Raffle/1.mp4',
          poster: 'assets/img/Portfolio Images/E-Raffle/2.webp'
        },
        'assets/img/Portfolio Images/E-Raffle/2.webp',
        'assets/img/Portfolio Images/E-Raffle/3.webp',
        'assets/img/Portfolio Images/E-Raffle/4.webp'
      ]
    },
    {
      id: 'reverse-bingo',
      skipGrid: true,
      name: 'Reverse Bingo — Live Event Platform',
      shortDesc: 'Laravel + Vue live-event platform built for a 600-person corporate event — cards settle before the event, so game night never depends on the venue network',
      longDesc: 'Built at CDO Foodsphere for a 600-person corporate event. Cards are claimed and locked before the event, so game night needs only two or three browser clients. Online phones mark hits automatically; offline players use a PNG or installable PWA card and tap their own tally. The server stays authoritative: every draw is validated, eliminations are written in a transaction, and clients receive a revision-stamped broadcast, resyncing from a snapshot if they detect a gap. At registration close, attendance and raffle eligibility are frozen into a snapshot; the pot and the cut follow that set. The run of show spans six stages — prepare, distribute, close, play, crown, archive — with a desk playbook for re-issue and late entry. Host controls include draw, eliminate/restore, revert, and end, with a stage reveal for the champion. Screenshots are from test events; participant data is redacted.',
      techStack: ['Laravel', 'PHP', 'Vue 3', 'Inertia.js', 'Reverb (WebSockets)', 'SQL Server', 'Queue Worker', 'k6'],
      features: [
        'Built for a 600-person corporate event — cards are claimed and locked before game night',
        'Six-stage lifecycle: prepare, distribute, close, play, crown, archive',
        'Admin, host, stage, and claim surfaces; desk re-issue and late entry',
        'Game night needs only 2–3 browser clients: host, stage, and desk',
        'Two phone modes: automatic hits online; manual tally from a PNG or offline PWA card',
        'Server-authoritative draws with revision-stamped broadcasts and resync on a revision gap',
        'Registration close freezes attendance and eligibility; the pot and cut follow the snapshot',
        'Unique cards by signature; fail-closed cut for unlocked or ineligible cards',
        'Host controls: draw, eliminate/restore, revert, end; stage reveal for the champion',
        '287 tests / 1,668 assertions; k6 harness targeting p95 < 500 ms at 1,200 connections'
      ],
      mediaFit: 'contain',
      carouselTall: true,
      images: [
        'assets/img/Portfolio Images/Reverse Bingo/1.webp',
        'assets/img/Portfolio Images/Reverse Bingo/5.webp',
        'assets/img/Portfolio Images/Reverse Bingo/6.webp',
        'assets/img/Portfolio Images/Reverse Bingo/7.webp',
        'assets/img/Portfolio Images/Reverse Bingo/8.webp',
        'assets/img/Portfolio Images/Reverse Bingo/2.webp',
        'assets/img/Portfolio Images/Reverse Bingo/3.webp',
        'assets/img/Portfolio Images/Reverse Bingo/4.webp'
      ]
    },
    {
      id: 'dond',
      skipGrid: true,
      name: 'Deal or No Deal — Event Game',
      shortDesc: 'Event-day Deal or No Deal: 20 briefcase holders, a Player of the Night, and a Pick A Name side raffle, with remote stage control',
      longDesc: 'Built the Deal or No Deal event game into the Events Management platform. The stage draws 20 briefcase holders from the eligible time-in pool, then one Player of the Night; a Pick A Name side raffle, spin modes (All, One by one, Auto), respin/reset, participant sync, and remote stage control handle the run of show. The pool is fixed once holders are locked. Screenshots are from a test/demo event; participant names are redacted.',
      techStack: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'AJAX'],
      features: [
        '20 briefcase holders + Player of the Night from the eligible time-in pool',
        'Pick A Name side raffle with no repeats until the history is cleared or the round resets',
        'Spin modes: All, One by one, Auto; holder speed; respin/reset',
        'Participant-pool sync; holders lock the pool; late time-ins require a reset',
        'Remote stage control, fullscreen, sound, and a one-DOND-tab guard',
        'Stage reveal, winner overlay, and a completed-round photo state'
      ],
      mediaFit: 'contain',
      carouselTall: true,
      images: [
        'assets/img/Portfolio Images/Deal or No Deal/1.webp',
        'assets/img/Portfolio Images/Deal or No Deal/2.webp'
      ]
    },
    {
      id: 'ui-redesign',
      name: 'Enterprise UX Redesign — Internal Security & Admin Tools',
      shortDesc: 'Rebuilt three shipped enterprise screens — audit trail, MFA settings, and active users — around hierarchy, usability, and security-sensitive workflows',
      longDesc: 'Redesigned three production internal systems I maintain and support (complaint tracking, clinic, and business card management) around information hierarchy, usability, permissions, and security-sensitive workflows. Every screen has a before/after comparison and a live, clickable HTML mockup.',
      techStack: ['HTML5', 'CSS3', 'Design System', 'Figma', 'Information Architecture'],
      features: [
        'Before/after redesign of three shipped enterprise screens',
        'Shared component system: tokens, badges, tables, forms, states',
        'CCTR audit trail — scannable table with tabular numerals',
        'Clinic MFA settings — method-selection card clarifying the security tradeoff',
        'BizCard active users — roster with role filtering and status chips',
        'Live, clickable HTML mockups'
      ],
      link: { href: 'case-study-redesign.html', label: 'View full Enterprise UX Redesign case study' },
      images: [
        'assets/img/redesign/cctr-audit-trail.png',
        'assets/img/redesign/clinic-mfa-settings.png',
        'assets/img/redesign/bizcard-active-users.png'
      ]
    },
    {
      id: 'it-week',
      name: 'IT Week (Tech\'ka Muna!)',
      shortDesc: 'Led implementation — 500+ attendees, three original interactive web systems shipped to production in one month; leadership endorsed annual recurrence',
      longDesc: 'Led implementation for IT Week (Tech\'ka Muna!) with 500+ attendees at the P2 site. Game Developer & Tech Support Lead for the first company-wide IT week-long booth and game show. Leadership said the event should be annual because it made IT visible to the company. Featured three original web systems built for the event.',
      type: 'container',
      children: ['image-carousel', 'real-or-fake', 'iconic-memory'],
      childrenLabel: 'Systems Built for This Event',
      images: [
        {
          type: 'video',
          src: 'assets/img/Portfolio Images/IT Week/Overview/1.mp4',
          poster: 'assets/img/Portfolio Images/IT Week/Overview/2.webp'
        },
        'assets/img/Portfolio Images/IT Week/Overview/2.webp',
        'assets/img/Portfolio Images/IT Week/Overview/3.jpg',
        'assets/img/Portfolio Images/IT Week/Overview/4.jpg'
      ]
    },
    {
      id: 'clinic',
      name: 'Clinic Management System',
      shortDesc: 'Mapped clinic intake and records workflows \u2014 reduced manual data entry and improved data accuracy for staff and administrators',
      longDesc: 'Mapped clinic intake and records workflows and developed a clinic management system that reduced manual data entry and improved data accuracy for staff and administrators, supporting daily enterprise clinic operations.',
      techStack: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'AJAX'],
      features: [
        'Mapped intake and records workflows for staff and administrators',
        'Reduced manual data entry',
        'Improved data accuracy'
      ],
      images: []
    },
    {
      id: 'image-carousel',
      skipGrid: true,
      name: 'Smart TV-synced Image Carousel',
      shortDesc: 'Dual-storage gallery with 3-second AJAX sync to Smart TVs and an AI PhotoBooth (200+ photos) using Gemini AI',
      longDesc: 'Built a dual-storage gallery (Google Drive/Local) with 3-second AJAX sync deployed to Smart TVs during the first company-wide IT Week (Tech\'ka Muna!) with 500+ attendees. Uses a driver pattern architecture enabling seamless storage switching without code changes. Integrated an AI PhotoBooth pipeline using Gemini AI, automatically syncing photos from capture to display within 3-6 seconds; staff adopted the AI-generated photos as Gmail and Facebook profile pictures.',
      techStack: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'AJAX', 'Google Drive API'],
      features: [
        'Dual storage backend (Google Drive/Local) with driver pattern',
        'Real-time AJAX polling (3-second intervals) to Smart TVs',
        'AI PhotoBooth pipeline with Gemini AI (3-6 second sync)',
        'Deployed at company-wide IT Week event with 500+ attendees'
      ],
      images: [
        'assets/img/Portfolio Images/IT Week/PHOTOBOOTH/1.jpg',
        'assets/img/Portfolio Images/IT Week/PHOTOBOOTH/2.jpg',
        'assets/img/Portfolio Images/IT Week/PHOTOBOOTH/3.jpg'
      ]
    },
    {
      id: 'real-or-fake',
      skipGrid: true,
      name: 'Anti-cheat AI vs Real Detection Quiz',
      shortDesc: 'Interactive quiz with anti-cheat (shuffled questions) and admin CRUD, deployed at company-wide IT Week',
      longDesc: 'Created a session-based quiz game for the first company-wide IT Week where players identify AI-generated versus real media. Features session-based progression with cookie-persisted tokens, anti-cheat mechanism using composite database indexes to block repeat perfect-score attempts within 24 hours, random question rendering via PHP shuffle(), and an admin dashboard with full CRUD for image (25MB) and video (100MB) uploads.',
      techStack: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'AJAX'],
      features: [
        'Session-based progression with cookie-persisted tokens',
        'Anti-cheat mechanism (24-hour repeat attempt block)',
        'Admin dashboard with CRUD, image (25MB) and video (100MB) uploads',
        'Deployed at company-wide IT Week event'
      ],
      images: [
        'assets/img/Portfolio Images/IT Week/REALORFAKE/1.jpg',
        'assets/img/Portfolio Images/IT Week/REALORFAKE/2.jpg',
        'assets/img/Portfolio Images/IT Week/REALORFAKE/3.jpg',
        'assets/img/Portfolio Images/IT Week/REALORFAKE/4.jpg'
      ]
    },
    {
      id: 'iconic-memory',
      skipGrid: true,
      name: '6\u00d76 Memory Game with Live Leaderboard',
      shortDesc: '6x6 game with employee voiceovers, ranked #1 for engagement at company-wide IT Week, featuring millisecond timer, JSON session management, and real-time leaderboard',
      longDesc: 'Developed a 6\u00d76 cognitive training game featuring pre-recorded employee voiceovers and 3D tile flip animations, deployed at the first company-wide IT Week where it ranked #1 for engagement with 500+ unique players and 1,000+ sessions. Features millisecond-precision timer with score calculation (100 pts/match + time bonus), database-backed session management storing game state as JSON enabling pause/resume, and a real-time leaderboard with AJAX polling and department-based filtering. Includes comprehensive audio feedback (flip, match, wrong, completion sounds) and duplicate user prevention.',
      techStack: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'AJAX'],
      features: [
        '6\u00d76 grid with pre-recorded employee voiceovers',
        'Millisecond-precision timer with score calculation',
        'JSON-based session management with pause/resume',
        'Real-time leaderboard with AJAX polling and department filtering',
        'Ranked #1 for engagement at company-wide IT Week'
      ],
      images: [
        'assets/img/Portfolio Images/IT Week/ICONIC MATCH/1.jpg',
        'assets/img/Portfolio Images/IT Week/ICONIC MATCH/2.jpg',
        'assets/img/Portfolio Images/IT Week/ICONIC MATCH/3.jpg',
        'assets/img/Portfolio Images/IT Week/ICONIC MATCH/4.jpg'
      ]
    }
  ];

  var grid = document.getElementById('systems-grid');
  var explorationGrid = document.getElementById('exploration-grid');
  var overlay = document.getElementById('modal-overlay');
  var modal = document.getElementById('modal');
  var closeBtn = document.getElementById('modal-close');
  var carouselTrack = document.getElementById('carousel-track');
  var carouselDots = document.getElementById('carousel-dots');
  var modalTitle = document.getElementById('modal-title');
  var modalDesc = document.getElementById('modal-description');
  var modalDetails = document.getElementById('modal-details');

  var currentSlide = 0;
  var lightboxImages = [];
  var lightboxIndex = 0;

  var lazyCards = [];
  var gridCounts = { systems: 0, exploration: 0 };
  var CARD_PLACEHOLDER = 'linear-gradient(135deg, #1f2937 0%, #111827 100%)';

  systemsData.forEach(function (sys) {
    if (sys.skipGrid) return;
    var isExploration = sys.section === 'exploration';
    var targetGrid = isExploration ? explorationGrid : grid;
    if (!targetGrid) targetGrid = grid;
    var card = document.createElement('div');
    card.className = 'system-card';
    card.style.backgroundImage = CARD_PLACEHOLDER;
    var first = sys.images && sys.images.length ? sys.images[0] : null;
    var fallbackBg = sys.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    var cardBg;
    if (!first) {
      cardBg = cssBg(fallbackBg);
    } else if (mediaType(first) === 'video') {
      cardBg = cssBg(mediaPoster(first) || fallbackBg);
    } else {
      cardBg = cssBg(mediaSrc(first));
    }
    card.setAttribute('data-bg', cardBg);
    card.setAttribute('data-system-id', sys.id);
    card.innerHTML = '<div class="system-card-overlay">' +
      (sys.badge ? '<span class="system-card-badge">' + sys.badge + '</span>' : '') +
      '<h3>' + sys.name + '</h3><p>' + sys.shortDesc + '</p></div>';
    card.addEventListener('click', function () {
      openModal(sys.id);
    });
    targetGrid.appendChild(card);

    // The first row of each grid starts loading right away; the rest wait
    // until they are near the viewport. Every card keeps its placeholder
    // gradient until the real image has actually decoded.
    var gridKey = isExploration ? 'exploration' : 'systems';
    if (gridCounts[gridKey] < 3) {
      applyCardBg(card);
    } else {
      lazyCards.push(card);
    }
    gridCounts[gridKey]++;
  });

  function applyCardBg(card) {
    var bg = card.getAttribute('data-bg');
    if (!bg) return;
    card.removeAttribute('data-bg');

    var match = bg.match(/url\(['"]?([^'")]+)['"]?\)/);
    if (!match) {
      card.style.backgroundImage = bg;
      return;
    }

    var preload = new Image();
    preload.onload = function () {
      card.style.backgroundImage = bg;
    };
    preload.src = match[1];
  }

  if ('IntersectionObserver' in window) {
    var cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          applyCardBg(entry.target);
          cardObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '800px 0px' });
    lazyCards.forEach(function (card) { cardObserver.observe(card); });
  } else {
    lazyCards.forEach(applyCardBg);
  }

  function buildCarousel(sys) {
    var images = sys.images || [];
    var fit = sys.mediaFit || 'cover';
    var modalCarousel = document.getElementById('modal-carousel');
    modalCarousel.classList.toggle('modal-carousel-tall', !!sys.carouselTall);
    carouselTrack.innerHTML = '';
    carouselDots.innerHTML = '';
    currentSlide = 0;

    images.forEach(function (item, i) {
      var slide = document.createElement('div');
      slide.className = 'carousel-slide';

      var expandBtn = document.createElement('button');
      expandBtn.className = 'carousel-expand-btn';
      expandBtn.innerHTML = '&#9974;';
      expandBtn.setAttribute('aria-label', 'View full size');
      expandBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        openLightbox(images, i);
      });
      slide.appendChild(expandBtn);

      if (mediaType(item) === 'video') {
        slide.classList.add('carousel-slide-video');
        var video = document.createElement('video');
        video.className = 'carousel-video';
        video.src = mediaSrc(item);
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        if (mediaPoster(item)) video.poster = mediaPoster(item);
        slide.appendChild(video);

        var playBtn = document.createElement('button');
        playBtn.className = 'carousel-play-btn';
        playBtn.innerHTML = '&#9654;';
        playBtn.setAttribute('aria-label', 'Play video');
        slide.appendChild(playBtn);

        var isPlaying = false;
        function togglePlay() {
          if (isPlaying) {
            video.pause();
            playBtn.style.display = 'flex';
          } else {
            video.play();
            playBtn.style.display = 'none';
          }
          isPlaying = !isPlaying;
        }

        playBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          togglePlay();
        });

        video.addEventListener('click', function (e) {
          e.stopPropagation();
          togglePlay();
        });

        video.addEventListener('ended', function () {
          isPlaying = false;
          playBtn.style.display = 'flex';
        });
      } else {
        slide.style.backgroundImage = cssBg(mediaSrc(item));
        slide.style.backgroundSize = fit;
      }

      slide.addEventListener('click', function () {
        openLightbox(images, i);
      });
      carouselTrack.appendChild(slide);

      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', function () {
        goToSlide(i);
      });
      carouselDots.appendChild(dot);
    });

    carouselTrack.style.transform = 'translateX(0)';
  }

  function goToSlide(index) {
    currentSlide = index;
    var offset = -index * 100;
    carouselTrack.style.transform = 'translateX(' + offset + '%)';

    var slides = carouselTrack.querySelectorAll('.carousel-slide');
    slides.forEach(function (s, i) {
      if (i !== index) {
        var v = s.querySelector('video');
        if (v) { v.pause(); v.currentTime = 0; }
        var b = s.querySelector('.carousel-play-btn');
        if (b) b.style.display = 'flex';
      }
    });

    var dots = carouselDots.querySelectorAll('.carousel-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === index);
    });
  }

  function openModal(id) {
    var sys = systemsData.find(function (s) { return s.id === id; });
    if (!sys) return;

    var modalCarousel = document.getElementById('modal-carousel');
    modalCarousel.classList.remove('modal-carousel-tall');
    if (sys.images && sys.images.length) {
      modal.classList.remove('no-carousel');
      modalCarousel.style.display = '';
      buildCarousel(sys);
    } else {
      modal.classList.add('no-carousel');
      modalCarousel.style.display = 'none';
      carouselTrack.innerHTML = '';
      carouselDots.innerHTML = '';
    }
    modalTitle.textContent = sys.name;
    modalDesc.textContent = sys.longDesc;
    modalDetails.innerHTML = '';

    var detailsHtml = '';
    if (sys.techStack && sys.techStack.length) {
      detailsHtml += '<h4>Tech Stack</h4><div class="tech-tags">';
      sys.techStack.forEach(function (t) {
        detailsHtml += '<span class="tech-tag">' + t + '</span>';
      });
      detailsHtml += '</div>';
    }
    if (sys.features && sys.features.length) {
      detailsHtml += '<h4>Key Features</h4><ul class="feature-list">';
      sys.features.forEach(function (f) {
        detailsHtml += '<li>' + f + '</li>';
      });
      detailsHtml += '</ul>';
    }
    if (sys.link) {
      detailsHtml += '<a class="btn btn-outline modal-link" href="' + sys.link.href + '">' + sys.link.label + '</a>';
    }
    modalDetails.innerHTML = detailsHtml;

    if (sys.children && sys.children.length) {
      var subHeading = document.createElement('h4');
      subHeading.textContent = sys.childrenLabel || 'Related Systems';
      modalDetails.appendChild(subHeading);
      var subList = document.createElement('div');
      subList.className = 'subsystem-list';
      sys.children.forEach(function (childId) {
        var child = systemsData.find(function (s) { return s.id === childId; });
        if (!child) return;
        var item = document.createElement('div');
        item.className = 'subsystem-card';
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.innerHTML = '<h5>' + child.name + '</h5><p>' + child.shortDesc + '</p>';
        item.addEventListener('click', function () {
          openModal(child.id);
        });
        item.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(child.id);
          }
        });
        subList.appendChild(item);
      });
      modalDetails.appendChild(subList);
    }

    overlay.classList.add('open');
    modal.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!overlay.classList.contains('open')) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  var lightboxEl = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightbox-image');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxPrev = document.getElementById('lightbox-prev');
  var lightboxNext = document.getElementById('lightbox-next');
  var lightboxCounter = document.getElementById('lightbox-counter');

  function openLightbox(images, index) {
    lightboxImages = images;
    lightboxIndex = index;
    showLightboxSlide();
    lightboxEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function showLightboxSlide() {
    var item = lightboxImages[lightboxIndex];
    lightboxImage.innerHTML = '';
    lightboxImage.style.backgroundImage = '';

    if (mediaType(item) === 'video') {
      lightboxImage.classList.add('lightbox-video-container');
      var video = document.createElement('video');
      video.className = 'lightbox-video';
      video.src = mediaSrc(item);
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      if (mediaPoster(item)) video.poster = mediaPoster(item);
      lightboxImage.appendChild(video);
    } else {
      lightboxImage.classList.remove('lightbox-video-container');
      lightboxImage.style.backgroundImage = cssBg(mediaSrc(item));
    }

    lightboxCounter.textContent = (lightboxIndex + 1) + ' / ' + lightboxImages.length;
  }

  function closeLightbox() {
    lightboxEl.classList.remove('open');
    lightboxImage.innerHTML = '';
    lightboxImage.style.backgroundImage = '';
    lightboxImage.classList.remove('lightbox-video-container');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);

  lightboxEl.addEventListener('click', function (e) {
    if (e.target === lightboxEl) closeLightbox();
  });

  lightboxPrev.addEventListener('click', function () {
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    showLightboxSlide();
  });

  lightboxNext.addEventListener('click', function () {
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    showLightboxSlide();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightboxEl.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length; showLightboxSlide(); }
    if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % lightboxImages.length; showLightboxSlide(); }
  });

  var contactIcons = document.querySelectorAll('.contact-icon');
  var activeCallout = null;

  contactIcons.forEach(function (icon) {
    icon.addEventListener('click', function (e) {
      e.stopPropagation();
      var callout = icon.querySelector('.callout');
      if (!callout) return;

      if (activeCallout && activeCallout !== callout) {
        activeCallout.classList.remove('open');
      }

      callout.classList.toggle('open');
      activeCallout = callout.classList.contains('open') ? callout : null;
    });
  });

  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      return true;
    }
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch (e) {
      document.body.removeChild(ta);
      return false;
    }
  }

  document.querySelectorAll('.callout-text').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      var text = el.textContent;
      copyToClipboard(text);
      el.classList.add('copied');

      var feedback = document.createElement('div');
      feedback.className = 'copy-feedback';
      feedback.textContent = 'Copied';
      feedback.style.left = e.clientX + 'px';
      feedback.style.top = e.clientY + 'px';
      document.body.appendChild(feedback);

      setTimeout(function () {
        if (feedback.parentNode) feedback.parentNode.removeChild(feedback);
      }, 800);

      setTimeout(function () {
        el.classList.remove('copied');
      }, 800);
    });
  });

  document.addEventListener('click', function () {
    if (activeCallout) {
      activeCallout.classList.remove('open');
      activeCallout = null;
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && activeCallout) {
      activeCallout.classList.remove('open');
      activeCallout = null;
    }
  });

  var RESUME_VARIANTS = {
    ai: {
      pdf: 'assets/resume/Jonrich_Bascug_AI_Engineer.pdf',
      file: 'Jonrich_Bascug_AI_Engineer.pdf',
      label: 'AI Application Engineer'
    },
    fullstack: {
      pdf: 'assets/resume/Jonrich_Bascug_Fullstack.pdf',
      file: 'Jonrich_Bascug_Fullstack.pdf',
      label: 'Full-Stack'
    }
  };

  var resumeOverlay = document.getElementById('resume-overlay');
  var resumeModal = document.getElementById('resume-modal');
  var resumeClose = document.getElementById('resume-modal-close');
  var resumeIframe = document.getElementById('resume-iframe');
  var resumeDownload = document.getElementById('resume-download');
  var resumeOpen = document.getElementById('resume-open');
  var resumeTabs = Array.prototype.slice.call(document.querySelectorAll('.resume-tab'));
  var resumeTriggers = Array.prototype.slice.call(document.querySelectorAll('[data-resume]'));
  var resumeTrigger = null;

  if (resumeOverlay && resumeModal && resumeClose && resumeIframe && resumeDownload && resumeOpen) {
    var setResumeVariant = function (variant) {
      var data = RESUME_VARIANTS[variant] || RESUME_VARIANTS.ai;
      var key = RESUME_VARIANTS[variant] ? variant : 'ai';

      resumeTabs.forEach(function (tab) {
        var active = tab.getAttribute('data-resume-variant') === key;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      resumeIframe.title = 'Jonrich Bascug — ' + data.label + ' resume';
      resumeIframe.src = data.pdf + '#view=FitH';
      resumeDownload.href = data.pdf;
      resumeDownload.setAttribute('download', data.file);
      resumeDownload.setAttribute('aria-label', 'Download ' + data.label + ' PDF');
      resumeOpen.href = data.pdf;
      resumeOpen.setAttribute('aria-label', 'Open ' + data.label + ' PDF in a new tab');
    };

    var openResume = function (variant, trigger) {
      resumeTrigger = trigger || document.activeElement;
      setResumeVariant(variant);
      resumeOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(function () {
        resumeClose.focus();
      }, 0);
    };

    var closeResume = function () {
      if (!resumeOverlay.classList.contains('open')) return;
      resumeOverlay.classList.remove('open');
      document.body.style.overflow = '';
      if (resumeTrigger && typeof resumeTrigger.focus === 'function') {
        resumeTrigger.focus();
      }
      resumeTrigger = null;
    };

    resumeTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        openResume(trigger.getAttribute('data-resume'), trigger);
      });
    });

    resumeTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        setResumeVariant(tab.getAttribute('data-resume-variant'));
      });
    });

    resumeClose.addEventListener('click', closeResume);

    resumeOverlay.addEventListener('click', function (e) {
      if (e.target === resumeOverlay) closeResume();
    });

    document.addEventListener('keydown', function (e) {
      if (!resumeOverlay.classList.contains('open')) return;

      if (e.key === 'Escape') {
        closeResume();
        return;
      }

      if (e.key === 'Tab') {
        var focusables = resumeModal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        var first = focusables[0];
        var last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    document.addEventListener('focusin', function (e) {
      if (resumeOverlay.classList.contains('open') && !resumeModal.contains(e.target)) {
        resumeClose.focus();
      }
    });
  }
})();
