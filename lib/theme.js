/*
 * Colour-theme switcher — the single implementation for every page.
 *
 * Inlined into <head> (before any stylesheet paints) by:
 *   - app/layout.tsx                      (home page, résumé)
 *   - scripts/project_pages/render.py     (all /projects/<slug>/ pages)
 * so the right theme is applied before first paint (no flash) everywhere.
 *
 * - Dark is the default. A saved choice ("light" | "dark") in localStorage wins.
 * - The theme is the data-theme attribute on <html>; public/tokens.css styles it.
 * - Any element with [data-theme-toggle] toggles the theme on click (event
 *   delegation), so toggle buttons need no JavaScript of their own and React
 *   never has to know the theme (no hydration mismatch).
 * - Keeps <meta name="theme-color"> in sync with the page background.
 *
 * Plain ES5 on purpose: it runs before any bundle, in every browser.
 */
(function () {
  var KEY = 'theme';
  var root = document.documentElement;

  function saved() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null; // storage blocked (private mode etc.) — fall back to the default
    }
  }

  function syncThemeColor() {
    var meta = document.querySelector('meta[name="theme-color"]');
    var bg = getComputedStyle(root).getPropertyValue('--bg').trim();
    if (meta && bg) meta.setAttribute('content', bg);
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    syncThemeColor();
  }

  apply(saved() === 'light' ? 'light' : 'dark');
  document.addEventListener('DOMContentLoaded', syncThemeColor);

  document.addEventListener('click', function (event) {
    var target = event.target;
    var toggle = target && target.closest ? target.closest('[data-theme-toggle]') : null;
    if (!toggle) return;
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    apply(next);
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {
      /* choice just won't persist */
    }
  });
})();
