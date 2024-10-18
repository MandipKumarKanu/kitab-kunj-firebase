import React from "react";
import AnalyticsChart from "./AnalyticsChart";
import UserStats from "./UserStats";

const AdminDashboard = () => {
  return (
    <>
      <AnalyticsChart />
      <UserStats />
    </>
  );
};

export default AdminDashboard;
