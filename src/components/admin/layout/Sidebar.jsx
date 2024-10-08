import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-80 h-full bg-purple-900 text-white p-4">
      <h2 className="text-lg font-semibold mb-4">Admin Sidebar</h2>
      <ul>
        <li className="mb-2">
          <NavLink
            to="/admin/home"
            className={({ isActive }) =>
              `block p-2 rounded hover:bg-purple-700 ${
                isActive ? "bg-purple-600" : ""
              }`
            }
          >
            Dashboard
          </NavLink>
        </li>

        <li className="mb-2">
          <NavLink
            to="/admin/toapprove"
            className={({ isActive }) =>
              `block p-2 rounded hover:bg-purple-700 ${
                isActive ? "bg-purple-600" : ""
              }`
            }
          >
            Pending Approval
          </NavLink>
        </li>

        <li className="mb-2">
          <NavLink
            to="/admin/approvedbooks"
            className={({ isActive }) =>
              `block p-2 rounded hover:bg-purple-700 ${
                isActive ? "bg-purple-600" : ""
              }`
            }
          >
            Approved Books
          </NavLink>
        </li>
        {/* <li className="mb-2">
          <NavLink
            to="/admin/declineddbooks"
            className={({ isActive }) =>
              `block p-2 rounded hover:bg-purple-700 ${
                isActive ? "bg-purple-600" : ""
              }`
            }
          >
            Declined Books
          </NavLink>
        </li> */}
      </ul>
    </div>
  );
};

export default Sidebar;
