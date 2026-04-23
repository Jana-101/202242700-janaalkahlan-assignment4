/* ============================================================
   PORTFOLIO — script.js
   Author: Jana Alkahlan
   Assignment 3 — Full Feature Version
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
  // Persist preference
  localStorage.setItem('portfolio-theme', theme);
}

// Restore saved preference (default: light)
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

/* ─── 4. HAMBURGER MENU ─────────────────────────────────────── */
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

/* ─── 5. SCROLL REVEAL ──────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── 6. SMOOTH SCROLLING ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top
                 + window.scrollY
                 - nav.offsetHeight;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ─── 7. PROJECT FILTERING + LIVE SEARCH + SORTING ─────────── */
// All cards that can be filtered/sorted
const cards       = Array.from(document.querySelectorAll('.card[data-category]'));
const emptyState  = document.getElementById('projectsEmpty');
const searchInput = document.getElementById('projectSearch');
const searchClear = document.getElementById('searchClear');
const filterBtns  = document.querySelectorAll('.filter-btn');
const sortSelect  = document.getElementById('sortSelect');
const projectsGrid = document.getElementById('projectsGrid');

// --- State: Restore saved preferences from localStorage ---
// Restore last active filter
const savedFilter = localStorage.getItem('portfolio-filter') || 'all';
// Restore last search query
const savedSearch = localStorage.getItem('portfolio-search') || '';

let activeFilter = savedFilter;
let searchQuery  = savedSearch;

// Apply restored filter button state visually
filterBtns.forEach(btn => {
  btn.classList.toggle('active', btn.dataset.filter === activeFilter);
});

// Apply restored search value
if (searchInput && savedSearch) {
  searchInput.value = savedSearch;
}

/**
 * Shows a card with a fade-in animation.
 */
function showCard(card) {
  card.classList.remove('card--hidden');
  card.classList.remove('card--fade-in');
  void card.offsetWidth; // Trigger reflow to restart animation
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
 * Sorts an array of card elements based on current sort value.
 * Sorting options: default, name-az, name-za, category
 */
function getSortedCards(cardArray) {
  const sortValue = sortSelect ? sortSelect.value : 'default';

  const sorted = [...cardArray]; // Clone to avoid mutating original

  if (sortValue === 'name-az') {
    sorted.sort((a, b) =>
      (a.dataset.title || '').localeCompare(b.dataset.title || '')
    );
  } else if (sortValue === 'name-za') {
    sorted.sort((a, b) =>
      (b.dataset.title || '').localeCompare(a.dataset.title || '')
    );
  } else if (sortValue === 'category') {
    sorted.sort((a, b) =>
      (a.dataset.category || '').localeCompare(b.dataset.category || '')
    );
  }
  // 'default' = original DOM order (no sort)

  return sorted;
}

/**
 * Applies current filter + search + sort state to all cards.
 * Only re-orders DOM when sorting is active to avoid unnecessary updates.
 */
function applyFilters() {
  const query = searchQuery.toLowerCase().trim();
  let visibleCount = 0;

  // Get sorted order
  const sortedCards = getSortedCards(cards);

  // Re-append cards to grid in sorted order (efficient: only moves DOM nodes)
  sortedCards.forEach(card => {
    projectsGrid.appendChild(card);
  });

  // Now filter: show/hide each card based on filter + search
  sortedCards.forEach(card => {
    const category = card.dataset.category || '';
    const title    = (card.dataset.title    || '').toLowerCase();
    const desc     = (card.dataset.desc     || '').toLowerCase();

    const matchesFilter = activeFilter === 'all' || category === activeFilter;
    const matchesSearch = !query || title.includes(query) || desc.includes(query);

    if (matchesFilter && matchesSearch) {
      showCard(card);
      visibleCount++;
    } else {
      hideCard(card);
    }
  });

  // Show/hide empty state message
  if (emptyState) {
    emptyState.hidden = visibleCount > 0;
  }

  // Show/hide the clear search button
  if (searchClear) {
    searchClear.hidden = query.length === 0;
  }

  // Persist state to localStorage
  localStorage.setItem('portfolio-filter', activeFilter);
  localStorage.setItem('portfolio-search', searchQuery);
}

// Filter button clicks
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    applyFilters();
  });
});

// Live search input
if (searchInput) {
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    applyFilters();
  });
}

// Clear button
if (searchClear) {
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    applyFilters();
    searchInput.focus();
  });
}

// Sort dropdown change
if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    applyFilters();
  });
}

/* ─── 8. FORM VALIDATION ────────────────────────────────────── */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const successMsg = document.getElementById('formSuccess');

