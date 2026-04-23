/* ============================================================
   PORTFOLIO — script.js
   Author: Jana Alkahlan
   Assignment 4 — Full Feature Version
   ============================================================ */

/* ─── 1. TIME-BASED GREETING ────────────────────────────────── */
function setGreeting() {
  const el = document.getElementById('greeting');
  if (!el) return;
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    el.textContent = 'Software Engineering Student ☀';
  } else if (hour >= 12 && hour < 18) {
    el.textContent = 'Software Engineering Student ✦';
  } else {
    el.textContent = 'Software Engineering Student ☾';
  }
}

/* ─── 2. THEME TOGGLE ───────────────────────────────────────── */
// Persisted in localStorage under 'portfolio-theme'
const themeBtn  = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const htmlEl    = document.documentElement;

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'light' ? '☾' : '☀';
  localStorage.setItem('portfolio-theme', theme);
}

const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
applyTheme(savedTheme);

themeBtn.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  applyTheme(current === 'light' ? 'dark' : 'light');
});

/* ─── 3. STICKY NAV ─────────────────────────────────────────── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── 4. SCROLL PROGRESS BAR ────────────────────────────────── */
// Updates a CSS width on the #scrollProgress element to reflect scroll %
const scrollProgressBar = document.getElementById('scrollProgress');

function updateScrollProgress() {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgressBar.style.width = scrollPercent + '%';
  scrollProgressBar.setAttribute('aria-valuenow', Math.round(scrollPercent));
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress(); // Initialise on load

/* ─── 5. ACTIVE NAV HIGHLIGHT ───────────────────────────────── */
// Uses IntersectionObserver to highlight the nav link for the visible section
const navLinks   = document.querySelectorAll('.nav__links a[data-section]');
const sections   = document.querySelectorAll('section[id]');

/**
 * Maps a section id to the corresponding nav anchor element.
 */
function getNavLink(sectionId) {
  return document.querySelector(`.nav__links a[data-section="${sectionId}"]`);
}

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const link = getNavLink(entry.target.id);
    if (!link) return;
    if (entry.isIntersecting) {
      // Remove active from all, then add to current
      navLinks.forEach(l => l.classList.remove('nav--active'));
      link.classList.add('nav--active');
    }
  });
}, {
  rootMargin: '-40% 0px -55% 0px', // trigger when section is roughly centred
  threshold: 0,
});

sections.forEach(section => sectionObserver.observe(section));

/* ─── 6. HAMBURGER MENU ─────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen     = false;

function toggleMenu(open) {
  menuOpen = open;
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';

  const bars = hamburger.querySelectorAll('span');
  if (open) {
    bars[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    bars[1].style.opacity   = '0';
    bars[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    bars[0].style.transform = '';
    bars[1].style.opacity   = '';
    bars[2].style.transform = '';
  }
}

hamburger.addEventListener('click', () => toggleMenu(!menuOpen));

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) toggleMenu(false);
});

/* ─── 7. SCROLL REVEAL ──────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── 8. SMOOTH SCROLLING ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top
                 + window.scrollY
                 - nav.offsetHeight - 8;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ─── 9. ANIMATED STAT COUNTERS ─────────────────────────────── */
// Numbers animate from 0 to their data-target value when the hero is visible
const statNums = document.querySelectorAll('.stat-item__num[data-target]');
let countersStarted = false;

/**
 * Animates a number element from 0 to its data-target value.
 * Uses requestAnimationFrame for smooth 60fps animation.
 */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1200; // ms
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target; // Ensure exact final value
  }

  requestAnimationFrame(step);
}

// Observe hero section; start counters once it enters view
const heroSection = document.querySelector('.hero');
const counterObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    // Small stagger between each counter
    statNums.forEach((el, i) => {
      setTimeout(() => animateCounter(el), i * 180);
    });
    counterObserver.disconnect();
  }
}, { threshold: 0.4 });

if (heroSection) counterObserver.observe(heroSection);

/* ─── 10. FAVOURITES SYSTEM ─────────────────────────────────── */
// Stores a Set of project IDs in localStorage under 'portfolio-favourites'
const FAV_KEY  = 'portfolio-favourites';
const favBtns  = document.querySelectorAll('.card__fav-btn');

