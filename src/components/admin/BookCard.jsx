import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTags,
  faCalendar,
  faLanguage,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { formatPrice } from "../utils/formatPrice";

const BookCard = ({ book, onClick }) => {
  const getAvailabilityStyle = () => {
    const styles = {
      approved: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      rent: "bg-violet-100 text-violet-700 border-violet-200",
      sale: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    return styles[book.availability] || styles.sale;
  };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative h-64">
        <img
          src={book.images[0] || "/placeholder-book.jpg"}
          alt={book.title}
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute top-0 right-0 m-2 ${getAvailabilityStyle()} border rounded-full`}
        >
          <span className="text-xs font-bold px-2 py-1 rounded-full">
            {book.availability.charAt(0).toUpperCase() +
              book.availability.slice(1)}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-1">
            {book.title}
          </h2>
          <p className="text-gray-600 mb-2 line-clamp-1">by {book.author}</p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-blue-600 font-bold">
            {book.availability === "rent"
              ? `${formatPrice(book.perWeekPrice)}/week`
              : formatPrice(book.sellingPrice || book.originalPrice)}
          </span>
          <span
            className={`text-sm font-medium px-2 py-1 rounded-full ${
              book.condition === "new"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {book.condition}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
