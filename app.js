/**
 * WEBMINT APP INTERACTIVE CONTROLLER
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // ----------------------------------------------------
  // 0. HIGH-OCTANE KINETIC FLASH PRELOADER CONTROLLER
  // ----------------------------------------------------
  const preloader = document.getElementById('sitePreloader');
  const shockwave = document.getElementById('kineticShockwave');
  const gridFlash = document.querySelector('.kinetic-grid-flash');
  const kLogoStage = document.getElementById('kLogoStage');

  const wordIds = ['kWord1', 'kWord2', 'kWord3', 'kWord4'];

  if (preloader) {
    let wordIndex = 0;

    function triggerKineticSequence() {
      if (wordIndex < wordIds.length) {
        // Clear previous word exit class
        if (wordIndex > 0) {
          const prevWord = document.getElementById(wordIds[wordIndex - 1]);
          if (prevWord) {
            prevWord.classList.remove('active');
            prevWord.classList.add('exit');
          }
        }

        // Activate current word
        const currentWord = document.getElementById(wordIds[wordIndex]);
        if (currentWord) {
          currentWord.classList.add('active');
        }

        // Trigger subtle background grid flash
        if (gridFlash) {
          gridFlash.classList.add('active');
          setTimeout(() => gridFlash.classList.remove('active'), 80);
        }

        wordIndex++;
        setTimeout(triggerKineticSequence, 140); // Rapid word flash every 140ms
      } else {
        // Transition to Final Huge Logo Slam
        const lastWord = document.getElementById(wordIds[wordIds.length - 1]);
        if (lastWord) {
          lastWord.classList.remove('active');
          lastWord.classList.add('exit');
        }

        // Trigger Shockwave Expansion & Logo Slam
        if (shockwave) shockwave.classList.add('flash');
        if (kLogoStage) kLogoStage.classList.add('active');

        // Fast Exit to Page Hero
        setTimeout(() => {
          preloader.classList.add('loaded');
          document.body.classList.add('hero-animated');
        }, 380);
      }
    }

    // Start sequence instantly
    setTimeout(triggerKineticSequence, 80);
  } else {
    document.body.classList.add('hero-animated');
  }

  // ----------------------------------------------------
  // 1. CUSTOM MAGNETIC CURSOR
  // ----------------------------------------------------
  const cursor = document.getElementById('customCursor');
  const follower = document.getElementById('cursorFollower');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (cursor && follower) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;

      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;

      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover expand effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .portfolio-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        follower.style.width = '54px';
        follower.style.height = '54px';
        follower.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
      });
      el.addEventListener('mouseleave', () => {
        follower.style.width = '36px';
        follower.style.height = '36px';
        follower.style.backgroundColor = 'transparent';
      });
    });
  }

  // ----------------------------------------------------
  // 2. HEADER SCROLL & THEME TOGGLE
  // ----------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('webmint-theme', isDark ? 'dark' : 'light');
  });

  // Restore Theme Preference
  const savedTheme = localStorage.getItem('webmint-theme');
  if (savedTheme === 'dark') {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
  }

  // ----------------------------------------------------
  // 3. MOBILE MENU DRAWER
  // ----------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => mobileDrawer.classList.add('active'));
    drawerCloseBtn.addEventListener('click', () => mobileDrawer.classList.remove('active'));
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => mobileDrawer.classList.remove('active'));
    });
  }

  // ----------------------------------------------------
  // 4. STRATEGY CALL BOOKING MODAL
  // ----------------------------------------------------
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openBookingBtns = document.querySelectorAll('.open-booking-btn');
  const preferredDateInput = document.getElementById('preferredDate');

  // Set default date to tomorrow
  if (preferredDateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    preferredDateInput.value = tomorrow.toISOString().split('T')[0];
    preferredDateInput.min = new Date().toISOString().split('T')[0];
  }

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  window.closeBookingModal = function () {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
      document.getElementById('modalFormView').classList.remove('hidden');
      document.getElementById('modalSuccessView').classList.add('hidden');
    }, 400);
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeBookingModal);
  }

  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
      closeBookingModal();
    }
  });

  window.handleBookingSubmit = function (e) {
    e.preventDefault();
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;

    document.getElementById('successName').textContent = name || 'Friend';
    document.getElementById('successEmail').textContent = email || 'your email';

    document.getElementById('modalFormView').classList.add('hidden');
    document.getElementById('modalSuccessView').classList.remove('hidden');

    // Trigger Confetti Celebration
    if (window.confetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // ----------------------------------------------------
  // 5. PORTFOLIO FILTER TABS
  // ----------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });

  // ----------------------------------------------------
  // 6. ANIMATED IMPACT STATS COUNTER
  // ----------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.dataset.target, 10);
          const prefix = stat.dataset.prefix || '';
          const suffix = stat.dataset.suffix || '';
          let current = 0;
          const duration = 1800; // ms
          const stepTime = Math.abs(Math.floor(duration / target));

          const timer = setInterval(() => {
            current += 1;
            stat.textContent = `${prefix}${current}${suffix}`;
            if (current >= target) {
              clearInterval(timer);
              stat.textContent = `${prefix}${target}${suffix}`;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ----------------------------------------------------
  // 7. SCROLL REVEAL ANIMATION OBSERVER
  // ----------------------------------------------------
  const revealElements = document.querySelectorAll('.service-card, .portfolio-card, .process-step-card, .impact-callout, .testimonial-card, .bottom-cta-card');
  revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));
});
