// import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.esm.js'
// import {Chart} from 'https://esm.sh/chart.js';
import {Chart} from "./chart.js-4.4.9/package/dist/chart.js"

const salesData = [
    { date: '2025-01-01', amount: 120 },
    { date: '2025-01-02', amount: 200 },
    { date: '2025-01-03', amount: 150 },
  ];

  const labels = salesData.map(item => new Date(item.date).toLocaleDateString());
  const dataValues = salesData.map(item => item.amount);

  const ctx = document.getElementById('salesChart').getContext('2d');
  const salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Daily Sales',
        data: dataValues,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        tension: 0.4, // curve the line
        fill: true
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
