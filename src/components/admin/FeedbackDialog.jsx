import React from "react";

const FeedbackDialog = ({
  isOpen,
  onClose,
  onSubmit,
  feedback,
  onFeedbackChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl transform scale-100 animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Provide Feedback
        </h2>
        <p className="text-gray-600 mb-4">
          Please provide feedback to help the seller understand why their book
          was declined. This feedback will be sent to the seller.
        </p>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow min-h-[120px] resize-y"
          placeholder="Enter feedback for the seller (optional)"
          value={feedback}
          onChange={onFeedbackChange}
        ></textarea>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Decline Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDialog;
