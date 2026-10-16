import Chart from "chart.js/auto";
import chartData from "./data/bar/budget-allocation.json";
import { PALETTE as COLORS, tooltipStyles } from "./palette.js";

const css = getComputedStyle(document.documentElement);
const c = (v) => css.getPropertyValue(v).trim();

const chart = new Chart(document.getElementById("chart-stacked-bar"), {
  type: "bar",
  data: {
    labels: chartData.labels,
    datasets: chartData.datasets.map((ds, i) => ({
      ...ds,
      backgroundColor: c(COLORS[i]),
      borderWidth: 0,
      // only round the top corners of the topmost segment
      borderRadius: i === chartData.datasets.length - 1 ? { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 } : 0,
    })),
  },
  options: {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: tooltipStyles(c),
      legend: {
        position: "bottom",
        align: "start",
        labels: { boxWidth: 12, boxHeight: 12, borderRadius: 2, useBorderRadius: true },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: c("--color-text") },
      },
      y: {
        stacked: true,
        grid: { color: c("--color-border") },
        ticks: { color: c("--color-text") },
      },
    },
  },
  plugins: [
    {
      id: "legendMargin",
      afterLayout(chart) {
        if (chart.legend) chart.legend.left += 24;
      },
    },
  ],
});

document.addEventListener("themechange", () => {
  chart.data.datasets.forEach((ds, i) => {
    ds.backgroundColor = c(COLORS[i]);
  });
  chart.options.scales.x.ticks.color = c("--color-text");
  chart.options.scales.y.grid.color = c("--color-border");
  chart.options.scales.y.ticks.color = c("--color-text");
  Object.assign(chart.options.plugins.tooltip, tooltipStyles(c));
  chart.update();
});
