import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ApprovalCard from "./ApprovalCard";
import { db } from "../../config/firebase.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
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

  useEffect(() => {
    fetchPendingBooks();
  }, []);

  const fetchPendingBooks = async () => {
    try {
      const pendingBooksRef = collection(db, "books");
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
    try {
      const bookRef = doc(db, "books", bookId);
      const bookDoc = await getDoc(bookRef);
      const bookData = bookDoc.data();

      await addDoc(collection(db, "approvedBooks"), {
        ...bookData,
        approvedAt: new Date(),
      });

      await deleteDoc(bookRef);

      await sendNotification(
        sellerId || selectedBook.sellerId,
        `Your book "${bookData.title}" has been approved.`,
        bookData.title,
        "approved"
      );

      removeBook(bookId);
      console.log("Book approved and moved:", bookId);
    } catch (error) {
      console.error("Error approving book:", error);
    }
  };

  const handleDecline = async (bookId, sellerId) => {
    try {
      const bookRef = doc(db, "books", bookId);
      const bookDoc = await getDoc(bookRef);
      const bookData = bookDoc.data();

      await addDoc(collection(db, "declinedBooks"), {
        ...bookData,
        declinedAt: new Date(),
      });

      await deleteDoc(bookRef);

      await sendNotification(
        sellerId || selectedBook.sellerId,
        `Your book "${bookData.title}" has been declined.`,
        bookData.title,
        "declined"
      );

      removeBook(bookId);
      console.log("Book declined and moved:", bookId);
    } catch (error) {
      console.error("Error declining book:", error);
    }
  };

  const sendNotification = async (sellerId, message, bookTitle, status) => {
    try {
      await addDoc(collection(db, "notification"), {
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

  const removeBook = (bookId) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    setDialogOpen(false);
    setSelectedBook(null);
  };

  const handleConfirmation = (action, bookId) => {
    setConfirmationDialog({ open: true, action, book: { ...bookId } });
  };

  const confirmAction = async () => {
    console.log(confirmationDialog);
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
    setConfirmationDialog({ open: false, action: null, bookId: null });
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
                onClick={() => handleApprove(selectedBook.id)}
                className="px-8 h-10 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition duration-200"
              >
                Approve
              </button>
              <button
                onClick={() => handleDecline(selectedBook.id)}
                className="px-8 h-10 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition duration-200"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmationDialog.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-lg font-bold mb-4">
              Are you sure you want to{" "}
              {confirmationDialog.action === "approve" ? "approve" : "decline"}{" "}
              this book?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={confirmAction}
                className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
              >
                Yes
              </button>
              <button
                onClick={() =>
                  setConfirmationDialog({ ...confirmationDialog, open: false })
                }
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApproval;
