/* SocialBalance Web · Sitio independiente del videojuego Processing.
   Animaciones, demostraciones e interacciones web sin bibliotecas externas. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (num, min, max) => Math.max(min, Math.min(max, num));

  // Barra de avance, menú y parallax del escenario.
  const siteHeader = $('#siteHeader');
  const progress = $('#readingProgress');
  const story = $('#historia');
  const roomImage = $('#storyRoom');
  const storyWalker = $('.story-walker');
  let ticking = false;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max <= 0 ? 0 : (scrollY / max) * 100}%`;
    siteHeader.classList.toggle('scrolled', scrollY > 35);
    if (story && !prefersReducedMotion.matches) {
      const rect = story.getBoundingClientRect();
      const fraction = clamp((innerHeight - rect.top) / (rect.height + innerHeight), 0, 1);
      storyWalker.style.setProperty('--walk-x', `${Math.round(fraction * 275)}%`);
      roomImage.style.transform = `translate3d(0, ${(fraction - .5) * 28}px, 0) scale(1.06)`;
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScroll);
  }, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    mainNav.classList.remove('open');
  };
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
  });
  $$('a', mainNav).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  // Entrada de elementos y resaltado de navegación.
  const revealElements = $$('.reveal');
  if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -28px 0px', threshold: .055 });
    revealElements.forEach(el => revealObserver.observe(el));
  }
  if ('IntersectionObserver' in window) {
    const navigationLinks = $$('a[href^="#"]', mainNav);
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navigationLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-20% 0px -65% 0px' });
    $$('main > section[id]').forEach(el => sectionObserver.observe(el));
  }

  // Animación real: cada hoja original contiene cuatro columnas de movimiento.
  // Los fotogramas se extrajeron sin alterar su dibujo, usando vecino más cercano.
  const walkers = $$('.walker');
  let selectedCharacter = 'chica';
  let walkerFrame = 0;
  const updateSpriteImages = () => {
    walkers.forEach(walker => {
      const person = walker.dataset.character || selectedCharacter;
      const direction = walker.dataset.direction || 'derecha';
      walker.style.backgroundImage = `url("assets/${person}-${direction}.webp")`;
      walker.style.backgroundPosition = `${walkerFrame * 100 / 3}% 0`;
    });
  };
  updateSpriteImages();
  let spriteTimer = null;
  const updateAnimationState = () => {
    if (spriteTimer) clearInterval(spriteTimer);
    spriteTimer = null;
    if (prefersReducedMotion.matches || document.hidden) return;
    spriteTimer = setInterval(() => {
      walkerFrame = (walkerFrame + 1) % 4;
      walkers.forEach(walker => walker.style.backgroundPosition = `${walkerFrame * 100 / 3}% 0`);
    }, 155);
  };
  updateAnimationState();
  document.addEventListener('visibilitychange', updateAnimationState);
  if (prefersReducedMotion.addEventListener) prefersReducedMotion.addEventListener('change', updateAnimationState);

  // Selección interactiva de personajes.
  const characterLabel = $('#selectedCharacterName');
  const characterWalker = $('#selectedWalker');
  const names = { chico: 'CHICO', chica: 'CHICA', nobin: 'NOBIN' };
  const indices = { chico: '01', chica: '02', nobin: '03' };
  $$('[data-select-character]').forEach(button => {
    button.addEventListener('click', () => {
      selectedCharacter = button.dataset.selectCharacter;
      $$('[data-select-character]').forEach(option => {
        const active = option === button;
        option.classList.toggle('is-active', active);
        option.setAttribute('aria-pressed', String(active));
      });
      walkers.forEach(walker => walker.dataset.character = selectedCharacter);
      characterLabel.textContent = names[selectedCharacter];
      $('.nameplate-note').textContent = `PERSONAJE ${indices[selectedCharacter]} / 03`;
      characterWalker.setAttribute('aria-label', `Personaje ${names[selectedCharacter]} caminando en pixel art`);
      updateSpriteImages();
    });
  });

  // Escenarios de la visita: fuentes originales del directorio data/.
  const sceneMap = {
    room: { url: 'assets/habitacion.webp', label: 'HABITACIÓN', alt: 'Escenario de la habitación original de SocialBalance' },
    library: { url: 'assets/biblioteca.webp', label: 'BIBLIOTECA', alt: 'Escenario de la biblioteca original de SocialBalance' }
  };
  $$('[data-scene]').forEach(button => {
    button.addEventListener('click', () => {
      const scene = sceneMap[button.dataset.scene];
      if (!scene) return;
      $$('[data-scene]').forEach(item => {
        item.classList.toggle('is-active', item === button);
        item.setAttribute('aria-pressed', String(item === button));
      });
      roomImage.classList.add('fade-out');
      const change = () => {
        roomImage.src = scene.url;
        roomImage.alt = scene.alt;
        $('#sceneLabel').textContent = scene.label;
        roomImage.classList.remove('fade-out');
      };
      if (prefersReducedMotion.matches) change();
      else setTimeout(change, 160);
    });
  });

  // Demostración educativa de acciones REALES del HUD.pde.
  // Datos de inicio: energía 75, estrés 20, concentración 80, hora 8:00.
  const INITIAL = { energia: 75, estres: 20, concentracion: 80, minutes: 8 * 60 };
  let demo = { ...INITIAL };
  const demoClock = $('#demoClock');
  const feedback = $('#demoFeedback');
  const formatClock = total => {
    let hour = Math.floor(total / 60);
    const min = String(total % 60).padStart(2, '0');
    const period = hour < 12 ? 'A. M.' : 'P. M.';
    hour %= 12;
    if (hour === 0) hour = 12;
    return `${hour}:${min} ${period}`;
  };
  const refreshStats = () => {
    ['energia', 'estres', 'concentracion'].forEach(name => {
      const value = demo[name];
      const output = $(`#${name}Value`);
      output.innerHTML = `${value}<span>/100</span>`;
      $(`#${name}Bar`).style.width = `${value}%`;
      output.parentElement.setAttribute('aria-label', `${name}: ${value} de 100`);
    });
    demoClock.textContent = formatClock(demo.minutes);
  };
  $$('[data-action]').forEach(button => button.addEventListener('click', () => {
    if (demo.minutes + 15 > 21 * 60 + 30) {
      feedback.textContent = 'Ya terminó el día simulado. Pulsa Reiniciar demo.';
      return;
    }
    const action = button.dataset.action;
    if (action === 'rest') {
      demo.energia = clamp(demo.energia + 10, 0, 100);
      demo.concentracion = clamp(demo.concentracion + 8, 0, 100);
      feedback.textContent = '☾ Descansaste 15 minutos. Recuperaste energía y concentración.';
    } else {
      demo.estres = clamp(demo.estres - 12, 0, 100);
      demo.energia = clamp(demo.energia - 3, 0, 100);
      demo.concentracion = clamp(demo.concentracion - 3, 0, 100);
      feedback.textContent = '♡ Usaste el celular 15 minutos. Bajó el estrés, pero gastaste energía y concentración.';
    }
    demo.minutes += 15;
    refreshStats();
  }));
  $('#demoReset').addEventListener('click', () => {
    demo = { ...INITIAL };
    feedback.textContent = 'Reiniciamos el ejemplo. ¿Qué decisión tomarás ahora?';
    refreshStats();
  });
  refreshStats();

  // Tabs: cada minijuego enseña un panel con una representación visual propia.
  const tabs = $$('[role="tab"][data-game]');
  const activateGame = (nextTab, focus = false) => {
    tabs.forEach(tab => {
      const active = tab === nextTab;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      $(`#panel-${tab.dataset.game}`).hidden = !active;
    });
    if (focus) nextTab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateGame(tab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      activateGame(tabs[next], true);
    });
  });

  // Microinteracción de cartas: solamente una vista previa, no el minijuego.
  $$('.memory-card').forEach(button => {
    button.addEventListener('click', () => {
      const flipped = button.classList.toggle('flipped');
      $('img', button).src = flipped ? `assets/${button.dataset.card}` : 'assets/carta-reverso.webp';
      button.setAttribute('aria-label', flipped ? 'Ocultar carta' : 'Revelar carta');
    });
  });

  // Pequeñas explicaciones interactivas de los patrones de diseño.
  const states = [
    'Las cartas están tapadas y el juego prepara la siguiente fase.',
    'Se muestran las cartas durante un tiempo para recordar sus posiciones.',
    'El jugador escoge parejas; los resultados activan nuevas transiciones.'
  ];
  $$('[data-state]').forEach(button => button.addEventListener('click', () => {
    $$('[data-state]').forEach(item => item.classList.toggle('is-active', item === button));
    $('#stateFeedback').textContent = states[Number(button.dataset.state)];
  }));
  const strategies = [
    'Variante con criterios de vocales iguales. Cambia la regla, no la estructura del minijuego.',
    'Variante que valida una escalera de vocales. Se sustituye la estrategia activa.',
    'Variante que comprueba un patrón inverso. Mantiene la misma interfaz para evaluar.'
  ];
  $$('[data-strategy]').forEach(button => button.addEventListener('click', () => {
    $$('[data-strategy]').forEach(item => item.classList.toggle('is-active', item === button));
    $('#strategyFeedback').textContent = strategies[Number(button.dataset.strategy)];
  }));
})();
