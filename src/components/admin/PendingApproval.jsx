import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ApprovalCard from "./ApprovalCard";
import { db } from "../../config/firebase.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import ShrinkDescription from "../utils/ShrinkDescription";

const PendingApproval = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    action: null,
    bookId: null,
  });
  const [feedbackDialog, setFeedbackDialog] = useState({
    open: false,
    bookId: null,
    sellerId: null,
  });
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    fetchPendingBooks();
  }, []);

  const fetchPendingBooks = async () => {
    try {
      const pendingBooksRef = collection(db, "pendingBooks");
      const querySnapshot = await getDocs(pendingBooksRef);
      const fetchedBooks = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const sellerName = await fetchSellerName(data.sellerId);
          return { id: doc.id, sellerName, ...data };
        })
      );
      setBooks(fetchedBooks);
    } catch (error) {
      console.error("Error fetching pending books:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerName = async (sellerID) => {
    try {
      const sellerDocRef = doc(db, "users", sellerID);
      const sellerDoc = await getDoc(sellerDocRef);
      return sellerDoc.exists() ? sellerDoc.data().name : "Unknown Seller";
    } catch (error) {
      console.error("Error fetching seller:", error);
      return "Unknown Seller";
    }
  };

  const handleApprove = async (bookId, sellerId) => {
    // Optimistic update
    const bookToApprove = books.find((book) => book.id === bookId);
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));

    try {
      const bookRef = doc(db, "pendingBooks", bookId);
      const bookDoc = await getDoc(bookRef);
      const bookData = bookDoc.data();

      await setDoc(doc(db, "approvedBooks", bookId), {
        ...bookData,
        approvedAt: new Date(),
      });

      await deleteDoc(bookRef);

      await sendNotification(
        sellerId || selectedBook.sellerId,
        `Your book "${bookData.title}" has been approved.`,
        bookData.title,
        "approved",
        bookId
      );

      console.log("Book approved and moved:", bookId);
    } catch (error) {
      console.error("Error approving book:", error);
      // Revert optimistic update on error
      setBooks((prevBooks) => [...prevBooks, bookToApprove]);
    }

    setDialogOpen(false);
    setSelectedBook(null);
  };

  const handleDecline = async (bookId, sellerId) => {
    // Open feedback dialog
    setFeedbackDialog({ open: true, bookId, sellerId });
  };

  const submitDeclineWithFeedback = async () => {
    const { bookId, sellerId } = feedbackDialog;

    // Optimistic update
    const bookToDecline = books.find((book) => book.id === bookId);
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));

    try {
      const bookRef = doc(db, "pendingBooks", bookId);
      const bookDoc = await getDoc(bookRef);
      const bookData = bookDoc.data();

      await setDoc(doc(db, "declinedBooks", bookId), {
        ...bookData,
        declinedAt: new Date(),
        feedback: feedback,
      });

      await deleteDoc(bookRef);

      await sendNotification(
        sellerId || selectedBook.sellerId,
        `Your book "${bookData.title}" has been declined.`,
        bookData.title,
        "declined",
        bookId
      );

      console.log("Book declined and moved:", bookId);
    } catch (error) {
      console.error("Error declining book:", error);
      // Revert optimistic update on error
      setBooks((prevBooks) => [...prevBooks, bookToDecline]);
    }

    setFeedbackDialog({ open: false, bookId: null, sellerId: null });
    setFeedback("");
    setDialogOpen(false);
    setSelectedBook(null);
  };

  const sendNotification = async (
    sellerId,
    message,
    bookTitle,
    status,
    bookId
  ) => {
    try {
      await setDoc(doc(db, "notification", bookId), {
        sellerId,
        message,
        bookTitle,
        status,
        timestamp: new Date(),
        read: false,
      });
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleConfirmation = (action, book) => {
    setConfirmationDialog({ open: true, action, book });
  };

  const confirmAction = async () => {
    if (confirmationDialog.action === "approve") {
      await handleApprove(
        confirmationDialog.book.id,
        confirmationDialog.book.sellerId
      );
    } else if (confirmationDialog.action === "decline") {
      await handleDecline(
        confirmationDialog.book.id,
        confirmationDialog.book.sellerId
      );
    }
    setConfirmationDialog({ open: false, action: null, book: null });
  };

  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedBook(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Pending Approval
      </h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {books.map((book) => (
            <ApprovalCard
              key={book.id}
              book={book}
              onApprove={() => handleConfirmation("approve", book)}
              onDecline={() => handleConfirmation("decline", book)}
              onViewDetails={() => handleViewDetails(book)}
            />
          ))}
        </div>
      )}

      {/* Book Details Dialog */}
      {isDialogOpen && selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-[#fff] rounded-lg p-6 max-w-3xl w-full shadow-xl transition-all transform scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedBook.title}
              </h2>
              <button
                onClick={closeDialog}
                className="text-gray-500 hover:text-gray-700 transition focus:outline-none"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-center">
                <img
                  src={selectedBook.images[0] || "/placeholder-book.jpg"}
                  alt={selectedBook.title}
                  className="w-full h-72 object-cover rounded-lg shadow-lg"
                />
              </div>

              <div className="space-y-3">
                <p>
                  <span className="font-semibold">Author:</span>{" "}
                  {selectedBook.author}
                </p>
                <p>
                  <span className="font-semibold">Category:</span>{" "}
                  {selectedBook.category}
                </p>
                <p>
                  <span className="font-semibold">Language:</span>{" "}
                  {selectedBook.language}
                </p>
                <p>
                  <span className="font-semibold">Edition:</span>{" "}
                  {selectedBook.edition}
                </p>
                <p>
                  <span className="font-semibold">Publish Year:</span>{" "}
                  {selectedBook.publishYear}
                </p>
                <p>
                  <span className="font-semibold">Condition:</span>{" "}
                  {selectedBook.condition}
                </p>
                <p>
                  <span className="font-semibold">Seller:</span>{" "}
                  {selectedBook.sellerName}
                </p>
                <p>
                  <span className="font-semibold">Posted:</span>{" "}
                  {new Date(
                    selectedBook.postedAt.toDate()
                  ).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{" "}
                  {selectedBook.status === "approved" ? "Approved" : "Declined"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Pricing:</h3>
              <div className="flex flex-col sm:flex-row sm:gap-10">
                <p className="text-gray-700">
                  <span className="font-semibold">Original Price:</span>{" "}
                  {formatPrice(selectedBook.originalPrice)}
                </p>
                {selectedBook.availability === "rent" ? (
                  <p className="text-gray-700">
                    <span className="font-semibold">Per Week Price:</span>{" "}
                    {formatPrice(selectedBook.perWeekPrice)}
                  </p>
                ) : (
                  <p className="text-gray-700">
                    <span className="font-semibold">Selling Price:</span>{" "}
                    {formatPrice(selectedBook.sellingPrice)}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Description:</h3>
              <p className="text-gray-700">
                <ShrinkDescription desc={selectedBook.description} />
              </p>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() =>
                  handleApprove(selectedBook.id, selectedBook.sellerId)
                }
                className="px-8 h-10 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition duration-200"
              >
                Approve
              </button>
              <button
                onClick={() =>
                  handleDecline(selectedBook.id, selectedBook.sellerId)
                }
                className="px-8 h-10 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition duration-200"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmationDialog.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`rounded-full p-2 ${
                    confirmationDialog.action === "approve"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={
                      confirmationDialog.action === "approve"
                        ? faCheck
                        : faTimes
                    }
                    className="text-xl"
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Confirm{" "}
                  {confirmationDialog.action === "approve"
                    ? "Approval"
                    : "Decline"}
                </h2>
              </div>

              <p className="mt-2 text-gray-600">
                Are you sure you want to{" "}
                {confirmationDialog.action === "approve"
                  ? "approve"
                  : "decline"}{" "}
                <span className="font-medium text-gray-900">
                  "{confirmationDialog.book?.title}"
                </span>
                ?
              </p>
              <p className="mt-2 text-sm text-gray-500">
                This action cannot be undone. The book will be moved to the{" "}
                {confirmationDialog.action === "approve"
                  ? "approved"
                  : "declined"}{" "}
                collection.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                onClick={() =>
                  setConfirmationDialog({ ...confirmationDialog, open: false })
                }
                className="inline-flex justify-center items-center px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`inline-flex justify-center items-center px-4 py-2.5 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  confirmationDialog.action === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500"
                    : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    confirmationDialog.action === "approve" ? faCheck : faTimes
                  }
                  className="mr-2"
                />
                {confirmationDialog.action === "approve"
                  ? "Approve"
                  : "Decline"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Dialog */}
      {feedbackDialog.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl transform scale-100 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Provide Feedback (Optional)
            </h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Enter feedback for the seller (optional)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            ></textarea>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() =>
                  setFeedbackDialog({
                    open: false,
                    bookId: null,
                    sellerId: null,
                  })
                }
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitDeclineWithFeedback}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Decline Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApproval;
