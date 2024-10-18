import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { formatPrice } from "../utils/formatPrice";

const ApprovalCard = ({
  book,
  onRemove: onDecline,
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

  const truncate = (text, maxLength) => {
    return text?.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="group relative max-w-[450px] bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-[1.02]">
      <div className="relative h-48 overflow-hidden">
        {loading ? (
          <Skeleton height={192} className="rounded-md" />
        ) : (
          <>
            <img
              src={book?.images[0] || "/placeholder-book.jpg"}
              alt={book?.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
              <span className="text-sm font-semibold text-gray-900">
                {book?.availability === "rent"
                  ? `${formatPrice(book.perWeekPrice)}/week`
                  : formatPrice(book.sellingPrice)}
              </span>
            </div>
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm">
              <span className="text-sm font-medium text-gray-900 capitalize">
                {book?.category}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div className="mb-3">
          <h3 className="font-semibold text-xl text-gray-900 leading-tight">
            {loading ? (
              <Skeleton count={1} height={30} className="rounded-md" />
            ) : (
              truncate(book?.title, 40)
            )}
          </h3>
          <p className="text-sm text-gray-500">
            {loading ? (
              <Skeleton count={1} height={20} className="rounded-md" />
            ) : (
              `by ${truncate(book?.author, 30)}`
            )}
          </p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <span className="inline-block w-20 font-semibold text-gray-700">
              Condition:
            </span>
            <span className="font-medium text-gray-900">
              {loading ? (
                <Skeleton width={100} height={20} className="rounded-md" />
              ) : (
                book?.condition
              )}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="inline-block w-20 font-semibold text-gray-700">
              Posted:
            </span>
            <span className="font-medium text-gray-900">
              {loading ? (
                <Skeleton width={120} height={20} className="rounded-md" />
              ) : (
                formatDate(book?.postedAt)
              )}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <span className="inline-block w-20 font-semibold text-gray-700">
              Seller:
            </span>
            <span className="font-medium text-gray-900">
              {loading ? (
                <Skeleton width={120} height={20} className="rounded-md" />
              ) : (
                truncate(book?.sellerName, 20)
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <Skeleton height={40} width="100%" className="rounded-md" />
          ) : (
            <>
              <button
                onClick={onViewDetails}
                className="flex-1 h-10 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md transition-all duration-200"
              >
                View Details
              </button>
              <button
                onClick={onDecline}
                className="flex-1 h-10 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg transition-all duration-200"
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
