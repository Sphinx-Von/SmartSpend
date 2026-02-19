import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function TimeChart({ expenses }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Aggregate amount per date
    const totalsByDate = {};
    (expenses || []).forEach((e) => {
      const day = e.date; // already "YYYY-MM-DD"
      totalsByDate[day] = (totalsByDate[day] || 0) + e.amount;
    });

    const labels = Object.keys(totalsByDate).sort();
    const values = labels.map((d) => totalsByDate[d]);

    const ctx = canvasRef.current.getContext("2d");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Total per day",
            data: values,
            borderColor: "#38bdf8",
            backgroundColor: "rgba(56, 189, 248, 0.2)",
            tension: 0.3,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: "#e5e7eb",
            },
          },
        },
        scales: {
          x: {
            ticks: { color: "#9ca3af" },
            grid: { color: "rgba(55,65,81,0.3)" },
          },
          y: {
            ticks: { color: "#9ca3af" },
            grid: { color: "rgba(55,65,81,0.3)" },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, [expenses]);

  return <canvas ref={canvasRef} height="140" />;
}

export default TimeChart;
