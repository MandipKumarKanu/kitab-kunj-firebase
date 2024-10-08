import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ClickOutside from "./ClickOutside";
// import useAuthContext from "../../context/useAuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBoxOpen,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { auth } from "../config/firebase.config";
import { useAuth } from "../components/context/AuthContext";
import { useLogoutHook } from "./useSignHook";

const DropdownUser = () => {
  const currentUser = auth.currentUser;

  // const { user, setApiToken, setUser } = useAuthContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { updatedUser } = useAuth();

  const handleLogout = async () => {
    // Uncomment these lines to enable logout functionality
    // setIsModalOpen(true);
    // await axiosInstance.post("auth/logout");
    // setDropdownOpen(false);
    // localStorage.clear();
    // setUser(undefined);
    // setApiToken(undefined);
    // setTimeout(() => {
    // }, 1000);
    try {
      await useLogoutHook(updatedUser);
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black uppercase">
            {currentUser?.displayName}
          </span>
        </span>

        <div className="flex items-center gap-3 justify-center">
          <FontAwesomeIcon
            icon={faUser}
            size="lg"
            className="text-DarkColor cursor-pointer ml-3"
          />
          <svg
            className="hidden fill-current sm:block"
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
            transition={{ duration: 0.3 }}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
              fill=""
            />
          </svg>
        </div>
      </Link>

      {dropdownOpen && (
        <div className="absolute right-0 mt-4 flex w-64 flex-col rounded-xl border border-stroke bg-white shadow-lg z-10">
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-4">
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                onClick={() => setDropdownOpen(false)}
              >
                <FontAwesomeIcon icon={faUser} size="lg" />
                My Profile
              </Link>
            </li>

            <li>
              <Link
                to="/myapproved"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                onClick={() => setDropdownOpen(false)}
              >
                <FontAwesomeIcon icon={faBoxOpen} size="lg" />
                My Books
              </Link>
            </li>
          </ul>
          <button
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
            Logout
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-medium">
              You have been logged out successfully.
            </p>
          </div>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
