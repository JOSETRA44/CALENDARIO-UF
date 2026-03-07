/**
 * Calendario UF — Main Application
 * Supabase + Vanilla JS · GitHub Pages compatible
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_KEY } from './config.js';

// ─── Supabase client ─────────────────────────────────────────────────────────
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── App state ───────────────────────────────────────────────────────────────
const state = {
  all: [],          // unified, sorted events
  filtered: [],     // currently shown in grid
  activeTab: 'todos',
  query: '',
};

// ─── DOM refs ────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const el = {
  heroLabel:      $('hero-label'),
  heroName:       $('hero-event-name'),
  heroSubtitle:   $('hero-subtitle'),
  cdDays:         $('cd-days'),
  cdHours:        $('cd-hours'),
  cdMinutes:      $('cd-minutes'),
  cdSeconds:      $('cd-seconds'),
  upcomingScroll: $('upcoming-scroll'),
  eventsGrid:     $('events-grid'),
  emptyState:     $('empty-state'),
  searchInput:    $('search-input'),
  currentDate:    $('current-date'),
  footerYear:     $('footer-year'),
};

// ─── Date utilities ───────────────────────────────────────────────────────────
const MONTHS_ES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

/**
 * Given a DATE string (YYYY-MM-DD), return the next Date occurrence
 * using only month + day (recurrence each year).
 */
function nextOccurrence(dateStr) {
  const [, m, d] = dateStr.split('-').map(Number);
  const now  = new Date();
  const year = now.getFullYear();
  let   target = new Date(year, m - 1, d);
  if (target - now < -86400000) {           // already passed today (more than 1 day ago)
    target = new Date(year + 1, m - 1, d);
  }
  return target;
}

/** Returns ms remaining; 0 if in the past. */
function msUntil(date) {
  return Math.max(0, date - new Date());
}

function countdown(ms) {
  return {
    days:    Math.floor(ms / 86_400_000),
    hours:   Math.floor(ms % 86_400_000 / 3_600_000),
    minutes: Math.floor(ms % 3_600_000  /    60_000),
    seconds: Math.floor(ms %    60_000  /     1_000),
  };
}

function formatDateEs(dateStr) {
  const [, m, d] = dateStr.split('-').map(Number);
  return `${d} de ${MONTHS_ES[m - 1]}`;
}

/** True if month+day matches today */
function isToday(dateStr) {
  const now = new Date();
  const [, m, d] = dateStr.split('-').map(Number);
  return now.getMonth() + 1 === m && now.getDate() === d;
}

function pad(n) { return String(n).padStart(2, '0'); }

function labelCountdown(cd, today) {
  if (today)        return '🎉 ¡Hoy!';
  if (cd.days === 0 && cd.hours === 0)  return `En ${cd.minutes}m`;
  if (cd.days === 0)                    return `En ${cd.hours}h ${cd.minutes}m`;
  if (cd.days === 1)                    return 'Mañana';
  if (cd.days <  7)                     return `En ${cd.days} días`;
  if (cd.days < 30)                     return `En ${Math.floor(cd.days / 7)} semanas`;
  return `En ${cd.days} días`;
}

// ─── Data fetching ────────────────────────────────────────────────────────────
async function fetchData() {
  const [{ data: births, error: e1 }, { data: holidays, error: e2 }] = await Promise.all([
    db.from('cumpleanios').select('*').eq('activo', true),
    db.from('dias_festivos').select('*').eq('activo', true),
  ]);

  if (e1) console.error('[Supabase] cumpleanios:', e1.message);
  if (e2) console.error('[Supabase] dias_festivos:', e2.message);

  const birthEvents = (births || []).map(b => ({
    ...b,
    _type:  'birthday',
    _emoji: '🎂',
    _date:  b.fecha_nacimiento,
    _next:  nextOccurrence(b.fecha_nacimiento),
    _today: isToday(b.fecha_nacimiento),
  }));

  const holidayEvents = (holidays || []).map(h => {
    const next = h.es_recurrente ? nextOccurrence(h.fecha) : new Date(h.fecha + 'T00:00:00');
    return {
      ...h,
      _type:  'holiday',
      _emoji: h.icono || '🎉',
      _date:  h.fecha,
      _next:  next,
      _today: isToday(h.fecha),
    };
  }).filter(h => h._next >= new Date() || h._today);

  state.all = [...birthEvents, ...holidayEvents]
    .sort((a, b) => a._next - b._next);
}

