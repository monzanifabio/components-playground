import Chart from "chart.js/auto";
import chartData from "./data/pie/traffic-sources.json";
import { PALETTE as COLORS, tooltipStyles } from "./palette.js";

const css = getComputedStyle(document.documentElement);
const c = (v) => css.getPropertyValue(v).trim();

const chart = new Chart(document.getElementById("chart-donut"), {
  type: "doughnut",
  data: {
    labels: chartData.labels,
    datasets: chartData.datasets.map((ds) => ({
      ...ds,
      backgroundColor: COLORS.map((v) => c(v)),
      borderWidth: 0,
      hoverOffset: 0,
    })),
  },
  options: {
    responsive: true,
    cutout: "62%",
    plugins: {
      tooltip: tooltipStyles(c),
      legend: {
        position: "bottom",
        align: "center",
        labels: { boxWidth: 12, boxHeight: 12, borderRadius: 2, useBorderRadius: true },
      },
    },
  },
  plugins: [
    {
      id: "legendMargin",
      afterLayout(chart) {
        if (chart.legend) chart.legend.top += 8;
      },
    },
  ],
});

const chartPie = new Chart(document.getElementById("chart-pie"), {
  type: "pie",
  data: {
    labels: chartData.labels,
    datasets: chartData.datasets.map((ds) => ({
      ...ds,
      backgroundColor: COLORS.map((v) => c(v)),
      borderWidth: 0,
      hoverOffset: 0,
    })),
  },
  options: {
    responsive: true,
    plugins: {
      tooltip: tooltipStyles(c),
      legend: {
        position: "bottom",
        align: "center",
        labels: { boxWidth: 12, boxHeight: 12, borderRadius: 2, useBorderRadius: true },
      },
    },
  },
  plugins: [
    {
      id: "legendMarginPie",
      afterLayout(chart) {
        if (chart.legend) chart.legend.top += 8;
      },
    },
  ],
});

document.addEventListener("themechange", () => {
  chart.data.datasets[0].backgroundColor = COLORS.map((v) => c(v));
  Object.assign(chart.options.plugins.tooltip, tooltipStyles(c));
  chart.update();

  chartPie.data.datasets[0].backgroundColor = COLORS.map((v) => c(v));
  Object.assign(chartPie.options.plugins.tooltip, tooltipStyles(c));
  chartPie.update();
});
