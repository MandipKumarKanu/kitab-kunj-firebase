import React, { useEffect, useState } from "react";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "../../config/firebase.config";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const analyticsRef = collection(db, "analytics");
      const q = query(analyticsRef, orderBy("__name__", "desc"), limit(7));

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        date: doc.id,
        ...doc.data(),
      }));

      // Reverse the data to show oldest to newest
      data.reverse();

      const labels = data.map((item) => item.date);
      const traffic = data.map((item) => item.traffic || 0);
      const sell = data.map((item) => item.sell || 0);
      const rent = data.map((item) => item.rent || 0);
      const donation = data.map((item) => item.donation || 0);

      setChartData({
        labels,
        datasets: [
          {
            label: "Traffic",
            data: traffic,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
          {
            label: "Sell",
            data: sell,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "Rent",
            data: rent,
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
          {
            label: "Donation",
            data: donation,
            borderColor: "rgb(255, 159, 64)",
            backgroundColor: "rgba(255, 159, 64, 0.5)",
          },
        ],
      });
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Analytics for the Last 7 Days",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default AnalyticsChart;
