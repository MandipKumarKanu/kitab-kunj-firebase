import React, { useEffect, useState } from "react";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../config/firebase.config";
import { Line } from "react-chartjs-2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartWidth, setChartWidth] = useState("100%");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setChartWidth("100%");
      } else {
        setChartWidth("85%");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsRef = collection(db, "analytics");
        const q = query(analyticsRef, orderBy("__name__", "desc"), limit(7));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          date: new Date(doc.id).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          ...doc.data(),
        }));

        if (data.length === 0) {
          setError("No analytics data available.");
        } else {
          data.reverse();
          const labels = data.map((item) => item.date);

          setChartData({
            labels,
            datasets: [
              {
                label: "Traffic",
                data: data.map((item) => item.traffic || 0),
                borderColor: "rgb(99, 102, 241)",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
              {
                label: "Sales",
                data: data.map((item) => item.sell || 0),
                borderColor: "rgb(244, 63, 94)",
                backgroundColor: "rgba(244, 63, 94, 0.1)",
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
              {
                label: "Rentals",
                data: data.map((item) => item.rent || 0),
                borderColor: "rgb(34, 197, 94)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
              {
                label: "Donations",
                data: data.map((item) => item.donation || 0),
                borderColor: "rgb(234, 179, 8)",
                backgroundColor: "rgba(234, 179, 8, 0.1)",
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
            ],
          });
        }
      } catch (err) {
        setError("Failed to fetch analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      // title: {
      //   display: true,
      //   text: "Performance Analytics",
      //   color: "#6366f1",
      //   font: {
      //     size: 20,
      //     family: "'Inter', sans-serif",
      //     weight: "600",
      //   },
      //   padding: {
      //     top: 20,
      //     bottom: 20,
      //   },
      // },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        displayColors: true,
        intersect: false,
        mode: "index",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
          padding: 10,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
          },
          padding: 10,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  if (loading) {
    return (
      <div className="">
        <div className="w-full flex justify-center flex-col items-center gap-4 mb-8">
          <Skeleton count={1} height={32} width={240} />
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} count={1} height={24} width={80} />
            ))}
          </div>
        </div>
        <Skeleton count={1} height={400} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-xl">
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-4xl text-center font-bold text-gray-600 mb-4">
        Performance Analytics
      </h2>
      <div
        className="relative w-full"
        style={{ height: "500px", width: chartWidth, margin: "0 auto" }}
      >
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
};

export default AnalyticsChart;