// ─── Render: current date ─────────────────────────────────────────────────────
function renderDate() {
  const now = new Date();
  const str = now.toLocaleDateString('es-CL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  el.currentDate.textContent = str.charAt(0).toUpperCase() + str.slice(1);
  el.footerYear.textContent  = now.getFullYear();
}

// ─── Render: hero ────────────────────────────────────────────────────────────
function renderHero() {
  const ev = state.all[0];

  if (!ev) {
    el.heroLabel.textContent    = 'Sin eventos próximos';
    el.heroName.textContent     = 'Agrega eventos en Supabase';
    el.heroName.className       = 'hero__event-name';
    el.heroSubtitle.textContent = '';
    return;
  }

  const isBirth = ev._type === 'birthday';
  el.heroLabel.textContent = isBirth ? '🎂 Próximo Cumpleaños' : '🎉 Próximo Día Festivo';
  el.heroName.textContent  = ev.nombre;
  el.heroName.className    = `hero__event-name hero__event-name--${isBirth ? 'birthday' : 'holiday'}`;

  const sub = [
    formatDateEs(ev._date),
    isBirth && ev.departamento ? `· ${ev.departamento}` : '',
  ].filter(Boolean).join(' ');
  el.heroSubtitle.textContent = sub;
}

// ─── Render: upcoming strip ───────────────────────────────────────────────────
function renderUpcoming() {
  const slice = state.all.slice(0, 10);

  if (slice.length === 0) {
    el.upcomingScroll.innerHTML =
      `<p style="color:var(--c-text-2);font-size:var(--t-sm)">Agrega eventos en Supabase para verlos aquí.</p>`;
    return;
  }

  el.upcomingScroll.innerHTML = slice.map(ev => {
    const cd    = countdown(msUntil(ev._next));
    const today = ev._today;
    const cls   = ev._type === 'birthday' ? 'event-card--birthday' : 'event-card--holiday';
    const cdCls = today ? 'event-card__countdown--today'
                : cd.days < 3 ? 'event-card__countdown--soon' : '';

    return `
      <article class="event-card ${cls}" role="listitem">
        <span class="event-card__emoji" aria-hidden="true">${ev._emoji}</span>
        <span class="event-card__name"  title="${ev.nombre}">${ev.nombre}</span>
        <span class="event-card__date">${formatDateEs(ev._date)}</span>
        <span class="event-card__countdown ${cdCls}"
              data-id="${ev.id}" data-type="${ev._type}">
          ${today ? '🎉 ¡Hoy!' : `${pad(cd.days)}d ${pad(cd.hours)}h ${pad(cd.minutes)}m`}
        </span>
      </article>`.trim();
  }).join('');
}

// ─── Render: main grid ────────────────────────────────────────────────────────
function applyFilters() {
  let list = state.all;
  if (state.activeTab === 'cumpleanos') list = list.filter(e => e._type === 'birthday');
  if (state.activeTab === 'festivos')   list = list.filter(e => e._type === 'holiday');
  if (state.query) {
    const q = state.query.toLowerCase();
    list = list.filter(e =>
      e.nombre.toLowerCase().includes(q) ||
      (e.descripcion   && e.descripcion.toLowerCase().includes(q)) ||
      (e.departamento  && e.departamento.toLowerCase().includes(q))
    );
  }
  state.filtered = list;
}

function renderGrid() {
  applyFilters();
  const list = state.filtered;

  el.emptyState.hidden = list.length > 0;

  if (list.length === 0) {
    el.eventsGrid.innerHTML = '';
    return;
  }

  el.eventsGrid.innerHTML = list.map((ev, i) => {
    const cd      = countdown(msUntil(ev._next));
    const today   = ev._today;
    const isBirth = ev._type === 'birthday';
    const typeCls = isBirth ? 'event-full-card--birthday' : 'event-full-card--holiday';
    const todayCls = today ? 'event-full-card--today' : '';
    const badgeText = isBirth ? 'Cumpleaños' : (ev.tipo || 'Festivo');
    const cdLabel = labelCountdown(cd, today);
    const footCls = today ? 'event-full-card__footer--today'
                  : cd.days < 3 ? 'event-full-card__footer--soon' : '';

    const dept = ev.departamento
      ? `<span style="color:var(--c-text-muted)"> · ${ev.departamento}</span>` : '';
    const desc = ev.descripcion
      ? `<p class="event-full-card__desc">${ev.descripcion}</p>` : '';
    const todayBadge = today ? '<span class="badge-today">HOY</span>' : '';

    return `
      <article class="event-full-card ${typeCls} ${todayCls}"
               role="listitem"
               style="animation-delay:${i * 45}ms">
        <div class="event-full-card__glow" aria-hidden="true"></div>
        <span class="event-full-card__badge">${badgeText}</span>
        <span class="event-full-card__emoji" aria-hidden="true">${ev._emoji}</span>
        <h3 class="event-full-card__name">${ev.nombre}</h3>
        <p class="event-full-card__date">${formatDateEs(ev._date)}${dept}</p>
        ${desc}
        <footer class="event-full-card__footer ${footCls}"
                data-id="${ev.id}" data-type="${ev._type}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
          <span class="cd-live-text">${cdLabel}</span>
          ${todayBadge}
        </footer>
      </article>`.trim();
  }).join('');
}

// ─── Live countdown: hero ─────────────────────────────────────────────────────
function updateHeroCountdown() {
  const ev = state.all[0];
  if (!ev) return;

  const cd = countdown(msUntil(ev._next));
  const pairs = [
    [el.cdDays,    pad(cd.days)],
    [el.cdHours,   pad(cd.hours)],
    [el.cdMinutes, pad(cd.minutes)],
    [el.cdSeconds, pad(cd.seconds)],
  ];

  pairs.forEach(([node, val]) => {
    if (node.textContent !== val) {
      node.textContent = val;
      node.classList.remove('flip');
      void node.offsetWidth;        // force reflow → restart animation
      node.classList.add('flip');
    }
  });
}

// ─── Live countdown: strip + grid ────────────────────────────────────────────
function updateInlineCountdowns() {
  document.querySelectorAll('[data-id][data-type]').forEach(node => {
    const ev = state.all.find(e =>
      String(e.id) === node.dataset.id && e._type === node.dataset.type
    );
    if (!ev) return;

    const cd    = countdown(msUntil(ev._next));
    const today = ev._today;

    if (node.classList.contains('event-card__countdown')) {
      node.textContent = today
        ? '🎉 ¡Hoy!'
        : `${pad(cd.days)}d ${pad(cd.hours)}h ${pad(cd.minutes)}m`;
    } else {
      const txt = node.querySelector('.cd-live-text');
      if (txt) txt.textContent = labelCountdown(cd, today);
    }
  });
}

// ─── Particles (canvas) ───────────────────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let   raf;
  let   particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      r:   Math.random() * 1.4 + 0.4,
      vx:  (Math.random() - 0.5) * 0.28,
      vy:  (Math.random() - 0.5) * 0.28,
      a:   Math.random() * 0.35 + 0.08,
      hue: Math.random() > 0.5 ? 245 : 320,  // indigo or pink
    };
  }

  function init() {
    particles = Array.from({ length: 90 }, makeParticle);
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue},80%,72%,${p.a})`;
      ctx.fill();
      p.x = (p.x + p.vx + canvas.width)  % canvas.width;
      p.y = (p.y + p.vy + canvas.height) % canvas.height;
    }
    raf = requestAnimationFrame(tick);
  }

  resize();
  init();
  tick();
  window.addEventListener('resize', resize, { passive: true });
}

// ─── Scroll reveal ────────────────────────────────────────────────────────────
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('tab--active'); t.setAttribute('aria-selected','false'); t.tabIndex = -1; });
      tab.classList.add('tab--active');
      tab.setAttribute('aria-selected', 'true');
      tab.tabIndex = 0;
      state.activeTab = tab.dataset.tab;
      renderGrid();
    });
  });

  // Keyboard: arrow left/right between tabs
  document.querySelector('.tabs').addEventListener('keydown', e => {
    const active = document.querySelector('.tab--active');
    if (e.key === 'ArrowRight' && active.nextElementSibling?.classList.contains('tab')) {
      active.nextElementSibling.click();
      active.nextElementSibling.focus();
    }
    if (e.key === 'ArrowLeft' && active.previousElementSibling?.classList.contains('tab')) {
      active.previousElementSibling.click();
      active.previousElementSibling.focus();
    }
  });
}

// ─── Search ───────────────────────────────────────────────────────────────────
function initSearch() {
  el.searchInput.addEventListener('input', e => {
    state.query = e.target.value.trim();
    renderGrid();
  });
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────
async function boot() {
  renderDate();
  initParticles();
  initReveal();
  initTabs();
  initSearch();

  try {
    await fetchData();
  } catch (err) {
    console.error('[boot] fetchData failed:', err);
  }

  renderHero();
  renderUpcoming();
  renderGrid();
  updateHeroCountdown();

  // Tick every second
  setInterval(() => {
    updateHeroCountdown();
    updateInlineCountdowns();
  }, 1000);

  // Refresh date label every minute
  setInterval(renderDate, 60_000);

  // Re-fetch data every 5 minutes
  setInterval(async () => {
    await fetchData();
    renderHero();
    renderUpcoming();
    renderGrid();
  }, 300_000);
}

boot();