/**
 * Loads the favourites set from localStorage.
 */
function loadFavourites() {
  try {
    const stored = localStorage.getItem(FAV_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
}

/**
 * Saves the favourites set back to localStorage.
 */
function saveFavourites(favSet) {
  localStorage.setItem(FAV_KEY, JSON.stringify([...favSet]));
}

// Live favourites state
let favourites = loadFavourites();

/**
 * Applies visual (active) state to all star buttons and cards
 * based on the current favourites set.
 */
function renderFavourites() {
  favBtns.forEach(btn => {
    const id = btn.dataset.id;
    const card = btn.closest('.card');
    const isFav = favourites.has(id);
    btn.classList.toggle('fav--active', isFav);
    btn.setAttribute('aria-pressed', isFav);
    if (card) card.classList.toggle('card--favourited', isFav);
  });
}

// Wire up each star button
favBtns.forEach(btn => {
  btn.addEventListener('click', e => {
    // Prevent click from also opening the modal
    e.stopPropagation();
    const id = btn.dataset.id;
    if (favourites.has(id)) {
      favourites.delete(id);
    } else {
      favourites.add(id);
    }
    saveFavourites(favourites);
    renderFavourites();
    // Re-apply filters in case 'favourites' filter is active
    applyFilters();
  });
});

renderFavourites(); // Apply on load

/* ─── 11. PROJECT FILTERING + SEARCH + SORTING ──────────────── */
const cards        = Array.from(document.querySelectorAll('.card[data-category]'));
const emptyState   = document.getElementById('projectsEmpty');
const searchInput  = document.getElementById('projectSearch');
const searchClear  = document.getElementById('searchClear');
const filterBtns   = document.querySelectorAll('.filter-btn');
const sortSelect   = document.getElementById('sortSelect');
const projectsGrid = document.getElementById('projectsGrid');

// Restore saved state from localStorage
const savedFilter = localStorage.getItem('portfolio-filter') || 'all';
const savedSearch = localStorage.getItem('portfolio-search') || '';

let activeFilter = savedFilter;
let searchQuery  = savedSearch;

// Restore visual state
filterBtns.forEach(btn => {
  btn.classList.toggle('active', btn.dataset.filter === activeFilter);
});
if (searchInput && savedSearch) {
  searchInput.value = savedSearch;
}

/**
 * Shows a card with fade-in animation.
 */
function showCard(card) {
  card.classList.remove('card--hidden');
  card.classList.remove('card--fade-in');
  void card.offsetWidth; // Reflow to restart animation
  card.classList.add('card--fade-in');
}

/**
 * Hides a card instantly.
 */
function hideCard(card) {
  card.classList.add('card--hidden');
  card.classList.remove('card--fade-in');
}

/**
 * Returns a sorted copy of the card array based on the sort dropdown value.
 * Sorting options: default | name-az | name-za | category
 */
function getSortedCards(cardArray) {
  const sortValue = sortSelect ? sortSelect.value : 'default';
  const sorted = [...cardArray];

  if (sortValue === 'name-az') {
    sorted.sort((a, b) => (a.dataset.title || '').localeCompare(b.dataset.title || ''));
  } else if (sortValue === 'name-za') {
    sorted.sort((a, b) => (b.dataset.title || '').localeCompare(a.dataset.title || ''));
  } else if (sortValue === 'category') {
    sorted.sort((a, b) => (a.dataset.category || '').localeCompare(b.dataset.category || ''));
  }
  return sorted;
}

/**
 * Main filter + sort + search function.
 * Re-orders DOM nodes efficiently, then shows/hides based on matching.
 */
function applyFilters() {
  const query = searchQuery.toLowerCase().trim();
  let visibleCount = 0;

  const sortedCards = getSortedCards(cards);

  // Re-append in sorted order (DOM move, no re-create)
  sortedCards.forEach(card => projectsGrid.appendChild(card));

  sortedCards.forEach(card => {
    const category = card.dataset.category || '';
    const title    = (card.dataset.title || '').toLowerCase();
    const desc     = (card.dataset.desc  || '').toLowerCase();
    const cardId   = card.dataset.id;

    const matchesFilter =
      activeFilter === 'all'
      || (activeFilter === 'favourites' && favourites.has(cardId))
      || category === activeFilter;

    const matchesSearch = !query || title.includes(query) || desc.includes(query);

    if (matchesFilter && matchesSearch) {
      showCard(card);
      visibleCount++;
    } else {
      hideCard(card);
    }
  });

  if (emptyState) emptyState.hidden = visibleCount > 0;
  if (searchClear) searchClear.hidden = query.length === 0;

  // Persist preferences
  localStorage.setItem('portfolio-filter', activeFilter);
  localStorage.setItem('portfolio-search', searchQuery);
}

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    applyFilters();
  });
});

