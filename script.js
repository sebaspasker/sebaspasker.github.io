'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const panels = document.querySelectorAll('.panel');

  const prefersReducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  if (prefersReducedMotion) {
    panels.forEach((panel) => {
      panel.style.setProperty('--reveal-progress', '1');
      panel.classList.add('visible');
    });
  } else if (panels.length) {
    panels.forEach((panel) => {
      panel.style.setProperty('--reveal-progress', '0');
    });

    let activePanel = null;
    let scheduled = false;

    const updatePanels = () => {
      scheduled = false;
      const viewportCenter = window.innerHeight / 2;
      const maxDistance = window.innerHeight * 0.8 || 1;
      let nextActive = panels[0];
      let bestProgress = -1;
      const progressMap = new Map();

      panels.forEach((panel) => {
        const rect = panel.getBoundingClientRect();
        const panelCenter = rect.top + rect.height / 2;
        const distance = Math.abs(panelCenter - viewportCenter);
        const normalized = Math.min(distance / maxDistance, 1);
        const linearProgress = Math.max(0, 1 - normalized);
        const easedProgress = linearProgress === 0
          ? 0
          : Math.pow(linearProgress, 0.35);

        progressMap.set(panel, easedProgress);
        panel.style.setProperty('--reveal-progress', easedProgress.toFixed(3));

        if (easedProgress > bestProgress) {
          bestProgress = easedProgress;
          nextActive = panel;
        }
      });

      if (activePanel !== nextActive) {
        activePanel = nextActive;
        panels.forEach((panel) => {
          panel.classList.toggle('visible', panel === activePanel);
        });
      }

      if (activePanel) {
        const activeProgress = progressMap.get(activePanel);
        if (typeof activeProgress === 'number' && activeProgress < 0.999) {
          activePanel.style.setProperty('--reveal-progress', '1');
        }
      }
    };

    const scheduleUpdate = () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(updatePanels);
      }
    };

    updatePanels();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
  }

  const intro = document.getElementById('intro');
  if (intro) {
    const prefix = "Hello, I'm ";
    const roles = [
      'Sebastian Pasker',
      'a backend developer',
      'a Linux specialist'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeLoop = () => {
      const current = `${prefix}${roles[roleIndex]}`;
      intro.textContent = current.slice(0, charIndex);

      if (!deleting) {
        if (charIndex < current.length) {
          charIndex += 1;
          setTimeout(typeLoop, 100);
        } else {
          deleting = true;
          setTimeout(typeLoop, 2000);
        }
      } else if (charIndex > prefix.length) {
        charIndex -= 1;
        setTimeout(typeLoop, 50);
      } else {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeLoop, 500);
      }
    };

    typeLoop();
  }

  const nav = document.querySelector('.nav-index');
  const toggleBtn = document.getElementById('menu-toggle');
  const navLinks = nav ? nav.querySelectorAll('a') : [];

  if (nav && toggleBtn) {
    toggleBtn.addEventListener('click', () => nav.classList.toggle('open'));
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (nav) {
        nav.classList.remove('open');
      }
    });
  });

  const linkMap = new Map();
  navLinks.forEach((link) => {
    const target = link.getAttribute('href');
    if (target && target.startsWith('#')) {
      linkMap.set(target.slice(1), link);
    }
  });

  const firstLink = navLinks[0];
  if (firstLink) {
    firstLink.classList.add('active');
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        linkMap.forEach((navLink) => navLink.classList.remove('active'));
        const current = linkMap.get(entry.target.id);
        if (current) {
          current.classList.add('active');
        }
      }
    });
  }, { threshold: 0.6 });

  linkMap.forEach((_, id) => {
    const section = document.getElementById(id);
    if (section) {
      sectionObserver.observe(section);
    }
  });

  const setupCarousel = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section) {
      return;
    }

    const carouselView = section.querySelector('.carousel-view');
    const carousel = carouselView ? carouselView.querySelector('.carousel') : null;
    const dotsContainer = document.getElementById(`${sectionId}-dots`);
    const wrapper = section.querySelector('.carousel-wrapper');
    const leftArrow = section.querySelector('.arrow.left');
    const rightArrow = section.querySelector('.arrow.right');

    if (!carouselView || !carousel || !dotsContainer || !wrapper || !leftArrow || !rightArrow) {
      return;
    }

    const items = Array.from(carousel.querySelectorAll('.item'));
    if (!items.length) {
      return;
    }

    dotsContainer.innerHTML = '';
    let index = 0;
    let dots = [];

    const normalizeIndex = (value) => {
      const total = items.length;
      return ((value % total) + total) % total;
    };

    const updateDots = () => {
      dots.forEach((dotElement, dotIndex) => {
        dotElement.classList.toggle('active', dotIndex === index);
      });
    };

    const prefersReducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false };

    const scrollToItem = (targetIndex) => {
      const targetItem = items[targetIndex];
      if (!targetItem) {
        return;
      }

      const targetLeft = targetItem.offsetLeft;
      if (prefersReducedMotion.matches || typeof carouselView.scrollTo !== 'function') {
        carouselView.scrollLeft = targetLeft;
      } else {
        carouselView.scrollTo({ left: targetLeft, behavior: 'smooth' });
      }
    };

    const setActiveIndex = (targetIndex, { scroll = true } = {}) => {
      index = normalizeIndex(targetIndex);
      if (scroll) {
        scrollToItem(index);
      }
      updateDots();
    };

    items.forEach((_, itemIndex) => {
      const dot = document.createElement('span');
      dot.className = 'dot';
      dot.addEventListener('click', () => {
        setActiveIndex(itemIndex);
      });
      dotsContainer.appendChild(dot);
    });

    dots = Array.from(dotsContainer.querySelectorAll('.dot'));

    const findClosestIndex = () => {
      let closestIndex = 0;
      let closestDistance = Infinity;
      const viewportCenter = carouselView.scrollLeft + (carouselView.clientWidth / 2);

      items.forEach((item, itemIndex) => {
        const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
        const distance = Math.abs(itemCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = itemIndex;
        }
      });

      return closestIndex;
    };

    leftArrow.addEventListener('click', () => {
      setActiveIndex(index - 1);
    });

    rightArrow.addEventListener('click', () => {
      setActiveIndex(index + 1);
    });

    wrapper.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        setActiveIndex(index - 1);
      } else if (event.key === 'ArrowRight') {
        setActiveIndex(index + 1);
      }
    });

    carouselView.addEventListener('scroll', () => {
      const newIndex = findClosestIndex();
      if (newIndex !== index) {
        setActiveIndex(newIndex, { scroll: false });
      }
    });

    window.addEventListener('resize', () => {
      setActiveIndex(index);
    });

    setActiveIndex(0, { scroll: false });
  };

  setupCarousel('projects');
  setupCarousel('hobbies');

  const viewProjectsBtn = document.getElementById('view-projects');
  if (viewProjectsBtn) {
    viewProjectsBtn.addEventListener('click', () => {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  const themeToggle = document.getElementById('theme-toggle');
  const updateThemeIcon = () => {
    if (!themeToggle) {
      return;
    }
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☾' : '☀';
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      updateThemeIcon();
    });
    updateThemeIcon();
  }

  const sectionColors = {
    home: ['#ffff00', '#ff4500'],
    projects: ['#ffee58', '#ffc107'],
    skills: ['#ff5252', '#c62828'],
    hobbies: ['#42a5f5', '#1565c0'],
    contact: ['#66bb6a', '#2e7d32']
  };

  const setColors = (colors) => {
    if (!Array.isArray(colors) || colors.length < 2) {
      return;
    }
    document.documentElement.style.setProperty('--lava-light', colors[0]);
    document.documentElement.style.setProperty('--lava-dark', colors[1]);
  };

  setColors(sectionColors.home);

  const colorObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const colors = sectionColors[entry.target.id];
        if (colors) {
          setColors(colors);
        }
      }
    });
  }, { threshold: 0.6 });

  panels.forEach((panel) => colorObserver.observe(panel));

  const ball = document.getElementById('cursor-ball');
  const trail = document.getElementById('lava-trail');

  if (ball && trail) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ballX = mouseX;
    let ballY = mouseY;

    const getNow = () => (typeof performance !== 'undefined' && typeof performance.now === 'function'
      ? performance.now()
      : Date.now());

    let pointerSpeed = 0;
    let lastMouseTime = getNow();
    let hasPointerMoved = false;

    const MAX_TRAIL_ELEMENTS = 120;
    const INITIAL_BURST = 12;
    const FAST_SPAWN_DELAY = 24;
    const SLOW_SPAWN_DELAY = 90;
    const IDLE_SPAWN_DELAY = 180;
    const CLEANUP_DELAY = 4000;
    const SPEED_FOR_FAST_DELAY = 0.9;
    const activeTrailElements = new Set();
    const cleanupHandlers = new WeakMap();

    const registerTrailElement = (element) => {
      activeTrailElements.add(element);
      let cleaned = false;

      const cleanup = () => {
        if (cleaned) {
          return;
        }
        cleaned = true;
        window.clearTimeout(timeoutId);
        cleanupHandlers.delete(element);
        activeTrailElements.delete(element);
        element.remove();
      };

      const timeoutId = window.setTimeout(cleanup, CLEANUP_DELAY);

      element.addEventListener('animationend', cleanup, { once: true });
      element.addEventListener('animationcancel', cleanup, { once: true });
      cleanupHandlers.set(element, cleanup);
    };

    const ensureCapacityForNewElement = () => {
      if (activeTrailElements.size < MAX_TRAIL_ELEMENTS) {
        return;
      }

      const oldest = activeTrailElements.values().next().value;
      if (!oldest) {
        return;
      }

      const cleanup = cleanupHandlers.get(oldest);
      if (typeof cleanup === 'function') {
        cleanup();
      } else {
        cleanupHandlers.delete(oldest);
        activeTrailElements.delete(oldest);
        oldest.remove();
      }
    };

    const buildBlob = (x, y) => {
      const blob = document.createElement('span');
      blob.className = 'blob';
      const size = 20 + Math.random() * 30;
      blob.style.width = `${size}px`;
      blob.style.height = `${size}px`;
      const offsetX = (Math.random() - 0.5) * 50;
      const offsetY = (Math.random() - 0.5) * 50;
      const driftX = (Math.random() - 0.5) * 150;
      const driftY = -60 - Math.random() * 100;
      blob.style.left = `${x + offsetX}px`;
      blob.style.top = `${y + offsetY}px`;
      blob.style.setProperty('--dx', driftX);
      blob.style.setProperty('--dy', driftY);
      return blob;
    };

    const buildDigit = (x, y) => {
      const digit = document.createElement('span');
      digit.className = 'digit';
      digit.textContent = Math.floor(Math.random() * 10).toString();
      const size = 12 + Math.random() * 8;
      digit.style.fontSize = `${size}px`;
      const offsetX = (Math.random() - 0.5) * 50;
      const offsetY = (Math.random() - 0.5) * 50;
      const driftX = (Math.random() - 0.5) * 30;
      const driftY = 60 + Math.random() * 100;
      digit.style.left = `${x + offsetX}px`;
      digit.style.top = `${y + offsetY}px`;
      digit.style.setProperty('--dx', driftX);
      digit.style.setProperty('--dy', driftY);
      return digit;
    };

    const spawnTrailElement = () => {
      ensureCapacityForNewElement();

      if (activeTrailElements.size >= MAX_TRAIL_ELEMENTS) {
        return false;
      }

      const element = document.body.classList.contains('dark')
        ? buildDigit(ballX, ballY)
        : buildBlob(ballX, ballY);

      trail.appendChild(element);
      registerTrailElement(element);
      return true;
    };

    const spawnImmediateBurst = (count, step = 30) => {
      const cappedCount = Math.min(count, MAX_TRAIL_ELEMENTS);
      for (let i = 0; i < cappedCount; i += 1) {
        setTimeout(() => {
          spawnTrailElement();
        }, i * step);
      }
    };

    const handlePointerMove = (targetX, targetY) => {
      const currentTime = getNow();
      const elapsed = currentTime - lastMouseTime || 16;
      const deltaX = targetX - mouseX;
      const deltaY = targetY - mouseY;
      const distance = Math.hypot(deltaX, deltaY);

      mouseX = targetX;
      mouseY = targetY;

      const instantaneousSpeed = distance / Math.max(elapsed, 1);
      pointerSpeed = (pointerSpeed * 0.75) + (instantaneousSpeed * 0.25);
      lastMouseTime = currentTime;

      if (!hasPointerMoved) {
        hasPointerMoved = true;
        ballX = mouseX;
        ballY = mouseY;
        pointerSpeed = Math.max(pointerSpeed, 0.6);
        spawnImmediateBurst(6, 18);
      }
    };

    window.addEventListener('mousemove', (event) => {
      handlePointerMove(event.clientX, event.clientY);
    });

    window.addEventListener('touchstart', (event) => {
      const touch = event.touches && event.touches[0];
      if (touch) {
        handlePointerMove(touch.clientX, touch.clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (event) => {
      const touch = event.touches && event.touches[0];
      if (touch) {
        handlePointerMove(touch.clientX, touch.clientY);
      }
    }, { passive: true });

    const warmupTrail = () => {
      spawnImmediateBurst(Math.min(INITIAL_BURST, MAX_TRAIL_ELEMENTS), 26);
    };

    const computeSpawnDelay = () => {
      const currentTime = getNow();
      const idleDuration = currentTime - lastMouseTime;

      let effectiveSpeed = pointerSpeed;
      if (idleDuration > 60) {
        const decayFactor = Math.max(0, 1 - ((idleDuration - 60) / 480));
        effectiveSpeed *= decayFactor;
      }

      const clampedSpeed = Math.min(effectiveSpeed, SPEED_FOR_FAST_DELAY);
      const speedRatio = SPEED_FOR_FAST_DELAY === 0
        ? 0
        : clampedSpeed / SPEED_FOR_FAST_DELAY;

      const activeDelay = SLOW_SPAWN_DELAY - ((SLOW_SPAWN_DELAY - FAST_SPAWN_DELAY) * speedRatio);
      const idleRatio = Math.min(idleDuration / 1200, 1);
      const blendedDelay = activeDelay + ((IDLE_SPAWN_DELAY - activeDelay) * idleRatio);

      return Math.max(FAST_SPAWN_DELAY, Math.min(IDLE_SPAWN_DELAY, blendedDelay));
    };

    const runSpawnLoop = () => {
      const spawned = spawnTrailElement();
      const delay = spawned ? computeSpawnDelay() : IDLE_SPAWN_DELAY;
      setTimeout(runSpawnLoop, delay);
    };

    warmupTrail();
    runSpawnLoop();

    const animateBall = () => {
      const idleDuration = getNow() - lastMouseTime;
      const decayFactor = idleDuration <= 80 ? 1 : Math.max(0.12, 1 - ((idleDuration - 80) / 360));
      const adjustedSpeed = pointerSpeed * decayFactor;
      const speedRatio = SPEED_FOR_FAST_DELAY === 0
        ? 0
        : Math.min(adjustedSpeed / SPEED_FOR_FAST_DELAY, 1);
      const followStrength = Math.min(0.12 + (0.18 * speedRatio), 0.3);

      ballX += (mouseX - ballX) * followStrength;
      ballY += (mouseY - ballY) * followStrength;
      ball.style.left = `${ballX}px`;
      ball.style.top = `${ballY}px`;
      requestAnimationFrame(animateBall);
    };

    animateBall();
  }
});
