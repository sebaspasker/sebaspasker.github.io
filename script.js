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
  const languageToggle = document.getElementById('language-toggle');
  const textNodes = Array.from(document.querySelectorAll('[data-i18n]')).map((element) => ({
    element,
    key: element.getAttribute('data-i18n') || ''
  }));
  const altNodes = Array.from(document.querySelectorAll('[data-i18n-alt]')).map((element) => ({
    element,
    key: element.getAttribute('data-i18n-alt') || ''
  }));
  const ariaLabelNodes = Array.from(document.querySelectorAll('[data-i18n-aria-label]')).map((element) => ({
    element,
    key: element.getAttribute('data-i18n-aria-label') || ''
  }));

  const translations = {
    en: {
      htmlLang: 'en',
      documentTitle: 'Sebastian Pasker - Portfolio',
      intro: {
        prefix: "Hello, I'm",
        roles: [
          ' Sebastian Pasker.',
          ' a computer engineer.',
          ' a backend developer.',
          ' a Linux specialist.',
          ' passionate about computing.'
        ]
      },
      home: {
        summary:
          'I build reliable backends and automate Linux infrastructure for teams.'
      },
      languageToggle: {
        text: 'EN',
        label: 'Switch to Spanish',
        tooltip: 'Switch to Spanish'
      },
      nav: {
        home: 'Home',
        projects: 'Projects',
        skills: 'Skills',
        hobbies: 'Hobbies',
        contact: 'Contact',
        open: 'Open navigation',
        close: 'Close navigation'
      },
      buttons: {
        viewProjects: 'Explore my work'
      },
      projects: {
        title: 'My projects',
        items: [
          {
            title: 'Gloria2 (WebGIS for aquaculture)',
            description:
              'Real-time WebGIS to monitor fish farm escapes using geolocation and spatial data pipelines.',
            toolsLabel: 'Tools:',
            tools: 'Mapbox GL JS · Node JS · GeoJSON · Shell Scripting · Copernicus',
            link: 'View repository',
            alt: 'Screenshot of the Gloria2 WebGIS monitoring dashboard'
          },
          {
            title: 'Deepfish2 (WebGIS & biomass estimation)',
            description:
              'Research platform combining Django, Mapbox and MySQL to estimate fish biomass and classify species with marine biologists.',
            toolsLabel: 'Tools:',
            tools: 'Django · Mapbox GL JS · MySQL · GeoJSON · Data Science · Python',
            link: 'View code',
            alt: 'Preview of the Deepfish2 research platform'
          },
          {
            title: 'BJJ Guide Fabric',
            description:
              'CLI tool that transforms instructional videos into structured study guides with diagrams and automation.',
            toolsLabel: 'Tools:',
            tools: 'Python · Fabric · FFmpeg · Markdown · Bash Scripting · GPT APIs',
            link: 'Read the docs',
            alt: 'Terminal output from the BJJ Guide Fabric CLI tool'
          },
          {
            title: 'ROL Game (proyecto_SD)',
            description:
              'Event-driven architecture experiment focused on modular services, security and data integrity.',
            toolsLabel: 'Tools:',
            tools: 'Bash · Python · Kafka · JSON · Docker · Sockets',
            link: 'View code',
            alt: 'Architecture sketch of the ROL Game distributed system'
          }
        ]
      },
      skills: {
        title: 'Skills',
        languages: 'Programming languages',
        frameworks: 'Frameworks & Platforms',
        tools: 'Infrastructure & Tools'
      },
      hobbies: {
        title: 'Hobbies',
        items: [
          {
            title: 'Shell scripting & Linux tweaks',
            description: 'Automating tasks and customizing my Linux setup to keep everything smooth.',
            alt: 'Linux terminal running shell scripts'
          },
          {
            title: 'Brazilian Jiu-Jitsu',
            description: 'Practicing grappling to sharpen focus, resilience, and quick problem solving.',
            alt: 'Brazilian Jiu-Jitsu training'
          },
          {
            title: 'Hiking & trail routes',
            description: 'Exploring routes and staying active outdoors whenever I can.',
            alt: 'Hiking trail in the mountains'
          }
        ]
      },
      contact: {
        title: "Let's Connect",
        intro: "Choose the way you'd like to get in touch with me.",
        email: {
          heading: 'Email',
          value: 'sebaspasker@gmail.com',
          cta: 'Start an email'
        },
        github: {
          heading: 'GitHub',
          value: '@sebaspasker',
          cta: 'Browse my repositories'
        },
        linkedin: {
          heading: 'LinkedIn',
          value: '/in/sebaspasker/',
          cta: "Let's connect"
        }
      },
      aria: {
        primaryNav: 'Primary navigation',
        previousSlide: 'Previous slide',
        nextSlide: 'Next slide',
        openGallery: 'Expand project gallery',
        closeGallery: 'Close gallery'
      }
    },
    es: {
      htmlLang: 'es',
      documentTitle: 'Sebastian Pasker - Portafolio',
      intro: {
        prefix: 'Hola, soy',
        roles: [
          ' Sebastian Pasker.',
          ' un ingeniero informático.',
          ' un desarrollador backend.',
          ' un especialista en Linux.',
          ' un apasionado de la informática.'
        ]
      },
      home: {
        summary:
          'Construyo backends fiables y automatizo infraestructura Linux para equipos.'
      },
      languageToggle: {
        text: 'ES',
        label: 'Cambiar a inglés',
        tooltip: 'Cambiar a inglés'
      },
      nav: {
        home: 'Inicio',
        projects: 'Proyectos',
        skills: 'Habilidades',
        hobbies: 'Pasatiempos',
        contact: 'Contacto',
        open: 'Abrir navegación',
        close: 'Cerrar navegación'
      },
      buttons: {
        viewProjects: 'Explora mi trabajo'
      },
      projects: {
        title: 'Mis proyectos',
        items: [
          {
            title: 'Gloria2 (WebGIS para acuicultura)',
            description:
              'WebGIS en tiempo real para monitorizar fugas en piscifactorías usando geolocalización y flujos de datos espaciales.',
            toolsLabel: 'Herramientas:',
            tools: 'Mapbox GL JS · Node JS · GeoJSON · Shell Scripting · Copernicus',
            link: 'Ver repositorio',
            alt: 'Panel de monitorización de Gloria2 WebGIS'
          },
          {
            title: 'Deepfish2 (WebGIS y estimación de biomasa)',
            description:
              'Plataforma de investigación que combina Django, Mapbox y explotación de datos para estimar biomasa y clasificar especies junto a biólogos marinos.',
            toolsLabel: 'Herramientas:',
            tools: 'Django · Mapbox GL JS · MySQL · GeoJSON · Data Science · Python',
            link: 'Ver código',
            alt: 'Vista previa de la plataforma de investigación Deepfish2'
          },
          {
            title: 'BJJ Guide Fabric',
            description:
              'Herramienta CLI que transforma vídeos instruccionales en guías de estudio estructuradas con diagramas y automatizaciones.',
            toolsLabel: 'Herramientas:',
            tools: 'Python · Fabric · FFmpeg · Markdown · Bash Scripting · GPT APIs',
            link: 'Leer la documentación',
            alt: 'Salida en terminal de la herramienta CLI BJJ Guide Fabric'
          },
          {
            title: 'ROL Game (proyecto_SD)',
            description:
              'Experimento de arquitectura dirigida por eventos centrado en servicios modulares, seguridad e integridad de datos.',
            toolsLabel: 'Herramientas:',
            tools: 'Bash · Python · Kafka · JSON · Docker · Sockets',
            link: 'Ver código',
            alt: 'Esquema de arquitectura del sistema distribuido ROL Game'
          }
        ]
      },
      skills: {
        title: 'Habilidades clave',
        languages: 'Lenguajes de programación',
        frameworks: 'Frameworks y plataformas',
        tools: 'Infraestructura y herramientas'
      },
      hobbies: {
        title: 'Pasatiempos',
        items: [
          {
            title: 'Shell scripting y ajustes en Linux',
            description:
              'Automatizo tareas y personalizo mi equipo Linux para que funcione de forma fluida.',
            alt: 'Terminal de Linux ejecutando scripts de shell'
          },
          {
            title: 'Brazilian Jiu-Jitsu',
            description:
              'Entrenamiento de grappling para potenciar la concentración, la resiliencia y la resolución rápida de problemas.',
            alt: 'Entrenamiento de Brazilian Jiu-Jitsu'
          },
          {
            title: 'Senderismo',
            description:
              'Me encanta hacer rutas y disfrutar del aire libre siempre que puedo.',
            alt: 'Ruta de senderismo en la montaña'
          }
        ]
      },
      contact: {
        title: 'Conectemos',
        intro: 'Elige la forma que prefieras para ponerte en contacto conmigo.',
        email: {
          heading: 'Correo electrónico',
          value: 'sebaspasker@gmail.com',
          cta: 'Empezar un correo'
        },
        github: {
          heading: 'GitHub',
          value: '@sebaspasker',
          cta: 'Explora mis repositorios'
        },
        linkedin: {
          heading: 'LinkedIn',
          value: '/in/sebaspasker/',
          cta: 'Conectemos'
        }
      },
      aria: {
        primaryNav: 'Navegación principal',
        previousSlide: 'Diapositiva anterior',
        nextSlide: 'Siguiente diapositiva',
        openGallery: 'Ampliar galería del proyecto',
        closeGallery: 'Cerrar galería'
      }
    }
  };

  let currentLanguage = 'en';

  const getNestedValue = (source, path) => {
    if (!source || typeof path !== 'string') {
      return undefined;
    }
    return path.split('.').reduce((current, segment) => {
      if (current === undefined || current === null) {
        return undefined;
      }
      if (Array.isArray(current)) {
        const index = Number(segment);
        if (Number.isNaN(index) || index < 0 || index >= current.length) {
          return undefined;
        }
        return current[index];
      }
      return current[segment];
    }, source);
  };

  const typingDurations = {
    type: 60,
    delete: 40,
    hold: 1500,
    gap: 360
  };

  let typingLanguage = currentLanguage;
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let nextTypingFrame = 0;

  const resetTyping = (lang) => {
    typingLanguage = lang;
    roleIndex = 0;
    charIndex = 0;
    deleting = false;
    nextTypingFrame = 0;
    if (intro) {
      intro.textContent = '';
    }
  };

  const typeLoop = (timestamp) => {
    if (!intro) {
      return;
    }

    if (!nextTypingFrame) {
      nextTypingFrame = timestamp;
    }

    if (timestamp < nextTypingFrame) {
      requestAnimationFrame(typeLoop);
      return;
    }

    const config = translations[typingLanguage]?.intro;
    const roles = Array.isArray(config?.roles) && config.roles.length ? config.roles : [''];
    const prefix = typeof config?.prefix === 'string' ? config.prefix : '';
    const currentRole = roles[roleIndex % roles.length];
    const fullText = `${prefix}${currentRole}`;

    if (!deleting) {
      if (charIndex < fullText.length) {
        charIndex += 1;
        intro.textContent = fullText.slice(0, charIndex);
        nextTypingFrame = timestamp + typingDurations.type;
        if (charIndex === fullText.length) {
          deleting = true;
          nextTypingFrame = timestamp + typingDurations.hold;
        }
      } else {
        deleting = true;
        nextTypingFrame = timestamp + typingDurations.hold;
      }
    } else if (charIndex > prefix.length) {
      charIndex -= 1;
      intro.textContent = fullText.slice(0, charIndex);
      if (charIndex === prefix.length) {
        intro.textContent = prefix;
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        nextTypingFrame = timestamp + typingDurations.gap;
      } else {
        nextTypingFrame = timestamp + typingDurations.delete;
      }
    } else {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      charIndex = prefix.length;
      intro.textContent = prefix;
      nextTypingFrame = timestamp + typingDurations.type;
    }

    requestAnimationFrame(typeLoop);
  };

  if (intro) {
    resetTyping(currentLanguage);
    requestAnimationFrame(typeLoop);
  }

  const nav = document.querySelector('.nav-index');
  const toggleBtn = document.getElementById('menu-toggle');
  const navLinks = nav ? nav.querySelectorAll('a') : [];
  let updateNavState;
  let refreshLavaConfig = () => {};

  const updateMenuButtonLabel = (isOpen) => {
    if (!toggleBtn) {
      return;
    }
    const navStrings = translations[currentLanguage]?.nav;
    if (!navStrings) {
      return;
    }
    const label = isOpen ? navStrings.close : navStrings.open;
    toggleBtn.setAttribute('aria-label', label);
    toggleBtn.setAttribute('title', label);
  };

  if (nav && toggleBtn) {
    const setNavState = (isOpen) => {
      nav.classList.toggle('open', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
      updateMenuButtonLabel(isOpen);
      toggleBtn.textContent = isOpen ? '✕' : '☰';
    };

    updateNavState = setNavState;
    setNavState(false);

    toggleBtn.addEventListener('click', () => {
      setNavState(!nav.classList.contains('open'));
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        setNavState(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setNavState(false);
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (typeof updateNavState === 'function') {
        updateNavState(false);
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

      const styles = window.getComputedStyle(targetItem);
      const marginLeft = parseFloat(styles.marginLeft) || 0;
      const rawLeft = targetItem.offsetLeft - marginLeft;
      const maxScrollLeft = Math.max(carouselView.scrollWidth - carouselView.clientWidth, 0);
      const targetLeft = Math.min(Math.max(rawLeft, 0), maxScrollLeft);

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

  const projectImageSets = [
    [
      {
        preview: 'imgs/gloria_01.png',
        full: 'imgs/gloria_01.png'
      },
      {
        preview: 'imgs/gloria_02.png',
        full: 'imgs/gloria_02.png'
      },
      {
        preview: 'imgs/gloria_03.png',
        full: 'imgs/gloria_03.png'
      },
      {
        preview: 'imgs/gloria_04.png',
        full: 'imgs/gloria_04.png'
      },
      {
        preview: 'imgs/gloria_05.png',
        full: 'imgs/gloria_05.png'
      }
    ],
    [
      {
        preview: 'imgs/webgis_01.png',
        full: 'imgs/webgis_01.png'
      },
      {
        preview: 'imgs/webgis_02.jpeg',
        full: 'imgs/webgis_02.jpeg'
      },
      {
        preview: 'imgs/webgis_03.jpeg',
        full: 'imgs/webgis_03.jpeg'
      },
      {
        preview: 'imgs/webgis_04.png',
        full: 'imgs/webgis_04.png'
      },
      {
        preview: 'imgs/webgis_05.png',
        full: 'imgs/webgis_05.png'
      }
    ],
    [
      {
        preview: 'imgs/bjj_02.png',
        full: 'imgs/bjj_01.svg'
      },
    ],
    [
      {
        preview: 'imgs/sd_02.png',
        full: 'imgs/sd_02.png'
      },
      {
        preview: 'imgs/sd_01.png',
        full: 'imgs/sd_01.png'
      }
    ]
  ];

  const projectGalleries = Array.from(document.querySelectorAll('.project-gallery'));
  const lightbox = document.getElementById('project-lightbox');
  const lightboxImage = lightbox ? lightbox.querySelector('.lightbox-image') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-arrow.left') : null;
  const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-arrow.right') : null;
  const lightboxBackdrop = lightbox ? lightbox.querySelector('.lightbox-backdrop') : null;

  let activeGalleryIndex = null;
  let activeImageIndex = 0;
  let lastFocusedElement = null;

  const galleryFrameSizes = new Map();
  const pendingFrameLoads = new Set();

  if (lightboxImage) {
    lightboxImage.addEventListener('load', () => {
      if (
        !lightbox ||
        lightboxImage.naturalWidth <= 0 ||
        lightboxImage.naturalHeight <= 0
      ) {
        return;
      }

      applyLightboxFrame(lightboxImage.naturalWidth, lightboxImage.naturalHeight);
    });
  }

  const applyLightboxFrame = (width, height) => {
    if (!lightbox) {
      return;
    }

    if (typeof width === 'number' && Number.isFinite(width) && width > 0) {
      lightbox.style.setProperty('--lightbox-width', `${width}px`);
    }

    if (typeof height === 'number' && Number.isFinite(height) && height > 0) {
      lightbox.style.setProperty('--lightbox-height', `${height}px`);
    }

    if (
      typeof width === 'number' &&
      Number.isFinite(width) &&
      width > 0 &&
      typeof height === 'number' &&
      Number.isFinite(height) &&
      height > 0
    ) {
      lightbox.style.setProperty('--lightbox-aspect', `${width} / ${height}`);
    }
  };

  const applyGalleryFrameDimensions = (galleryIndex, width, height) => {
    if (
      typeof width !== 'number' ||
      typeof height !== 'number' ||
      !Number.isFinite(width) ||
      !Number.isFinite(height) ||
      width <= 0 ||
      height <= 0
    ) {
      return;
    }

    const gallery = projectGalleries[galleryIndex];
    if (!gallery) {
      return;
    }

    galleryFrameSizes.set(galleryIndex, { width, height });

    const previewButton = gallery.querySelector('.gallery-preview');
    if (previewButton) {
      previewButton.style.setProperty('--frame-width', `${width}px`);
      previewButton.style.setProperty('--frame-aspect', `${width} / ${height}`);
    }

    if (activeGalleryIndex === galleryIndex) {
      applyLightboxFrame(width, height);
    }
  };

  const initGalleryFrame = (galleryIndex) => {
    if (galleryFrameSizes.has(galleryIndex) || pendingFrameLoads.has(galleryIndex)) {
      return;
    }

    const gallery = projectGalleries[galleryIndex];
    const images = projectImageSets[galleryIndex] || [];

    if (!gallery || !images.length) {
      return;
    }

    const firstImage = images[0];
    const previewSrc = firstImage?.preview || firstImage?.full;

    if (!previewSrc) {
      return;
    }

    const previewButton = gallery.querySelector('.gallery-preview');
    const previewImage = previewButton
      ? previewButton.querySelector('.project-image')
      : null;

    const handlePreviewLoad = () => {
      if (
        previewImage &&
        previewImage.naturalWidth > 0 &&
        previewImage.naturalHeight > 0 &&
        !galleryFrameSizes.has(galleryIndex)
      ) {
        applyGalleryFrameDimensions(
          galleryIndex,
          previewImage.naturalWidth,
          previewImage.naturalHeight
        );
      }
    };

    if (previewImage) {
      if (previewImage.complete) {
        handlePreviewLoad();
      } else {
        previewImage.addEventListener('load', handlePreviewLoad, { once: true });
      }
    }

    if (galleryFrameSizes.has(galleryIndex)) {
      return;
    }

    pendingFrameLoads.add(galleryIndex);

    const loader = new Image();
    loader.decoding = 'async';

    const finalize = () => {
      pendingFrameLoads.delete(galleryIndex);

      if (
        loader.naturalWidth > 0 &&
        loader.naturalHeight > 0 &&
        !galleryFrameSizes.has(galleryIndex)
      ) {
        applyGalleryFrameDimensions(
          galleryIndex,
          loader.naturalWidth,
          loader.naturalHeight
        );
      }
    };

    loader.addEventListener('load', finalize, { once: true });
    loader.addEventListener(
      'error',
      () => {
        pendingFrameLoads.delete(galleryIndex);
      },
      { once: true }
    );

    loader.src = previewSrc;

    if (loader.complete) {
      finalize();
    }
  };

  const normalizeGalleryIndex = (index, total) => {
    if (!total) {
      return 0;
    }
    const remainder = index % total;
    return remainder < 0 ? remainder + total : remainder;
  };

  const updatePreviewButtons = (gallery, total) => {
    const disable = total <= 1;
    const prev = gallery.querySelector('.gallery-btn.prev');
    const next = gallery.querySelector('.gallery-btn.next');

    if (prev) {
      prev.disabled = disable;
    }

    if (next) {
      next.disabled = disable;
    }
  };

  const updateLightboxButtons = (count) => {
    const disable = count <= 1;
    if (lightboxPrev) {
      lightboxPrev.disabled = disable;
    }
    if (lightboxNext) {
      lightboxNext.disabled = disable;
    }
  };

  const updateLightboxImage = () => {
    if (!lightboxImage || activeGalleryIndex === null) {
      return;
    }

    const images = projectImageSets[activeGalleryIndex] || [];
    if (!images.length) {
      return;
    }

    activeImageIndex = normalizeGalleryIndex(activeImageIndex, images.length);
    const currentImage = images[activeImageIndex] || {};
    const source = currentImage.full || currentImage.preview;

    if (source && lightboxImage.getAttribute('src') !== source) {
      lightboxImage.setAttribute('src', source);
    }

    const previewGallery = projectGalleries[activeGalleryIndex];
    const previewImage = previewGallery
      ? previewGallery.querySelector('.project-image')
      : null;

    if (previewImage) {
      lightboxImage.setAttribute('alt', previewImage.getAttribute('alt') || '');
    }

    updateLightboxButtons(images.length);
  };

  const setGalleryImage = (galleryIndex, targetIndex, { syncLightbox = false } = {}) => {
    const gallery = projectGalleries[galleryIndex];
    const images = projectImageSets[galleryIndex] || [];

    initGalleryFrame(galleryIndex);

    if (!gallery) {
      return;
    }

    if (!images.length) {
      updatePreviewButtons(gallery, images.length);
      return;
    }

    const normalized = normalizeGalleryIndex(targetIndex, images.length);
    const previewData = images[normalized] || {};
    const previewButton = gallery.querySelector('.gallery-preview');
    const previewImage = previewButton
      ? previewButton.querySelector('.project-image')
      : gallery.querySelector('.project-image');

    if (previewImage && previewData.preview) {
      if (previewImage.getAttribute('src') !== previewData.preview) {
        previewImage.setAttribute('src', previewData.preview);
      }
      previewImage.dataset.fullSrc = previewData.full || previewData.preview || '';
      previewImage.dataset.imageIndex = String(normalized);
    }

    gallery.dataset.currentIndex = String(normalized);
    updatePreviewButtons(gallery, images.length);

    if (syncLightbox && activeGalleryIndex === galleryIndex) {
      activeImageIndex = normalized;
      updateLightboxImage();
    }
  };

  const openLightbox = (galleryIndex, startIndex = 0) => {
    if (!lightbox) {
      return;
    }

    const images = projectImageSets[galleryIndex] || [];
    if (!images.length) {
      return;
    }

    activeGalleryIndex = galleryIndex;
    activeImageIndex = normalizeGalleryIndex(startIndex, images.length);
    lastFocusedElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    const frame = galleryFrameSizes.get(galleryIndex);
    if (frame) {
      applyLightboxFrame(frame.width, frame.height);
    } else {
      initGalleryFrame(galleryIndex);
    }

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');

    updateLightboxImage();
    document.addEventListener('keydown', handleLightboxKeydown);

    if (lightboxClose) {
      requestAnimationFrame(() => {
        lightboxClose.focus();
      });
    }
  };

  const closeLightbox = () => {
    if (!lightbox || !lightbox.classList.contains('open')) {
      return;
    }

    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    document.removeEventListener('keydown', handleLightboxKeydown);

    const focusTarget = lastFocusedElement;
    activeGalleryIndex = null;
    lastFocusedElement = null;

    if (focusTarget && typeof focusTarget.focus === 'function') {
      focusTarget.focus();
    }
  };

  const stepLightbox = (delta) => {
    if (activeGalleryIndex === null) {
      return;
    }

    const gallery = projectGalleries[activeGalleryIndex];
    const images = projectImageSets[activeGalleryIndex] || [];

    if (!gallery || !images.length) {
      return;
    }

    const current = Number(gallery.dataset.currentIndex) || 0;
    setGalleryImage(activeGalleryIndex, current + delta, { syncLightbox: true });
  };

  function handleLightboxKeydown(event) {
    if (!lightbox || !lightbox.classList.contains('open')) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stepLightbox(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      stepLightbox(1);
    }
  }

  projectGalleries.forEach((gallery, galleryIndex) => {
    const prevBtn = gallery.querySelector('.gallery-btn.prev');
    const nextBtn = gallery.querySelector('.gallery-btn.next');
    const previewButton = gallery.querySelector('.gallery-preview');

    setGalleryImage(galleryIndex, Number(gallery.dataset.currentIndex) || 0);

    if (prevBtn) {
      prevBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const current = Number(gallery.dataset.currentIndex) || 0;
        setGalleryImage(galleryIndex, current - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const current = Number(gallery.dataset.currentIndex) || 0;
        setGalleryImage(galleryIndex, current + 1);
      });
    }

    if (previewButton) {
      previewButton.addEventListener('click', () => {
        const current = Number(gallery.dataset.currentIndex) || 0;
        openLightbox(galleryIndex, current);
      });
    }
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      closeLightbox();
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (event) => {
      event.preventDefault();
      stepLightbox(-1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (event) => {
      event.preventDefault();
      stepLightbox(1);
    });
  }

  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', () => {
      closeLightbox();
    });
  }

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
  const avatarImage = document.querySelector('.avatar');
  const updateThemeUI = () => {
    const isDark = document.body.classList.contains('dark');

    if (themeToggle) {
      themeToggle.textContent = isDark ? '☾' : '☀';
      themeToggle.setAttribute(
        'aria-label',
        isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'
      );
    }

    if (avatarImage) {
      const lightSrc = avatarImage.dataset.lightSrc || avatarImage.getAttribute('src');
      const darkSrc = avatarImage.dataset.darkSrc || lightSrc;
      const targetSrc = isDark ? darkSrc : lightSrc;

      if (targetSrc && avatarImage.getAttribute('src') !== targetSrc) {
        avatarImage.setAttribute('src', targetSrc);
      }
    }
  };

  const sectionColors = {
    home: ['#ffff00', '#ff4500'],
    projects: ['#ffee58', '#ffc107'],
    skills: ['#ff5252', '#c62828'],
    hobbies: ['#42a5f5', '#1565c0'],
    contact: ['#66bb6a', '#2e7d32']
  };

  const monochromeColors = ['#ffffff', '#000000'];
  let currentColors = sectionColors.home;

  const applyLavaColors = () => {
    const palette = document.body.classList.contains('dark')
      ? monochromeColors
      : currentColors;

    if (!Array.isArray(palette) || palette.length < 2) {
      return;
    }

    document.documentElement.style.setProperty('--lava-light', palette[0]);
    document.documentElement.style.setProperty('--lava-dark', palette[1]);
  };

  const setColors = (colors) => {
    if (!Array.isArray(colors) || colors.length < 2) {
      return;
    }
    currentColors = colors;
    applyLavaColors();
  };

  applyLavaColors();
  updateThemeUI();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      updateThemeUI();
      applyLavaColors();
      refreshLavaConfig();
    });
  }

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

  if (linkMap.size) {
    const activeSectionObserver = new IntersectionObserver((entries) => {
      let mostVisible = null;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!mostVisible || entry.intersectionRatio > mostVisible.intersectionRatio) {
            mostVisible = entry;
          }
        }
      });

      if (mostVisible) {
        linkMap.forEach((navLink) => navLink.classList.remove('active'));
        const currentLink = linkMap.get(mostVisible.target.id);
        if (currentLink) {
          currentLink.classList.add('active');
        }
      }
    }, { threshold: [0.3, 0.6, 0.9] });

    linkMap.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) {
        activeSectionObserver.observe(section);
      }
    });
  }

  const applyTranslations = (lang) => {
    const dictionary = translations[lang];
    if (!dictionary) {
      return;
    }

    currentLanguage = lang;

    document.documentElement.lang = dictionary.htmlLang || lang;
    if (typeof dictionary.documentTitle === 'string') {
      document.title = dictionary.documentTitle;
    }

    textNodes.forEach(({ element, key }) => {
      const value = getNestedValue(dictionary, key);
      if (typeof value === 'string' && element.textContent !== value) {
        element.textContent = value;
      }
    });

    altNodes.forEach(({ element, key }) => {
      const value = getNestedValue(dictionary, key);
      if (typeof value === 'string' && element.getAttribute('alt') !== value) {
        element.setAttribute('alt', value);
      }
    });

    ariaLabelNodes.forEach(({ element, key }) => {
      const value = getNestedValue(dictionary, key);
      if (typeof value === 'string' && element.getAttribute('aria-label') !== value) {
        element.setAttribute('aria-label', value);
      }
    });

    if (languageToggle) {
      const { text, label, tooltip } = dictionary.languageToggle || {};
      const buttonText =
        typeof text === 'string' && text.trim().length ? text.trim() : lang.toUpperCase();
      if (languageToggle.textContent !== buttonText) {
        languageToggle.textContent = buttonText;
      }
      if (typeof label === 'string' && languageToggle.getAttribute('aria-label') !== label) {
        languageToggle.setAttribute('aria-label', label);
      }
      if (typeof tooltip === 'string' && tooltip.length) {
        if (languageToggle.getAttribute('title') !== tooltip) {
          languageToggle.setAttribute('title', tooltip);
        }
      } else {
        languageToggle.removeAttribute('title');
      }
      languageToggle.setAttribute('aria-pressed', lang === 'es' ? 'true' : 'false');
      languageToggle.dataset.language = lang;
    }

    updateMenuButtonLabel(nav?.classList.contains('open'));

    updateLightboxImage();

    resetTyping(lang);
  };

  if (languageToggle) {
    languageToggle.addEventListener('click', () => {
      const nextLanguage = currentLanguage === 'en' ? 'es' : 'en';
      applyTranslations(nextLanguage);
    });
  }

  applyTranslations(currentLanguage);

  const ball = document.getElementById('cursor-ball');
  const trail = document.getElementById('lava-trail');

  if (ball && trail) {
    const motionReduced = prefersReducedMotion;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ballX = pointerX;
    let ballY = pointerY;
    let lastPointerMove = 0;
    let pointerActive = false;
    let lastPointerX = pointerX;
    let lastPointerY = pointerY;
    let movementAccumulator = 0;

    ball.style.setProperty('--ball-x', `${ballX}px`);
    ball.style.setProperty('--ball-y', `${ballY}px`);

    const pointerEventName = window.PointerEvent ? 'pointermove' : 'mousemove';

    const getTimestamp = () => (
      typeof performance !== 'undefined' && typeof performance.now === 'function'
        ? performance.now()
        : Date.now()
    );

    const updatePointer = (event) => {
      const { clientX, clientY } = event;
      if (typeof clientX === 'number' && typeof clientY === 'number') {
        const dx = clientX - lastPointerX;
        const dy = clientY - lastPointerY;
        const distance = Math.hypot(dx, dy);
        if (Number.isFinite(distance)) {
          movementAccumulator = Math.min(movementAccumulator + distance, 800);
        }
        pointerX = clientX;
        pointerY = clientY;
        lastPointerX = clientX;
        lastPointerY = clientY;
      }
      pointerActive = true;
      lastPointerMove = getTimestamp();
    };

    window.addEventListener(pointerEventName, updatePointer, { passive: true });

    const particles = [];
    const maxParticles = motionReduced ? 35 : 140;

    const registerParticle = (element) => {
      if (!element) {
        return;
      }

      const entry = { element, cleanup: null };

      const cleanup = () => {
        element.removeEventListener('animationend', cleanup);
        const index = particles.indexOf(entry);
        if (index !== -1) {
          particles.splice(index, 1);
        }
        element.remove();
      };

      entry.cleanup = cleanup;
      particles.push(entry);
      trail.appendChild(element);
      element.addEventListener('animationend', cleanup);

      while (particles.length > maxParticles) {
        const oldest = particles.shift();
        if (oldest) {
          oldest.element.removeEventListener('animationend', oldest.cleanup);
          oldest.element.remove();
        }
      }
    };

    const createBlob = (x, y) => {
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
      blob.style.setProperty('--dx', driftX.toFixed(1));
      blob.style.setProperty('--dy', driftY.toFixed(1));
      return blob;
    };

    const createNumber = (x, y) => {
      const num = document.createElement('span');
      num.className = 'digit';
      num.textContent = Math.floor(Math.random() * 10).toString();
      const size = 12 + Math.random() * 8;
      num.style.fontSize = `${size}px`;
      const offsetX = (Math.random() - 0.5) * 50;
      const offsetY = (Math.random() - 0.5) * 50;
      const driftX = (Math.random() - 0.5) * 30;
      const driftY = 60 + Math.random() * 100;
      num.style.left = `${x + offsetX}px`;
      num.style.top = `${y + offsetY}px`;
      num.style.setProperty('--dx', driftX.toFixed(1));
      num.style.setProperty('--dy', driftY.toFixed(1));
      return num;
    };

    const computeSpawnDelay = () => {
      if (motionReduced) {
        return 220 + Math.random() * 160;
      }
      const isDark = document.body.classList.contains('dark');
      const base = isDark ? 55 : 38;
      const variance = isDark ? 65 : 42;
      return base + Math.random() * variance;
    };

    const computeSpawnCount = () => {
      if (motionReduced) {
        return 1;
      }
      const isDark = document.body.classList.contains('dark');
      const base = isDark ? 3 : 4;
      const bonus = Math.min(5, Math.floor(movementAccumulator / 18));
      return base + bonus;
    };

    const spawnParticles = (count) => {
      const factory = document.body.classList.contains('dark') ? createNumber : createBlob;
      for (let i = 0; i < count; i += 1) {
        registerParticle(factory(ballX, ballY));
      }
    };

    let nextSpawnTime = 0;
    let spawnDelay = computeSpawnDelay();

    const spawnLoop = (timestamp) => {
      const pointerRecentlyMoved = pointerActive && (timestamp - lastPointerMove) < 450;
      if (pointerActive && !pointerRecentlyMoved) {
        pointerActive = false;
      }

      if (!document.hidden && pointerRecentlyMoved && timestamp >= nextSpawnTime) {
        const spawnCount = computeSpawnCount();
        spawnParticles(spawnCount);
        movementAccumulator = Math.max(0, movementAccumulator - (spawnCount * 12));
        spawnDelay = computeSpawnDelay();
        nextSpawnTime = timestamp + spawnDelay;
      } else if (!pointerRecentlyMoved) {
        movementAccumulator = 0;
      }

      requestAnimationFrame(spawnLoop);
    };

    requestAnimationFrame((time) => {
      nextSpawnTime = time + spawnDelay;
      spawnLoop(time);
    });

    const animateBall = () => {
      ballX += (pointerX - ballX) * 0.12;
      ballY += (pointerY - ballY) * 0.12;
      ball.style.setProperty('--ball-x', `${ballX}px`);
      ball.style.setProperty('--ball-y', `${ballY}px`);
      requestAnimationFrame(animateBall);
    };

    animateBall();

    refreshLavaConfig = () => {
      spawnDelay = computeSpawnDelay();
      const now = getTimestamp();
      nextSpawnTime = now + spawnDelay;
      movementAccumulator = 0;
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        pointerActive = false;
        movementAccumulator = 0;
      } else {
        refreshLavaConfig();
      }
    });
  }
});
