import Chart from "chart.js/auto";
import chartData from "./data/bar/monthly-revenue.json";
import dailyData from "./data/bar/daily-visits.json";
import { PALETTE as COLORS, tooltipStyles } from "./palette.js";

const css = getComputedStyle(document.documentElement);
const c = (v) => css.getPropertyValue(v).trim();

const chart = new Chart(document.getElementById("chart-bar"), {
  type: "bar",
  data: {
    labels: chartData.labels,
    datasets: chartData.datasets.map((ds, i) => ({
      ...ds,
      backgroundColor: c(COLORS[i]),
      borderColor: c(COLORS[i]),
      borderWidth: 0,
      borderRadius: 4,
    })),
  },
  options: {
    responsive: true,
    plugins: {
      tooltip: tooltipStyles(c),
      legend: {
        position: "bottom",
        align: "start",
        labels: { boxWidth: 12, boxHeight: 12, borderRadius: 2, useBorderRadius: true },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: c("--color-border") },
        ticks: { color: c("--color-text") },
      },
      x: {
        grid: { display: false },
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

const chartDaily = new Chart(document.getElementById("chart-bar-daily"), {
  type: "bar",
  data: {
    labels: dailyData.labels,
    datasets: dailyData.datasets.map((ds, i) => ({
      ...ds,
      backgroundColor: c(COLORS[i]),
      borderWidth: 0,
      borderRadius: 2,
    })),
  },
  options: {
    responsive: true,
    plugins: {
      tooltip: tooltipStyles(c),
      legend: {
        position: "bottom",
        align: "start",
        labels: { boxWidth: 12, boxHeight: 12, borderRadius: 2, useBorderRadius: true },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: c("--color-border") },
        ticks: { color: c("--color-text") },
      },
      x: {
        grid: { display: false },
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
    ds.backgroundColor = ds.borderColor = c(COLORS[i]);
  });
  chart.options.scales.y.grid.color = c("--color-border");
  chart.options.scales.y.ticks.color = c("--color-text");
  chart.options.scales.x.ticks.color = c("--color-text");
  Object.assign(chart.options.plugins.tooltip, tooltipStyles(c));
  chart.update();

  chartDaily.data.datasets.forEach((ds, i) => {
    ds.backgroundColor = c(COLORS[i]);
  });
  chartDaily.options.scales.y.grid.color = c("--color-border");
  chartDaily.options.scales.y.ticks.color = c("--color-text");
  chartDaily.options.scales.x.ticks.color = c("--color-text");
  Object.assign(chartDaily.options.plugins.tooltip, tooltipStyles(c));
  chartDaily.update();
});
