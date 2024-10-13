import React from "react";
import AdminDropdown from "./AdminDropdown";
import NotificationPanel from "./NotificationPanel";

const Header = () => {
  return (
    <div className="w-full h-16 bg-gradient-to-r from-purple-600 to-purple-800 sticky top-0 z-10 shadow-lg flex justify-between items-center px-6">
      <div className="text-white text-xl font-semibold tracking-wide">
        Admin Panel
      </div>
      <div className="flex items-center space-x-4">
        <NotificationPanel />
        <AdminDropdown />
      </div>
    </div>
  );
};

export default Header;
