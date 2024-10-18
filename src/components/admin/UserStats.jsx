import React, { useEffect, useState } from "react";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { db, auth } from "../../config/firebase.config";
import {
  BsGraphUp,
  BsBook,
  BsClipboardData,
  BsFileArrowUp,
  BsLayersFill,
} from "react-icons/bs";

const UserStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStatsRef = collection(
          db,
          "analytics",
          currentUser.uid,
          "userStats"
        );
        const q = query(userStatsRef, orderBy("lastUpdated", "desc"), limit(7));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => doc.data());
        if (data.length === 0) {
          setError("No stats available.");
        } else {
          setStats(data.reverse());
        }
      } catch (err) {
        setError("Failed to fetch user stats.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.uid) {
      fetchStats();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-6 bg-gray-100 rounded-2xl shadow-xl">
            <Skeleton height={40} />
            <Skeleton count={2} height={20} className="mt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (error)
    return (
      <div className="w-full h-64 flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );

  const StatCard = ({ title, value, icon: Icon, gradient }) => (
    <div
      className={`
      ${gradient}
      p-6 rounded-2xl shadow-xl
      transform transition-all duration-300 hover:scale-105
      hover:shadow-2xl hover:-translate-y-1
      backdrop-blur-lg bg-opacity-90
    `}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-lg text-white/70 mb-1">{title}</p>
          <p className="text-4xl font-bold text-white">{value || 0}</p>
        </div>
        <div className="bg-white/10 p-4 rounded-xl">
          <Icon className="text-5xl text-white" />
        </div>
      </div>
      <div className="mt-4 bg-white/10 h-1 rounded-full">
        <div className="h-full w-2/3 bg-white/30 rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-600 mb-4">
            Dashboard Overview
          </h2>
          <p className="text-gray-500 text-lg">
            Your activity metrics at a glance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard
            title="Active Listings"
            value={stats?.[0]?.activeListings}
            icon={BsGraphUp}
            gradient="bg-gradient-to-br from-blue-600 to-blue-400"
          />
          <StatCard
            title="Books For Sale"
            value={stats?.[0]?.booksForSell}
            icon={BsBook}
            gradient="bg-gradient-to-br from-red-600 to-pink-400"
          />
          <StatCard
            title="Books For Rent"
            value={stats?.[0]?.booksForRent}
            icon={BsClipboardData}
            gradient="bg-gradient-to-br from-emerald-600 to-teal-400"
          />
          <StatCard
            title="Books For Donation"
            value={stats?.[0]?.booksForDonation}
            icon={BsLayersFill}
            gradient="bg-gradient-to-br from-amber-600 to-yellow-400"
          />
          <StatCard
            title="Daily Uploads"
            value={stats?.[0]?.dailyUploads}
            icon={BsFileArrowUp}
            gradient="bg-gradient-to-br from-violet-600 to-purple-400"
          />
          <StatCard
            title="Total Books"
            value={stats?.[0]?.totalBooks}
            icon={BsLayersFill}
            gradient="bg-gradient-to-br from-rose-600 to-red-400"
          />
        </div>
      </div>
    </div>
  );
};

export default UserStats;
