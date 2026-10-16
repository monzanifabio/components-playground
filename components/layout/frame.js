import "bootstrap/dist/css/bootstrap.min.css";
import "./frame.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const THEME_STORAGE_KEY = "playground-theme";
const root = document.documentElement;
const themeToggleButton = document.getElementById("theme-toggle");
const leftPanel = document.getElementById("left-panel");
const leftPanelToggle = document.getElementById("left-panel-toggle");
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const rightPanel = document.getElementById("right-panel");
const rightPanelToggle = document.getElementById("right-panel-toggle");
const projectsMenuToggle = document.getElementById("projects-menu-toggle");
const projectsPanel = document.getElementById("projects-panel");
const projectsPanelClose = document.getElementById("projects-panel-close");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);

  if (!themeToggleButton) {
    return;
  }

  const nextTheme = theme === "dark" ? "light" : "dark";
  const nextLabel = nextTheme === "dark" ? "Dark Mode" : "Light Mode";
  themeToggleButton.textContent = nextLabel;
  themeToggleButton.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
}

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === "dark" ? "dark" : "light";
}

let currentTheme = getInitialTheme();
applyTheme(currentTheme);

if (themeToggleButton) {
  themeToggleButton.addEventListener("click", () => {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    applyTheme(currentTheme);
  });
}

function setPanelState(panel, button, isCollapsed, collapsedLabel, expandedLabel) {
  panel.classList.toggle("is-collapsed", isCollapsed);
  button.setAttribute("aria-expanded", String(!isCollapsed));
  button.setAttribute("aria-label", isCollapsed ? collapsedLabel : expandedLabel);
}

if (leftPanel && leftPanelToggle) {
  leftPanelToggle.addEventListener("click", () => {
    setPanelState(leftPanel, leftPanelToggle, !leftPanel.classList.contains("is-collapsed"), "Expand navigation", "Collapse navigation");
  });
}

if (mobileMenuToggle && leftPanel) {
  mobileMenuToggle.addEventListener("click", () => {
    leftPanel.classList.toggle("is-mobile-open");
  });
}

if (rightPanel && rightPanelToggle) {
  rightPanelToggle.addEventListener("click", () => {
    setPanelState(rightPanel, rightPanelToggle, !rightPanel.classList.contains("is-collapsed"), "Expand details panel", "Collapse details panel");
  });
}

function setProjectsPanelState(isOpen) {
  if (!projectsMenuToggle || !projectsPanel) {
    return;
  }

  projectsPanel.classList.toggle("is-open", isOpen);
  projectsPanel.setAttribute("aria-hidden", String(!isOpen));
  projectsMenuToggle.setAttribute("aria-expanded", String(isOpen));
}

if (projectsMenuToggle) {
  projectsMenuToggle.addEventListener("click", () => {
    setProjectsPanelState(!projectsPanel.classList.contains("is-open"));
  });
}

if (projectsPanelClose) {
  projectsPanelClose.addEventListener("click", () => {
    setProjectsPanelState(false);
  });
}
