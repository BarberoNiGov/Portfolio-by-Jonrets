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
      id: 'ui-redesign',
      name: 'UI Redesign — Internal Security & Admin Tools',
      shortDesc: 'Rebuilt three shipped enterprise screens in a modern component system — audit trail, MFA settings, and active users',
      longDesc: 'Redesigned three real internal systems I maintain and support (complaint tracking, clinic, and business card management) in a modern component language: consistent density, calmer chrome, clearer hierarchy, and a legible security-vs-friction tradeoff. Every screen has a before/after comparison and a live, clickable HTML mockup.',
      techStack: ['HTML5', 'CSS3', 'Design System', 'Figma', 'Information Architecture'],
      features: [
        'Before/after redesign of three shipped enterprise screens',
        'Shared component system: tokens, badges, tables, forms, states',
        'CCTR audit trail — scannable table with tabular numerals',
        'Clinic MFA settings — method-selection card clarifying the security tradeoff',
        'BizCard active users — roster with role filtering and status chips',
        'Live, clickable HTML mockups'
      ],
      link: { href: 'case-study-redesign.html', label: 'View full UI Redesign case study' },
      images: [
        'assets/img/redesign/cctr-audit-trail.png',
        'assets/img/redesign/clinic-mfa-settings.png',
        'assets/img/redesign/bizcard-active-users.png'
      ]
    },
    {
      id: 'e-raffle',
      name: 'Event Management + E-Raffle System',
      shortDesc: 'Replacing manual tickets for a whole workforce with a self-service event system',
      longDesc: 'Company events required designing and physically cutting raffle and attendance tickets for the entire workforce, and check-in was manual and slow. I designed the in/out flow across two plant sites and shipped a session-based event system: timestamped eligibility rules that block duplicate and late entries, a live participant dashboard for real-time turnout instead of paper reconciliation, prize sequencing with winner registration, and a CMS-style theme designer that lets non-technical staff customize registration and raffle pages themselves. Designed for bursts of simultaneous check-ins on event day.',
      techStack: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'AJAX'],
      features: [
        'Automated event in/out + E-Raffle — removed manual ticket design and cutting',
        'Timestamped eligibility rules (blocks duplicate and late entries)',
        'Live participant dashboard — real-time turnout, no paper reconciliation',
        'Prize sequencing engine with winner registration UI',
        'CMS-style theme designer for self-service registration and raffle page customization',
        'Failure states handled: duplicate scan, invalid ticket, dropped connection'
      ],
      images: [
        {
          type: 'video',
          src: 'assets/img/Portfolio Images/E-Raffle/1.mp4',
          poster: 'assets/img/Portfolio Images/E-Raffle/2.jpeg'
        },
        'assets/img/Portfolio Images/E-Raffle/2.jpeg'
      ]
    },
    {
      id: 'it-week',
      name: 'IT Week (Tech\'ka Muna!)',
      shortDesc: 'Led implementation, 500+ attendees at P2 site — three original interactive web systems, leadership endorsed annual recurrence',
      longDesc: 'Led implementation for IT Week (Tech\'ka Muna!) with 500+ attendees at the P2 site. Game Developer & Tech Support Lead for the first company-wide IT week-long booth and game show. Leadership said the event should be annual because it made IT visible to the company. Featured three original web systems built for the event.',
      type: 'container',
      children: ['image-carousel', 'real-or-fake', 'iconic-memory'],
      images: [
        {
          type: 'video',
          src: 'assets/img/Portfolio Images/IT Week/Overview/1.mp4',
          poster: 'assets/img/Portfolio Images/IT Week/Overview/2.jpg'
        },
        'assets/img/Portfolio Images/IT Week/Overview/2.jpg',
        'assets/img/Portfolio Images/IT Week/Overview/3.jpg',
        'assets/img/Portfolio Images/IT Week/Overview/4.jpg'
      ]
    },
    {
      id: 'vapt',
      name: 'Post-Incident Security Hardening (VAPT Mitigation)',
      shortDesc: 'Adding MFA, lockouts, and audit logging across five systems without making daily life worse',
      longDesc: 'After an incident, five internal systems (CMS, MES-OEE, ePaySlip, CCTR, BizCard) carried 100+ vulnerabilities from legacy dependencies. New controls were mandatory, but security controls add friction and friction creates workarounds. I led the hardening program and designed the login and MFA experience: Email OTP + Authenticator (including a mode for deskless and shared-terminal staff), auto-lock after 3 failed attempts tuned against support-ticket load, password expiry with proactive messaging instead of surprise lockouts, and Spatie audit logging that stays invisible to users but gives admins a full trail.',
      techStack: ['Laravel', 'PHP', 'MySQL', 'MFA (Email OTP + Authenticator)', 'Spatie Audit Logging', 'OWASP / npm audit'],
      features: [
        'Remediated 100+ vulnerabilities across five legacy internal systems',
        'MFA (Email OTP + Authenticator) with a mode for deskless/shared-terminal staff',
        'Auto-lock after 3 failed attempts — tuned against support-ticket load',
        'Password expiry with proactive messaging, not surprise lockouts',
        'Spatie audit logging: invisible to users, full trail for admins',
        'Closed critical vulnerabilities and passed security review'
      ],
      images: []
    },
    {
      id: 'cctr',
      name: 'Customer Complaint Tracking System (CCTR)',
      shortDesc: 'Complaint dashboard with multi-dimension filters, analysis charts, and AI data analysis',
      longDesc: 'CCTR records and tracks customer complaints end to end. I maintain and support the system and added dashboard and analysis features: multi-dimension complaint filters, KPI summaries, and analysis charts. Its AI data analysis view summarizes complaint records, surfaces trends, suggests likely root causes, and answers natural-language questions about the data. The system also includes account security screens — MFA settings, login history, audit trail, and active users — used to monitor and protect access.',
      techStack: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'AJAX', 'AI Data Analysis'],
      features: [
        'Dashboard with multi-dimension complaint filters',
        'KPI summaries — total complaints received and valid plant-related (VPR) share',
        'Analysis charts — monthly complaint trend and VPR vs. VNPR',
        'AI data analysis: summarizes records, detects trends, suggests root causes, and answers natural-language questions',
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
      id: 'clinic',
      name: 'Clinic Management System',
      shortDesc: 'Optimized clinic workflows \u2014 reduced manual data entry and improved data accuracy across administrative and clinical teams',
      longDesc: 'Optimized clinic workflows by reducing manual data entry and improving data accuracy across administrative and clinical teams, supporting daily enterprise clinic operations.',
      techStack: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'AJAX'],
      features: [
        'Optimized clinic workflows across administrative and clinical teams',
        'Reduced manual data entry',
        'Improved data accuracy'
      ],
      images: []
    },
    {
      id: 'image-carousel',
      skipGrid: true,
      name: 'Image Carousel Display System',
      shortDesc: 'Dual-storage gallery with 3-second AJAX sync to Smart TVs and AI PhotoBooth integration using Gemini AI',
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
      name: 'Real Or Fake \u2013 AI Detection Quiz',
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
      name: 'Icon-ic Memory Matching Game',
      shortDesc: '6x6 game with employee voiceovers, ranked #1 for engagement at company-wide IT Week, featuring millisecond timer, JSON session management, and real-time leaderboard',
      longDesc: 'Developed a 6\u00d76 cognitive training game featuring pre-recorded employee voiceovers and 3D tile flip animations, deployed at the first company-wide IT Week where it ranked #1 for engagement. Features millisecond-precision timer with score calculation (100 pts/match + time bonus), database-backed session management storing game state as JSON enabling pause/resume, and a real-time leaderboard with AJAX polling and department-based filtering. Includes comprehensive audio feedback (flip, match, wrong, completion sounds) and duplicate user prevention.',
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

  systemsData.forEach(function (sys) {
    if (sys.skipGrid) return;
    var card = document.createElement('div');
    card.className = 'system-card';
    var first = sys.images && sys.images.length ? sys.images[0] : null;
    if (!first) {
      card.style.backgroundImage = cssBg('linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
    } else if (mediaType(first) === 'video') {
      card.style.backgroundImage = cssBg(mediaPoster(first) || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
    } else {
      card.style.backgroundImage = cssBg(mediaSrc(first));
    }
    card.setAttribute('data-system-id', sys.id);
    card.innerHTML = '<div class="system-card-overlay"><h3>' + sys.name + '</h3><p>' + sys.shortDesc + '</p></div>';
    card.addEventListener('click', function () {
      openModal(sys.id);
    });
    grid.appendChild(card);
  });

  function buildCarousel(images) {
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
    if (sys.images && sys.images.length) {
      modal.classList.remove('no-carousel');
      modalCarousel.style.display = '';
      buildCarousel(sys.images);
    } else {
      modal.classList.add('no-carousel');
      modalCarousel.style.display = 'none';
      carouselTrack.innerHTML = '';
      carouselDots.innerHTML = '';
    }
    modalTitle.textContent = sys.name;
    modalDesc.textContent = sys.longDesc;
    modalDetails.innerHTML = '';

    if (sys.type === 'container') {
      var subHeading = document.createElement('h4');
      subHeading.textContent = 'Systems Built for This Event';
      modalDetails.appendChild(subHeading);
      var subList = document.createElement('div');
      subList.className = 'subsystem-list';
      sys.children.forEach(function (childId) {
        var child = systemsData.find(function (s) { return s.id === childId; });
        if (!child) return;
        var item = document.createElement('div');
        item.className = 'subsystem-card';
        item.innerHTML = '<h5>' + child.name + '</h5><p>' + child.shortDesc + '</p>';
        item.addEventListener('click', function () {
          openModal(child.id);
        });
        subList.appendChild(item);
      });
      modalDetails.appendChild(subList);
    } else {
      var techHtml = '<h4>Tech Stack</h4><div class="tech-tags">';
      sys.techStack.forEach(function (t) {
        techHtml += '<span class="tech-tag">' + t + '</span>';
      });
      techHtml += '</div>';

      var featHtml = '<h4>Key Features</h4><ul class="feature-list">';
      sys.features.forEach(function (f) {
        featHtml += '<li>' + f + '</li>';
      });
      featHtml += '</ul>';

      var linkHtml = '';
      if (sys.link) {
        linkHtml = '<a class="btn btn-outline modal-link" href="' + sys.link.href + '">' + sys.link.label + '</a>';
      }

      modalDetails.innerHTML = techHtml + featHtml + linkHtml;
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
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
})();
