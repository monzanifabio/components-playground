import "./style.css";

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const isExpanded = trigger.getAttribute("aria-expanded") === "true";
    const panel = document.getElementById(trigger.getAttribute("aria-controls"));
    const isExpanding = !isExpanded;

    trigger.setAttribute("aria-expanded", String(isExpanding));
    panel.setAttribute("aria-hidden", String(!isExpanding));
    panel.inert = !isExpanding;
  });
});