/**
 * Validates a single field.
 * Returns an error string if invalid, or '' if valid.
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
 * Shows or clears an inline error for a field,
 * and toggles the 'invalid' CSS class accordingly.
 */
function setFieldError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const errEl = document.getElementById(errorId);
  if (message) {
    errEl.textContent = message;
    input.classList.add('invalid');
  } else {
    // Always clear error text and invalid class when message is empty
    errEl.textContent = '';
    input.classList.remove('invalid');
  }
}

// Clear errors in real-time as user types — instant feedback
['name', 'email', 'message'].forEach(id => {
  const el   = document.getElementById(id);
  const type = id === 'message' ? 'textarea' : id;
  el.addEventListener('input', () => {
    const err = validate(id, type);
    setFieldError(id, id + 'Error', err);
  });
});

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Validate all fields
    const nameErr    = validate('name',    'text');
    const emailErr   = validate('email',   'email');
    const messageErr = validate('message', 'textarea');

    setFieldError('name',    'nameError',    nameErr);
    setFieldError('email',   'emailError',   emailErr);
    setFieldError('message', 'messageError', messageErr);

    const hasErrors = nameErr || emailErr || messageErr;

    if (hasErrors) {
      // Scroll to the first invalid field for usability
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      return;
    }

    // ── Sending state ──────────────────────────────────────
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';
    if (successMsg) successMsg.classList.remove('show');

    // Simulate async send (replace with real API call if needed)
    setTimeout(() => {
      submitBtn.textContent = 'Sent ✓';

      // Show success message
      if (successMsg) successMsg.classList.add('show');

      // Reset form fully — clear fields AND all error states
      setTimeout(() => {
        form.reset();
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Message';

        // Explicitly clear all inline errors after reset
        ['name', 'email', 'message'].forEach(id => {
          setFieldError(id, id + 'Error', '');
        });

        // Hide success message
        if (successMsg) successMsg.classList.remove('show');
      }, 4000);

    }, 1200);
  });
}

/* ─── 9. GITHUB API INTEGRATION ─────────────────────────────── */
const githubUsername = 'Jana-101';
const githubApiUrl   = `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=12`;

const githubLoading = document.getElementById('githubLoading');
const githubError   = document.getElementById('githubError');
const githubGrid    = document.getElementById('githubGrid');
const githubRetry   = document.getElementById('githubRetry');

/**
 * Language dot colours — approximate common GitHub language colours.
 */
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

/**
 * Returns a colour hex string for a given language name.
 */
function getLangColor(lang) {
  return LANG_COLORS[lang] || LANG_COLORS.Default;
}

/**
 * Builds and returns a single repo card DOM element.
 */
function buildRepoCard(repo) {
  const card = document.createElement('div');
  card.className = 'repo-card';

  // Repo name with link
  const nameEl = document.createElement('div');
  nameEl.className = 'repo-card__name';
  const nameLink = document.createElement('a');
  nameLink.href   = repo.html_url;
  nameLink.target = '_blank';
  nameLink.rel    = 'noopener noreferrer';
  nameLink.textContent = repo.name;
  nameEl.appendChild(nameLink);

  // Description (or fallback text)
  const descEl = document.createElement('p');
  descEl.className = repo.description
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
 * Fetches repos from GitHub API and renders them.
 * Uses async/await. Shows error message on failure.
 */
async function fetchGithubRepos() {
  // Show loading, hide others
  githubLoading.hidden = false;
  githubError.hidden   = true;
  githubGrid.hidden    = true;
  githubGrid.innerHTML = '';

  try {
    const response = await fetch(githubApiUrl);

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const repos = await response.json();

    // Hide loading, show grid
    githubLoading.hidden = true;
    githubGrid.hidden    = false;

    if (!repos.length) {
      // Edge case: user has no public repos
      githubGrid.innerHTML = '<p style="color:var(--text-3);font-size:0.85rem;">No public repositories found.</p>';
      return;
    }

    // Build and append a card for each repo
    repos.forEach(repo => {
      const card = buildRepoCard(repo);
      githubGrid.appendChild(card);
    });

  } catch (err) {
    // Log for debugging; show user-friendly message
    console.warn('GitHub API error:', err);
    githubLoading.hidden = true;
    githubError.hidden   = false;
  }
}

// Retry button
if (githubRetry) {
  githubRetry.addEventListener('click', fetchGithubRepos);
}

/* ─── 10. STATE MANAGEMENT — USER NAME (BONUS) ──────────────── */
const nameModal   = document.getElementById('nameModal');
const nameInput   = document.getElementById('nameInput');
const nameSubmit  = document.getElementById('nameSubmit');
const nameSkip    = document.getElementById('nameSkip');
const welcomeBanner     = document.getElementById('welcomeBanner');
const welcomeText       = document.getElementById('welcomeText');
const welcomeClose      = document.getElementById('welcomeClose');

/**
 * Shows the personalised welcome banner.
 */
function showWelcomeBanner(name) {
  if (!welcomeBanner || !welcomeText) return;
  welcomeText.textContent = `Welcome back, ${name}! 👋`;
  welcomeBanner.hidden = false;
}

/**
 * Dismisses and closes the welcome banner.
 */
function dismissWelcome() {
  if (welcomeBanner) welcomeBanner.hidden = true;
}

/**
 * Saves the user's name and closes the modal.
 */
function saveName() {
  const name = nameInput ? nameInput.value.trim() : '';
  if (name) {
    localStorage.setItem('portfolio-username', name);
    showWelcomeBanner(name);
  }
  if (nameModal) nameModal.hidden = true;
  document.body.style.overflow = ''; // Restore scrolling
}

/**
 * Skips name entry and closes the modal without saving.
 */
function skipName() {
  localStorage.setItem('portfolio-username', '__skipped__');
  if (nameModal) nameModal.hidden = true;
  document.body.style.overflow = '';
}

// Wire up modal buttons
if (nameSubmit) nameSubmit.addEventListener('click', saveName);
if (nameSkip)   nameSkip.addEventListener('click', skipName);

// Allow pressing Enter to submit name
if (nameInput) {
  nameInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') saveName();
    if (e.key === 'Escape') skipName();
  });
}

