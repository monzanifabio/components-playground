// Kept in sync with THEME_STORAGE_KEY in vite/templates.js, which sets the initial theme before paint.
const THEME_STORAGE_KEY = "playground-theme";
const root = document.documentElement;
const themeToggleButton = document.querySelector("[data-theme-toggle]");

function syncThemeToggle() {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  themeToggleButton.textContent = nextTheme === "dark" ? "Dark mode" : "Light mode";
  themeToggleButton.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
}

themeToggleButton.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, root.dataset.theme);
  syncThemeToggle();
  // Components that paint with JS (e.g. charts) listen for this to re-read CSS variables.
  document.dispatchEvent(new CustomEvent("themechange"));
});

syncThemeToggle();
