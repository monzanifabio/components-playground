export const PALETTE = ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5", "--chart-6", "--chart-7", "--chart-8", "--chart-9", "--chart-10", "--chart-11", "--chart-12", "--chart-13", "--chart-14", "--chart-15", "--chart-16"];

function externalTooltip({ chart, tooltip }) {
  const css = getComputedStyle(document.documentElement);
  const c = (v) => css.getPropertyValue(v).trim();

  let el = chart.canvas.parentNode.querySelector(".chart-tooltip");
  if (!el) {
    el = document.createElement("div");
    el.className = "chart-tooltip";
    chart.canvas.parentNode.appendChild(el);
  }

  if (tooltip.opacity === 0) {
    el.style.opacity = "0";
    return;
  }

  Object.assign(el.style, {
    position: "absolute",
    pointerEvents: "none",
    opacity: "1",
    background: c("--color-surface"),
    border: `1px solid ${c("--color-border")}`,
    borderRadius: "6px",
    padding: "10px 12px",
    fontFamily: c("--font-sans"),
    fontSize: "13px",
    lineHeight: "1.5",
    color: c("--color-text"),
    minWidth: "160px",
    zIndex: "100",
    whiteSpace: "nowrap",
    transform: "translateY(-50%)",
  });

  let html = "";
  if (tooltip.title.length) {
    html += `<div style="font-weight:600;color:${c("--color-text-heading")};margin-bottom:6px;font-size:11px;text-transform:uppercase;letter-spacing:0.06em">${tooltip.title[0]}</div>`;
  }

  tooltip.dataPoints.forEach((point, i) => {
    const label = point.dataset.label ?? point.label ?? "";
    const value = point.formattedValue;
    const color = tooltip.labelColors[i]?.backgroundColor ?? "transparent";
    html += `<div style="display:flex;align-items:center;justify-content:space-between;gap:20px;padding:2px 0">
      <span style="display:flex;align-items:center;gap:6px">
        <span style="width:10px;height:10px;border-radius:2px;background:${color};flex-shrink:0"></span>
        ${label}
      </span>
      <span style="font-weight:600;color:${c("--color-text-heading")}">${value}</span>
    </div>`;
  });

  el.innerHTML = html;

  const canvas = chart.canvas;
  el.style.left = canvas.offsetLeft + tooltip.caretX + 14 + "px";
  el.style.top = canvas.offsetTop + tooltip.caretY + "px";
}

export function tooltipStyles() {
  return { enabled: false, external: externalTooltip };
}
