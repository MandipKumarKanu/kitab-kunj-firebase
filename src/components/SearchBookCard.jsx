import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faBookOpen,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const SearchBookCard = ({ book }) => {
  const navigate = useNavigate();
  const {
    id,
    condition,
    title,
    author,
    publishYear,
    images,
    availability,
    sellingPrice,
    originalPrice,
  } = book;

  const pricePerWeek =
    availability === "rent" ? (originalPrice / 4).toFixed(2) : null;

  const truncate = (str, num) => {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  };

  return (
    <div
      className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white cursor-pointer"
      onClick={() => navigate(`/book/${id}`)}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-0 group-hover:opacity-70 transition-opacity duration-300 z-10"></div>

      <img
        src={images[0]}
        alt={title}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
      />

      <div className="absolute top-4 left-4 bg-white py-1 px-3 rounded-full text-xs font-semibold text-gray-700 shadow-md">
        {condition}
      </div>

      <div
        className={`absolute top-4 right-4 p-2 px-3 text-xs font-bold rounded-full shadow-md ${
          availability === "sell"
            ? "bg-blue-500 text-white"
            : "bg-yellow-400 text-gray-800"
        }`}
      >
        {availability === "sell" ? "BUY" : "RENT"}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
        <h2 className="font-bold text-lg text-white mb-1">
          {truncate(title, 30)}
        </h2>
        <p className="text-gray-300 text-sm mb-2">{author}</p>

        <div className="flex justify-between items-center text-white text-sm">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faBookOpen} className="mr-1" />
            <span>{publishYear}</span>
          </div>
          {availability === "sell" ? (
            <div className="font-bold">₹{sellingPrice}</div>
          ) : (
            <div className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="mr-1" />
              <span>₹{pricePerWeek}/week</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBookCard;