// Live search
if (searchInput) {
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    applyFilters();
  });
}

// Clear search
if (searchClear) {
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    applyFilters();
    searchInput.focus();
  });
}

// Sort
if (sortSelect) {
  sortSelect.addEventListener('change', applyFilters);
}

/* ─── 12. PROJECT PREVIEW MODAL ─────────────────────────────── */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const modal        = document.getElementById('modal');

// Map data-category values to CSS header colour classes
const CARD_TOP_CLASSES = {
  'machine-learning': 'card__top--rose',
  'desktop':          'card__top--terra',
  'web':              'card__top--blush',
  'default':          'card__top--sage',
};

/**
 * Opens the project modal, populating it with data from the clicked card.
 * @param {HTMLElement} card - The project card element that was clicked.
 */
function openModal(card) {
  const title    = card.dataset.title    || '';
  const desc     = card.dataset.desc     || '';
  const tech     = card.dataset.tech     || '';
  const emoji    = card.dataset.emoji    || '';
  const num      = card.dataset.num      || '';
  const category = card.dataset.category || 'default';

  // Populate fields
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDesc').textContent  = desc;
  document.getElementById('modalTech').textContent  = tech;
  document.getElementById('modalEmoji').textContent = emoji;
  document.getElementById('modalNum').textContent   = num;

  // Populate chips from the card's own chips
  const modalChips = document.getElementById('modalChips');
  modalChips.innerHTML = '';
  card.querySelectorAll('.chip').forEach(chip => {
    const clone = chip.cloneNode(true);
    modalChips.appendChild(clone);
  });

  // Apply matching header colour class
  const header = document.getElementById('modalHeader');
  header.className = 'modal__header'; // reset
  const colourClass = CARD_TOP_CLASSES[category] || CARD_TOP_CLASSES['default'];
  header.classList.add(colourClass);

  // Show overlay; lock body scroll
  modalOverlay.hidden = false;
  document.body.style.overflow = 'hidden';

  // Focus the close button for accessibility
  requestAnimationFrame(() => modalClose.focus());
}

/**
 * Closes the project modal and restores scroll.
 */
function closeModal() {
  modalOverlay.hidden = true;
  document.body.style.overflow = '';
}

// Open modal on card click or Enter/Space key
cards.forEach(card => {
  card.addEventListener('click', e => {
    // Don't open if the star button was clicked
    if (e.target.closest('.card__fav-btn')) return;
    openModal(card);
  });

  card.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.card__fav-btn')) {
      e.preventDefault();
      openModal(card);
    }
  });
});

// Close via button or overlay backdrop click
if (modalClose)   modalClose.addEventListener('click', closeModal);
if (modalOverlay) {
  modalOverlay.addEventListener('click', e => {
    // Only close if clicking the overlay itself, not the modal card
    if (e.target === modalOverlay) closeModal();
  });
}

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
});

/* ─── 13. FORM VALIDATION ───────────────────────────────────── */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const successMsg = document.getElementById('formSuccess');

/**
 * Validates a single field by id and type.
 * Returns an error string, or '' if valid.
 */
function validate(id, type) {
  const el  = document.getElementById(id);
  const val = el.value.trim();
  if (!val) return 'This field is required.';
  if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
    return 'Please enter a valid email address.';
  if (type === 'textarea' && val.length < 10)
    return 'Please write at least 10 characters.';
  return '';
}

/**
 * Sets or clears the inline error for a field.
 */
function setFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const errEl = document.getElementById(errorId);
  if (message) {
    errEl.textContent = message;
    input.classList.add('invalid');
  } else {
    errEl.textContent = '';
    input.classList.remove('invalid');
  }
}

// Real-time inline validation
['name', 'email', 'message'].forEach(id => {
  const el   = document.getElementById(id);
  const type = id === 'message' ? 'textarea' : id;
  el.addEventListener('input', () => {
    setFieldError(id, id + 'Error', validate(id, type));
  });
});

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const nameErr    = validate('name',    'text');
    const emailErr   = validate('email',   'email');
    const messageErr = validate('message', 'textarea');

    setFieldError('name',    'nameError',    nameErr);
    setFieldError('email',   'emailError',   emailErr);
    setFieldError('message', 'messageError', messageErr);

    if (nameErr || emailErr || messageErr) {
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      return;
    }

    // Sending state
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';
    if (successMsg) successMsg.classList.remove('show');

    setTimeout(() => {
      submitBtn.textContent = 'Sent ✓';
      if (successMsg) successMsg.classList.add('show');

      // Reset fully after 4 s
      setTimeout(() => {
        form.reset();
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Message';
        ['name', 'email', 'message'].forEach(id => setFieldError(id, id + 'Error', ''));
        if (successMsg) successMsg.classList.remove('show');
      }, 4000);
    }, 1200);
  });
}

