import "./style.css";

document.querySelectorAll(".toggle").forEach((toggle) => {
  toggle.addEventListener("change", () => {
    toggle.setAttribute("aria-checked", String(toggle.checked));
    toggle.classList.remove("is-animating");
    void toggle.offsetWidth; // Restarts the animation on rapid clicks.
    toggle.classList.add("is-animating");
  });
  toggle.addEventListener("animationend", () => {
    toggle.classList.remove("is-animating");
  });
});
