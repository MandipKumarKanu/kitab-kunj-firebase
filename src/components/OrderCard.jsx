import React from "react";
import { formatDate } from "./utils/timeStampConversion";
import {
  ShoppingBag,
  Calendar,
  DollarSign,
  Package,
  ChevronRight,
} from "lucide-react";

export const OrderCard = ({ order, onViewDetails, onAccept, onCancel }) => {
  const {
    id,
    product_details,
    customerInfo,
    createdAt,
    amount,
    status,
    cancelReason,
  } = order;

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 hover:border-indigo-300">
      <div className="flex flex-col h-full">
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <div className="absolute inset-0 flex">
            {product_details.map((product, index) => (
              <div
                key={index}
                className="flex-1 relative overflow-hidden cursor-pointer"
              >
                <img
                  src={product.produc_img}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs font-medium text-center px-2 ">
                    {product.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {product_details.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs font-medium rounded-full px-2 py-1">
              {product_details.length} items
            </div>
          )}
        </div>
        <div className="p-4 sm:p-6 flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Order #{id.slice(-6)}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                status
              )}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center">
              <ShoppingBag size={16} className="mr-2 text-indigo-500" />
              Customer: {customerInfo.name}
            </p>
            <p className="flex items-center">
              <Calendar size={16} className="mr-2 text-indigo-500" />
              Date: {formatDate(createdAt)}
            </p>
            <p className="flex items-center">
              <DollarSign size={16} className="mr-2 text-indigo-500" />
              Amount: ₹{amount}
            </p>
            <p className="flex items-center">
              <Package size={16} className="mr-2 text-indigo-500" />
              Items: {product_details.length}
            </p>
            {cancelReason && (
              <p className="flex items-center line-clamp-2 w-fit px-2 py-1 pr-4 rounded-3xl bg-rose-100 border border-rose-200 text-rose-800 ">
                <Package size={16} className="mr-2 text-indigo-500" />
                Reason: {cancelReason}
              </p>
            )}
          </div>
        </div>
        <div className="p-4 sm:p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {status === "pending" && (
              <>
                <button
                  onClick={() => onAccept(order)}
                  className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  Accept
                  <ChevronRight size={16} className="ml-1" />
                </button>
                <button
                  onClick={() => onCancel(order)}
                  className="flex-1 bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  Cancel
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </>
            )}
            <button
              onClick={() => onViewDetails(order)}
              className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium flex items-center justify-center"
            >
              View Details
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
