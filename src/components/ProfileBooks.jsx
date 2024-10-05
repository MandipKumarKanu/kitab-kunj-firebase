import React from "react";
import { NavLink } from "react-router-dom";

const ProfileBooks = () => {
  return (
    <div className="m-auto max-w-[1500px] mt-14">
      <ul className="flex m-auto max-w-[1300px] justify-between items-center gap-20">
        <NavLink
          className={({ isActive }) =>
            `flex flex-col justify-between items-center border-b-[6px] ${
              isActive ? "border-b-primaryColor" : "border-b-gray-200"
            } rounded-t-lg w-1/4`
          }
          to="/bought"
        >
          <span className="font-inter font-bold text-xl">Bought</span>
          <span>0</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex flex-col justify-between items-center border-b-[6px] ${
              isActive ? "border-b-primaryColor" : "border-b-gray-200"
            } rounded-t-lg w-1/4`
          }
          to="/sold"
        >
          <span className="font-inter font-bold text-xl">Sold</span>
          <span>0</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex flex-col justify-between items-center border-b-[6px] ${
              isActive ? "border-b-primaryColor" : "border-b-gray-200"
            } rounded-t-lg w-1/4`
          }
          to="/rented"
        >
          <span className="font-inter font-bold text-xl">Rented</span>
          <span>0</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex flex-col justify-between items-center border-b-[6px] ${
              isActive ? "border-b-primaryColor" : "border-b-gray-200"
            } rounded-t-lg w-1/4`
          }
          to="/donated"
        >
          <span className="font-inter font-bold text-xl">Donated</span>
          <span>0</span>
        </NavLink>
      </ul>
    </div>
  );
};

export default ProfileBooks;
