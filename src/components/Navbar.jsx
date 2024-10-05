import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons"; 

const Navbar = () => {
  return (
    <nav className=" p-2">
      <div className="flex items-center justify-between mx-24 h-16 ">
        <div>
          <img
            src="/image/logo.png"
            alt="KitabKunj"
            className="w-28 object-contain"
          />
        </div>
        <div>
          <ul className="flex gap-24 text-lg">
            <li>All Books</li>
            <li>Buy</li>
            <li>Rent</li>
            <li>Events</li>
          </ul>
        </div>
        <div>
          <FontAwesomeIcon icon={faUser} className="text-xl" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
