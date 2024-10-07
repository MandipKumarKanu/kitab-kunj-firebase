import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faClock,
  faGift,
  faDollarSign,
  faEye,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const ApprovalCard = ({ book, onApprove, onDelete, onViewDetails }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getAvailabilityIcon = () => {
    const icons = {
      rent: faClock,
      donation: faGift,
      sale: faDollarSign,
    };
    return icons[book.availability] || icons.sale;
  };

  const getAvailabilityStyle = () => {
    const styles = {
      rent: "bg-violet-100 text-violet-700 border-violet-200",
      donation: "bg-pink-100 text-pink-700 border-pink-200",
      sale: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    return styles[book.availability] || styles.sale;
  };

  const renderPrice = () => {
    if (book.availability === "donation") {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-700">
          <FontAwesomeIcon icon={faGift} className="h-4 w-4 mr-1" />
          <span className="font-medium">Donated</span>
        </div>
      );
    }

    const price =
      book.availability === "rent" ? book.perWeekPrice : book.sellingPrice;
    const displayPrice = formatPrice(price);
    const originalPrice =
      book.originalPrice > 0 ? formatPrice(book.originalPrice) : null;

    return (
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-900">{displayPrice}</span>
        {originalPrice && (
          <span className="text-sm text-gray-500 line-through mb-1">
            {originalPrice}
          </span>
        )}
        {book.availability === "rent" && (
          <span className="text-sm text-gray-500 mb-1">/week</span>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-hidden max-w-[495px] transition-all duration-300 hover:shadow-xl group border rounded-lg p-4 flex flex-col lg:flex-row justify-between items-start">
      <div className="flex-grow space-y-4">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getAvailabilityStyle()}`}
          >
            <FontAwesomeIcon icon={getAvailabilityIcon()} className="h-5 w-5" />
          </div>
          <div className="space-y-1 flex-grow">
            <h3 className="font-bold text-xl text-gray-900 line-clamp-1">
              {book.title}
            </h3>
            <p className="text-gray-500 line-clamp-1">{book.author}</p>
            <div className="pt-2">{renderPrice()}</div>
          </div>
        </div>
      </div>

      <div className="flex w-full lg:w-auto lg:flex-col gap-2 mt-4 md:mt-0">
        <button
          onClick={onViewDetails}
          className="w-full flex h-10 px-4 items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 text-xs sm:text-sm"
        >
          <FontAwesomeIcon icon={faEye} className="h-5 w-5 mr-2" />
          <span className="font-medium">View Details</span>
        </button>
        <button
          onClick={onApprove}
          className="w-full flex h-10 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200 text-xs sm:text-sm"
        >
          <FontAwesomeIcon icon={faCheck} className="h-5 w-5 mr-2" />
          <span className="font-medium">Approve</span>
        </button>
        <button
          onClick={onDelete}
          className="w-full flex h-10 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 text-xs sm:text-sm"
        >
          <FontAwesomeIcon icon={faXmark} className="h-5 w-5 mr-2" />
          <span className="font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
};

export default ApprovalCard;
