import "./style.css";

/* ==========================================================================
   FIGMA ALERT COMPONENT RENDERER (Node 16595:3111)
   ========================================================================== */

const alertsContainer = document.getElementById("alerts-container");
const showAlertButton = document.getElementById("show-alert");
const MAX_VISIBLE_ALERTS = 3;
const AUTO_DISMISS_DELAY = 5000;
const ALERT_EXIT_DURATION = 320;
const STACK_SHIFT_DURATION = 320;
const ASSETS_URL = `${import.meta.env.BASE_URL}assets`;
const alertDismissers = new WeakMap();
const alertReflowAnimations = new WeakMap();

/**
 * Figma Alert Variant (Node 16595:3111)
 * Type: Neutral
 */
const ALERT_VARIANTS = [
  {
    type: "neutral",
    title: "Alert title",
    description: "This is an alert description.",
    icon: `${ASSETS_URL}/bolt.svg`,
    actions: [
      { label: "Action 1", className: "alert-btn alert-btn-primary" },
      { label: "Action 2", className: "alert-btn alert-btn-secondary" },
    ],
  },
];

function captureAlertPositions() {
  if (!alertsContainer) return new Map();
  return new Map([...alertsContainer.querySelectorAll(".alert:not(.alert-exiting)")].map((alert) => [alert, alert.getBoundingClientRect().top]));
}

function animateAlertReflow(previousPositions) {
  previousPositions.forEach((_, alert) => {
    stopAlertReflow(alert);
  });

  previousPositions.forEach((previousTop, alert) => {
    if (!alert.isConnected || alert.classList.contains("alert-exiting")) return;
    const offset = previousTop - alert.getBoundingClientRect().top;
    if (Math.abs(offset) < 1) return;

    const animation = alert.animate([{ translate: `0 ${offset}px` }, { translate: "0 0" }], { duration: STACK_SHIFT_DURATION, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
    alertReflowAnimations.set(alert, animation);
    animation.addEventListener("finish", () => {
      if (alertReflowAnimations.get(alert) === animation) {
        alertReflowAnimations.delete(alert);
      }
    });
  });
}

function stopAlertReflow(alert, preservePosition = false) {
  const animation = alertReflowAnimations.get(alert);
  if (!animation) return;

  const currentTranslate = getComputedStyle(alert).translate;
  animation.cancel();
  alertReflowAnimations.delete(alert);

  if (preservePosition && currentTranslate !== "none") {
    alert.style.translate = currentTranslate;
  } else {
    alert.style.removeProperty("translate");
  }
}

function createAlertElement(variant) {
  const alertEl = document.createElement("div");
  alertEl.className = `alert alert-${variant.type}`;
  alertEl.setAttribute("role", "alert");
  const actionsMarkup = variant.actions?.length ? `<div class="alert-actions">${variant.actions.map((action) => `<button type="button" class="${action.className}">${action.label}</button>`).join("")}</div>` : "";

  alertEl.innerHTML = `
    <div class="alert-icon-wrapper" aria-hidden="true">
      <img src="${variant.icon}" alt="" />
    </div>
    <div class="alert-main-content">
      <div class="alert-text-container">
        <h4 class="alert-title">${variant.title}</h4>
        <p class="alert-description">${variant.description}</p>
      </div>
      ${actionsMarkup}
    </div>
    <button type="button" class="alert-close-btn" aria-label="Dismiss alert">
      <img src="${ASSETS_URL}/xmark.svg" alt="" aria-hidden="true" />
    </button>
  `;

  let isDismissing = false;
  let dismissTimer;
  let timerStartedAt;
  let remainingDelay = AUTO_DISMISS_DELAY;

  const pauseDismissTimer = () => {
    if (dismissTimer === undefined) return;
    window.clearTimeout(dismissTimer);
    dismissTimer = undefined;
    remainingDelay -= Date.now() - timerStartedAt;
  };

  const startDismissTimer = () => {
    if (isDismissing || dismissTimer !== undefined) return;
    timerStartedAt = Date.now();
    dismissTimer = window.setTimeout(dismiss, remainingDelay);
  };

  const dismiss = (exitClass = "alert-exiting") => {
    if (isDismissing) return;
    isDismissing = true;
    pauseDismissTimer();
    const currentStyle = getComputedStyle(alertEl);
    const currentRect = alertEl.getBoundingClientRect();
    const isOverflowExit = exitClass === "alert-overflow-exiting";

    if (isOverflowExit) {
      stopAlertReflow(alertEl);
      alertEl.style.position = "fixed";
      alertEl.style.top = `${currentRect.top}px`;
      alertEl.style.left = `${currentRect.left}px`;
      alertEl.style.width = `${currentRect.width}px`;
      alertEl.style.height = `${currentRect.height}px`;
      alertEl.style.translate = "none";
    } else {
      stopAlertReflow(alertEl, true);
    }

    alertEl.style.setProperty("--alert-exit-start-opacity", currentStyle.opacity);
    alertEl.style.setProperty("--alert-exit-start-transform", isOverflowExit ? "none" : getComputedStyle(alertEl).transform);
    alertEl.classList.add("alert-exiting", exitClass);
    setTimeout(() => {
      const previousPositions = captureAlertPositions();
      alertEl.remove();
      animateAlertReflow(previousPositions);
    }, ALERT_EXIT_DURATION);
  };
  alertDismissers.set(alertEl, dismiss);

  const closeBtn = alertEl.querySelector(".alert-close-btn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => dismiss());
  }

  const actionButtons = alertEl.querySelectorAll(".alert-actions button");
  actionButtons.forEach((btn) => {
    btn.addEventListener("click", () => dismiss());
  });

  if (actionButtons.length === 0) {
    alertEl.addEventListener("pointerenter", pauseDismissTimer);
    alertEl.addEventListener("pointerleave", startDismissTimer);
    startDismissTimer();
  }

  return alertEl;
}

function summonAlert() {
  if (!alertsContainer) return;
  const previousPositions = captureAlertPositions();
  const variant = ALERT_VARIANTS[0];
  const alertWithActions = Math.random() >= 0.5;

  let visibleAlerts = alertsContainer.querySelectorAll(".alert:not(.alert-exiting)");
  while (visibleAlerts.length >= MAX_VISIBLE_ALERTS) {
    const oldestAlert = visibleAlerts[visibleAlerts.length - 1];
    alertDismissers.get(oldestAlert)?.("alert-overflow-exiting");
    visibleAlerts = alertsContainer.querySelectorAll(".alert:not(.alert-exiting)");
  }

  alertsContainer.prepend(createAlertElement(alertWithActions ? variant : { ...variant, actions: [] }));
  animateAlertReflow(previousPositions);
}

if (showAlertButton) {
  showAlertButton.addEventListener("click", summonAlert);
}
