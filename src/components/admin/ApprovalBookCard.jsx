import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { formatPrice } from "../utils/formatPrice";

const ApprovalCard = ({
  book,
  onApprove,
  onDecline,
  onViewDetails,
  loading,
}) => {
  const formatDate = (timestamp) => {
    return new Date(timestamp.toDate()).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="group relative w-full max-w-sm bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image Container - Fixed height */}
      <div className="relative h-52">
        {loading ? (
          <Skeleton height={208} className="rounded-t-xl" />
        ) : (
          <>
            <img
              src={book?.images[0] || "/placeholder-book.jpg"}
              alt={book?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {/* Price Tag */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full">
              <span className="text-sm font-semibold text-gray-900">
                {book?.availability === "rent"
                  ? `${formatPrice(book.perWeekPrice)}/week`
                  : formatPrice(book.sellingPrice)}
              </span>
            </div>

            {/* Category Tag */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full">
              <span className="text-sm font-medium text-gray-900 capitalize">
                {book?.category}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Content Container - Fixed padding */}
      <div className="p-6 space-y-4">
        {/* Title and Author */}
        <div>
          {loading ? (
            <Skeleton count={2} height={24} className="mb-2" />
          ) : (
            <>
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-1">
                {book?.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-1">
                by {book?.author}
              </p>
            </>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {loading ? (
            <>
              <Skeleton count={3} height={20} />
              <Skeleton count={3} height={20} />
            </>
          ) : (
            <>
              <div className="text-sm font-medium text-gray-500">
                Condition:
              </div>
              <div className="text-sm text-gray-900">{book?.condition}</div>

              <div className="text-sm font-medium text-gray-500">Posted:</div>
              <div className="text-sm text-gray-900">
                {formatDate(book?.postedAt)}
              </div>

              <div className="text-sm font-medium text-gray-500">Seller:</div>
              <div className="text-sm text-gray-900 line-clamp-1">
                {book?.sellerName}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {loading ? (
            <Skeleton height={40} className="col-span-3" />
          ) : (
            <>
              <button
                onClick={onViewDetails}
                className="h-10 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
              >
                Details
              </button>
              <button
                onClick={onApprove}
                className="h-10 px-4 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors duration-200"
              >
                Approve
              </button>
              <button
                onClick={onDecline}
                className="h-10 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
              >
                Decline
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalCard;
