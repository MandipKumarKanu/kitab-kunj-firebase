import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faHome,
  faClock,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        toggleSidebar(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [toggleSidebar]);

  const NavItem = ({ to, icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-2 rounded-lg transition-all duration-300 ease-in-out
        ${
          isActive
            ? "bg-purple-600 text-white"
            : "text-purple-100 hover:bg-purple-700"
        }
        ${!isOpen && "justify-center"}`
      }
    >
      <FontAwesomeIcon
        icon={icon}
        className={`text-xl ${isOpen ? "mr-3" : "mr-0"}`}
      />
      {isOpen && <span className="font-medium">{children}</span>}
    </NavLink>
  );

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gradient-to-b from-purple-900 to-indigo-900 shadow-xl transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between p-4">
        {isOpen && <h2 className="text-xl font-bold text-white">Kitab Kunj</h2>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-purple-800 text-white hover:bg-purple-700 transition-colors"
        >
          <FontAwesomeIcon
            icon={isOpen ? faTimes : faBars}
            className="text-xl"
          />
        </button>
      </div>
      <nav className="mt-8">
        <ul className="space-y-2 px-3">
          <li>
            <NavItem to="/admin/home" icon={faHome}>
              Dashboard
            </NavItem>
          </li>
          <li>
            <NavItem to="/admin/toapprove" icon={faClock}>
              Pending Approval
            </NavItem>
          </li>
          <li>
            <NavItem to="/admin/approvedbooks" icon={faBook}>
              Approved Books
            </NavItem>
          </li>
          <li>
            <NavItem to="/admin/mydeclined" icon={faBook}>
              My Declined Books
            </NavItem>
          </li>
          <li>
            <NavItem to="/admin/myapproved" icon={faBook}>
              My Approved Books
            </NavItem>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