/* ─── 14. GITHUB API INTEGRATION ────────────────────────────── */
const githubUsername = 'Jana-101';
const githubApiUrl   = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=12`;

const githubLoading = document.getElementById('githubLoading');
const githubError   = document.getElementById('githubError');
const githubGrid    = document.getElementById('githubGrid');
const githubRetry   = document.getElementById('githubRetry');

// Language → GitHub-style colour map
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python:     '#3572A5',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Java:       '#b07219',
  'VB.NET':   '#945db7',
  'C#':       '#178600',
  C:          '#555555',
  'C++':      '#f34b7d',
  Default:    '#8a7060',
};

function getLangColor(lang) {
  return LANG_COLORS[lang] || LANG_COLORS.Default;
}

/**
 * Builds a repo card as an anchor element that opens GitHub.
 */
function buildRepoCard(repo) {
  // Make the whole card a link to the repo
  const card = document.createElement('a');
  card.className = 'repo-card';
  card.href      = repo.html_url;
  card.target    = '_blank';
  card.rel       = 'noopener noreferrer';
  card.setAttribute('aria-label', `View ${repo.name} on GitHub`);

  // Repo name
  const nameEl = document.createElement('div');
  nameEl.className  = 'repo-card__name';
  nameEl.textContent = repo.name;

  // Description
  const descEl = document.createElement('p');
  descEl.className  = repo.description
    ? 'repo-card__desc'
    : 'repo-card__desc repo-card__desc--empty';
  descEl.textContent = repo.description || 'No description provided.';

  // Meta: language + stars
  const metaEl = document.createElement('div');
  metaEl.className = 'repo-card__meta';

  if (repo.language) {
    const langEl = document.createElement('span');
    langEl.className = 'repo-card__lang';
    const dot = document.createElement('span');
    dot.className = 'repo-card__lang-dot';
    dot.style.background = getLangColor(repo.language);
    langEl.appendChild(dot);
    langEl.appendChild(document.createTextNode(repo.language));
    metaEl.appendChild(langEl);
  }

  const starsEl = document.createElement('span');
  starsEl.className = 'repo-card__stars';
  starsEl.innerHTML = `<span class="repo-card__stars-icon">★</span> ${repo.stargazers_count}`;
  metaEl.appendChild(starsEl);

  card.appendChild(nameEl);
  card.appendChild(descEl);
  card.appendChild(metaEl);

  return card;
}

/**
 * Fetches repos from the GitHub API and renders them.
 * Handles loading, error, and empty states.
 */
async function fetchGithubRepos() {
  githubLoading.hidden = false;
  githubError.hidden   = true;
  githubGrid.hidden    = true;
  githubGrid.innerHTML = '';

  try {
    const response = await fetch(githubApiUrl);
    if (!response.ok) throw new Error(`Status ${response.status}`);

    const repos = await response.json();
    githubLoading.hidden = true;
    githubGrid.hidden    = false;

    if (!repos.length) {
      githubGrid.innerHTML = '<p style="color:var(--text-3);font-size:0.85rem;">No public repositories found.</p>';
      return;
    }

    repos.forEach(repo => githubGrid.appendChild(buildRepoCard(repo)));

  } catch (err) {
    console.warn('GitHub API error:', err);
    githubLoading.hidden = true;
    githubError.hidden   = false;
  }
}

if (githubRetry) githubRetry.addEventListener('click', fetchGithubRepos);

/* ─── 15. USER NAME & WELCOME BANNER ────────────────────────── */
const nameModal     = document.getElementById('nameModal');
const nameInput     = document.getElementById('nameInput');
const nameSubmit    = document.getElementById('nameSubmit');
const nameSkip      = document.getElementById('nameSkip');
const welcomeBanner = document.getElementById('welcomeBanner');
const welcomeText   = document.getElementById('welcomeText');


function showWelcomeBanner(name) {
  if (!welcomeBanner || !welcomeText) return;

  const isStranger =
    !name || name === '__skipped__' || name.trim() === '';

  if (isStranger) {
    welcomeText.textContent = `Hello there, stranger! 👋`;
  } else {
    welcomeText.textContent = `Welcome,  ${name}! 👋`;
  }

  welcomeBanner.hidden = false;
}

function dismissWelcome() {
  if (welcomeBanner) welcomeBanner.hidden = true;
}

function saveName() {
  const name = nameInput ? nameInput.value.trim() : '';
  if (name) {
    localStorage.setItem('portfolio-username', name);
    showWelcomeBanner(name);
  }
  if (nameModal) nameModal.hidden = true;
  document.body.style.overflow = '';
}

function skipName() {
  localStorage.setItem('portfolio-username', '__skipped__');

  showWelcomeBanner('__skipped__');

  if (nameModal) nameModal.hidden = true;
  document.body.style.overflow = '';
}

if (nameSubmit) nameSubmit.addEventListener('click', saveName);
if (nameSkip)   nameSkip.addEventListener('click', skipName);
if (nameInput) {
  nameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter')  saveName();
    if (e.key === 'Escape') skipName();
  });
}


function initNameFlow() {
  const storedName = localStorage.getItem('portfolio-username');
  if (!storedName) {
    setTimeout(() => {
      if (nameModal) {
        nameModal.hidden = false;
        document.body.style.overflow = 'hidden';
        if (nameInput) nameInput.focus();
      }
    }, 1800);
  } else if (storedName !== '__skipped__') {
    showWelcomeBanner(storedName);
    setTimeout(dismissWelcome, 5000);
  }
}

/* ─── 16. SESSION TIMER ─────────────────────────────────────── */
const sessionTimerText = document.getElementById('sessionTimerText');
const sessionStart     = Date.now();

/**
 * Formats elapsed seconds into a human-readable duration string.
 */
function formatElapsed(seconds) {
  if (seconds < 60)   return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

function updateSessionTimer() {
  const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
  if (sessionTimerText) {
    sessionTimerText.textContent = `You've been here for ${formatElapsed(elapsed)}`;
  }
}

setInterval(updateSessionTimer, 1000);
updateSessionTimer();

/* ─── 17. SITE GUIDE DISMISS ────────────────────────────────── */
const siteGuide      = document.getElementById('siteGuide');
const siteGuideClose = document.getElementById('siteGuideClose');

function dismissGuide() {
  if (siteGuide) {
    siteGuide.classList.add('site-guide--hidden');
    localStorage.setItem('portfolio-guide-dismissed', '1');
  }
}

if (siteGuideClose) siteGuideClose.addEventListener('click', dismissGuide);

// If user already dismissed, hide immediately without animation
if (localStorage.getItem('portfolio-guide-dismissed') === '1' && siteGuide) {
  siteGuide.style.display = 'none';
}

/* ─── INIT ──────────────────────────────────────────────────── */
setGreeting();
applyFilters();       // Restore saved filter/search/sort state
fetchGithubRepos();   // Load GitHub repositories
initNameFlow();       // Name prompt / welcome banner