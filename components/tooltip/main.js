import { createPopper } from "@popperjs/core";
import "./style.css";

document.querySelectorAll("[data-tooltip-trigger]").forEach((trigger) => {
  const tooltip = document.getElementById(trigger.getAttribute("aria-describedby"));

  if (!tooltip) return;

  const popper = createPopper(trigger, tooltip, {
    placement: trigger.dataset.tooltipPlacement ?? "top-start",
    modifiers: [
      { name: "offset", options: { offset: [0, 8] } },
      { name: "arrow", options: { element: tooltip.querySelector("[data-popper-arrow]") } },
      { name: "preventOverflow", options: { padding: 8 } },
    ],
  });
  let hideTimeout;
  let showTimeout;

  const revealTooltip = () => {
    window.clearTimeout(hideTimeout);
    const wasHidden = tooltip.hidden;
    tooltip.hidden = false;
    if (wasHidden && tooltip.dataset.animation === "blur") {
      tooltip.classList.add("tooltip-live--blur-in");
    }
    popper.update();
  };

  const showTooltipOnPointer = () => {
    window.clearTimeout(hideTimeout);
    window.clearTimeout(showTimeout);
    showTimeout = window.setTimeout(revealTooltip, 350);
  };

  const showTooltipOnFocus = () => {
    window.clearTimeout(showTimeout);
    revealTooltip();
  };

  const hideTooltip = () => {
    window.clearTimeout(showTimeout);
    window.clearTimeout(hideTimeout);
    hideTimeout = window.setTimeout(() => {
      if (!trigger.matches(":hover, :focus") && !tooltip.matches(":hover")) {
        tooltip.hidden = true;
        tooltip.classList.remove("tooltip-live--blur-in");
      }
    }, 100);
  };

  trigger.addEventListener("pointerenter", showTooltipOnPointer);
  trigger.addEventListener("pointerleave", hideTooltip);
  trigger.addEventListener("focus", showTooltipOnFocus);
  trigger.addEventListener("blur", hideTooltip);
  tooltip.addEventListener("pointerenter", () => window.clearTimeout(hideTimeout));
  tooltip.addEventListener("pointerleave", hideTooltip);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !tooltip.hidden) {
      window.clearTimeout(showTimeout);
      window.clearTimeout(hideTimeout);
      tooltip.hidden = true;
      tooltip.classList.remove("tooltip-live--blur-in");
    }
  });
});
