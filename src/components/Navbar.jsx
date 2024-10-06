import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll event to toggle fixed navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      if (window.scrollY > 60) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navbarClasses = `
    w-full 
    top-0 
    left-0 
    right-0 
    bg-white 
    z-50 
    transition-all 
    duration-300 
    ease-in-out
    ${isFixed ? "fixed shadow-md transform-none" : "relative shadow-none"}
    ${scrollY > 60 ? "py-2" : "py-3"}
  `;

  return (
    <>
      {/* Placeholder div to prevent content jump when navbar becomes fixed */}
      {isFixed && <div style={{ height: "72px" }} />}

      <nav className={navbarClasses}>
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div>
            <img
              src="/image/logo.png"
              alt="KitabKunj"
              className="w-28 object-contain transition-all duration-300"
            />
          </div>

          <div className="hidden md:block">
            <ul className="flex gap-8 lg:gap-12 xl:gap-24 text-lg">
              <li className="cursor-pointer hover:text-primary transition-colors">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "text-primaryColor" : "text-defaultColor"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className="cursor-pointer hover:text-primary transition-colors">
                <NavLink
                  to="/allbooks"
                  className={({ isActive }) =>
                    isActive ? "text-primaryColor" : "text-defaultColor"
                  }
                >
                  All Books
                </NavLink>
              </li>
              <li className="cursor-pointer hover:text-primary transition-colors">
                Buy
              </li>
              <li className="cursor-pointer hover:text-primary transition-colors">
                Rent
              </li>
              <li className="cursor-pointer hover:text-primary transition-colors">
                Events
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-4">
            <NavLink to="/profile">
              <FontAwesomeIcon
                icon={faUser}
                className="w-6 h-6 cursor-pointer transition-all duration-300"
              />
            </NavLink>
            <button
              className="md:hidden z-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <FontAwesomeIcon
                  icon={faTimes}
                  className="w-6 h-6 transition-all duration-300"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faBars}
                  className="w-6 h-6 transition-all duration-300"
                />
              )}
            </button>
          </div>
        </div>

        <div
          className={`fixed inset-0 bg-white z-40 transition-transform duration-300 ease-in-out md:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="container mx-auto px-4 pt-24 pb-8 h-full flex flex-col">
            <ul className="flex flex-col gap-8 text-2xl font-medium">
              <li className="transform hover:translate-x-2 transition-transform cursor-pointer hover:text-primary">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "text-primaryColor" : "text-defaultColor"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className="transform hover:translate-x-2 transition-transform cursor-pointer hover:text-primary">
                <NavLink
                  to="/allbooks"
                  className={({ isActive }) =>
                    isActive ? "text-primaryColor" : "text-defaultColor"
                  }
                >
                  All Books
                </NavLink>
              </li>
              <li className="transform hover:translate-x-2 transition-transform cursor-pointer hover:text-primary">
                Buy
              </li>
              <li className="transform hover:translate-x-2 transition-transform cursor-pointer hover:text-primary">
                Rent
              </li>
              <li className="transform hover:translate-x-2 transition-transform cursor-pointer hover:text-primary">
                Events
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
