import Chart from "chart.js/auto";
import chartData from "./data/line/weekly-sessions.json";
import { PALETTE as COLORS, tooltipStyles } from "./palette.js";

const css = getComputedStyle(document.documentElement);
const c = (v) => css.getPropertyValue(v).trim();

const chart = new Chart(document.getElementById("chart-line"), {
  type: "line",
  data: {
    labels: chartData.labels,
    datasets: chartData.datasets.map((ds, i) => ({
      ...ds,
      borderColor: c(COLORS[i]),
      tension: 0.4,
      fill: false,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBackgroundColor: c(COLORS[i]),
      pointHoverBackgroundColor: c(COLORS[i]),
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
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 2,
          useBorderRadius: true,
          generateLabels(chart) {
            const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
            labels.forEach((label, i) => {
              label.fillStyle = c(COLORS[i]);
              label.strokeStyle = c(COLORS[i]);
            });
            return labels;
          },
        },
      },
    },
    scales: {
      y: {
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
        if (chart.legend) chart.legend.left += 8;
      },
    },
  ],
});

const chartLinear = new Chart(document.getElementById("chart-line-linear"), {
  type: "line",
  data: {
    labels: chartData.labels,
    datasets: chartData.datasets.map((ds, i) => ({
      ...ds,
      borderColor: c(COLORS[i]),
      tension: 0,
      fill: false,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBackgroundColor: c(COLORS[i]),
      pointHoverBackgroundColor: c(COLORS[i]),
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
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          borderRadius: 2,
          useBorderRadius: true,
          generateLabels(chart) {
            const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
            labels.forEach((label, i) => {
              label.fillStyle = c(COLORS[i]);
              label.strokeStyle = c(COLORS[i]);
            });
            return labels;
          },
        },
      },
    },
    scales: {
      y: {
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
      id: "legendMarginLinear",
      afterLayout(chart) {
        if (chart.legend) chart.legend.left += 8;
      },
    },
  ],
});

document.addEventListener("themechange", () => {
  chart.data.datasets.forEach((ds, i) => {
    ds.borderColor = c(COLORS[i]);
    ds.pointBackgroundColor = c(COLORS[i]);
    ds.pointHoverBackgroundColor = c(COLORS[i]);
  });
  chart.options.scales.y.grid.color = c("--color-border");
  chart.options.scales.y.ticks.color = c("--color-text");
  chart.options.scales.x.ticks.color = c("--color-text");
  Object.assign(chart.options.plugins.tooltip, tooltipStyles(c));
  chart.update();

  chartLinear.data.datasets.forEach((ds, i) => {
    ds.borderColor = c(COLORS[i]);
    ds.pointBackgroundColor = c(COLORS[i]);
    ds.pointHoverBackgroundColor = c(COLORS[i]);
  });
  chartLinear.options.scales.y.grid.color = c("--color-border");
  chartLinear.options.scales.y.ticks.color = c("--color-text");
  chartLinear.options.scales.x.ticks.color = c("--color-text");
  Object.assign(chartLinear.options.plugins.tooltip, tooltipStyles(c));
  chartLinear.update();
});
