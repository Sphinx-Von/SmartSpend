import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function CategoryChart({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");

    const labels = Object.keys(data || {});
    const values = Object.values(data || {});

    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: ["#38bdf8", "#f97316", "#22c55e", "#e11d48"],
            borderColor: "#020617",
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
      },
    });

    return () => {
      chart.destroy();
    };
  }, [data]);

  return <canvas ref={canvasRef} height="140" />;
}

export default CategoryChart;
