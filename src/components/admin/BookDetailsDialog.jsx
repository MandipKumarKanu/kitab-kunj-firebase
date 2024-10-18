import React from "react";
import { formatPrice } from "../utils/formatPrice";
import { X } from "lucide-react";
import ShrinkDescription from "../utils/ShrinkDescription";

const InfoRow = ({ label, value }) => (
  <div className="flex items-center">
    <span className="font-semibold text-gray-700 w-32">{label}:</span>
    <span className="text-gray-900">{value}</span>
  </div>
);

const BookDetailsDialog = ({ isOpen, book, onClose, onApprove, onDecline }) => {
  if (!isOpen || !book) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 sm:p-6">
      <div className="bg-white rounded-xl p-6 max-w-3xl w-full shadow-xl transition-all transform scale-100 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{book.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition focus:outline-none"
            aria-label="Close dialog"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-center">
            <img
              src={book.images[0] || "/placeholder-book.jpg"}
              alt={book.title}
              className="w-full h-72 object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="space-y-3">
            <InfoRow label="Author" value={book.author} />
            <InfoRow label="Category" value={book.category} />
            <InfoRow label="Language" value={book.language} />
            <InfoRow label="Edition" value={book.edition} />
            <InfoRow label="Publish Year" value={book.publishYear} />
            <InfoRow label="Condition" value={book.condition} />
            <InfoRow label="Seller" value={book.sellerName} />
            <InfoRow
              label="Posted"
              value={new Date(book.postedAt.toDate()).toLocaleDateString()}
            />
            <InfoRow
              label="Availability"
              value={
                book.availability.charAt(0).toUpperCase() +
                book.availability.slice(1)
              }
            />
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Pricing:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Original Price</div>
              <div className="text-lg font-semibold text-gray-900">
                {formatPrice(book.originalPrice)}
              </div>
            </div>

            {book.availability === "rent" && book.perWeekPrice && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Per Week Price</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatPrice(book.perWeekPrice)}
                </div>
              </div>
            )}

            {book.availability !== "rent" && book.sellingPrice && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Selling Price</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatPrice(book.sellingPrice)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Description:</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">
              {book.description.length > 100 ? (
                <ShrinkDescription desc={book.description} />
              ) : (
                book.description
              )}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onApprove}
            className="px-6 py-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={onDecline}
            className="px-6 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsDialog;
