import React from "react";
import { Check, X } from "lucide-react";

const ConfirmationDialog = ({ isOpen, action, book, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl transform scale-100 animate-in zoom-in-95 duration-200">
        <div className="text-center sm:text-left">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`rounded-full p-2 ${
                action === "approve"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {action === "approve" ? (
                <Check className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Confirm {action === "approve" ? "Approval" : "Decline"}
            </h2>
          </div>

          <p className="mt-2 text-gray-600">
            Are you sure you want to{" "}
            {action === "approve" ? "approve" : "decline"}{" "}
            <span className="font-medium text-gray-900">"{book?.title}"</span>?
          </p>
          <p className="mt-2 text-sm text-gray-500">
            This action cannot be undone. The book will be moved to the{" "}
            {action === "approve" ? "approved" : "declined"} collection.
          </p>
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            className="inline-flex justify-center items-center px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`inline-flex justify-center items-center px-4 py-2.5 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              action === "approve"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500"
                : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
            }`}
          >
            {action === "approve" ? (
              <Check className="mr-2 h-5 w-5" />
            ) : (
              <X className="mr-2 h-5 w-5" />
            )}
            {action === "approve" ? "Approve" : "Decline"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