// Close welcome banner
if (welcomeClose) welcomeClose.addEventListener('click', dismissWelcome);

/**
 * Initialises the name/welcome flow on page load.
 * - If name not stored: show name prompt modal
 * - If name stored and not skipped: show welcome banner briefly
 */
function initNameFlow() {
  const storedName = localStorage.getItem('portfolio-username');

  if (!storedName) {
    // First visit — show modal after a short delay
    setTimeout(() => {
      if (nameModal) {
        nameModal.hidden = false;
        document.body.style.overflow = 'hidden';
        if (nameInput) nameInput.focus();
      }
    }, 1800);
  } else if (storedName !== '__skipped__') {
    // Returning visitor — show banner
    showWelcomeBanner(storedName);
    // Auto-hide after 5 seconds
    setTimeout(dismissWelcome, 5000);
  }
}

/* ─── 11. SESSION TIMER (Extra Feature) ─────────────────────── */
const sessionTimerEl   = document.getElementById('sessionTimer');
const sessionTimerText = document.getElementById('sessionTimerText');
const sessionStart     = Date.now(); // Record page load time

/**
 * Updates the session timer display every second.
 * Formats seconds into a human-readable string (Xs / Xm Xs / Xh Xm).
 */
function updateSessionTimer() {
  const elapsed = Math.floor((Date.now() - sessionStart) / 1000);

  let display;
  if (elapsed < 60) {
    display = `${elapsed}s`;
  } else if (elapsed < 3600) {
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    display = `${m}m ${s}s`;
  } else {
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    display = `${h}h ${m}m`;
  }

  if (sessionTimerText) {
    sessionTimerText.textContent = `You've been here for ${display}`;
  }
}

// Start the timer — update every second
setInterval(updateSessionTimer, 1000);
updateSessionTimer(); // Run immediately so it shows '0s' right away

/* ─── 12. SITE GUIDE DISMISS ────────────────────────────────── */
const siteGuide      = document.getElementById('siteGuide');
const siteGuideClose = document.getElementById('siteGuideClose');

/**
 * Hides the site guide hint box and persists the dismissal.
 */
function dismissGuide() {
  if (siteGuide) {
    siteGuide.classList.add('site-guide--hidden');
    localStorage.setItem('portfolio-guide-dismissed', '1');
  }
}

if (siteGuideClose) {
  siteGuideClose.addEventListener('click', dismissGuide);
}

// If previously dismissed, hide immediately without animation
if (localStorage.getItem('portfolio-guide-dismissed') === '1' && siteGuide) {
  siteGuide.style.display = 'none';
}

/* ─── INIT ──────────────────────────────────────────────────── */
setGreeting();
applyFilters();    // Ensure initial filter/sort/search state is correct
fetchGithubRepos(); // Fetch and display GitHub repos
initNameFlow();    // Handle user name prompt / welcome banner