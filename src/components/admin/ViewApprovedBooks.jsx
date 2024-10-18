import React, { useEffect, useState } from "react";
import ApprovalCard from "./ApprovalCard"; // Import the ApprovalCard component
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ShrinkDescription from "../utils/ShrinkDescription";
import { formatPrice } from "../utils/formatPrice";
import Skeleton from "react-loading-skeleton"; // Ensure to install react-loading-skeleton

const ViewApprovedBooks = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    action: null,
    book: null,
  });

  useEffect(() => {
    fetchApprovedBooks();
  }, []);

  const fetchApprovedBooks = async () => {
    setLoading(true);
    try {
      const approvedBooksRef = collection(db, "approvedBooks");
      const querySnapshot = await getDocs(approvedBooksRef);
      const fetchedBooks = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const sellerName = await fetchSellerName(data.sellerId);
          return { id: doc.id, sellerName, ...data };
        })
      );
      setBooks(fetchedBooks);
    } catch (error) {
      console.error("Error fetching approved books:", error);
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

  const handleRemove = async (bookId, sellerId) => {
    try {
      const bookRef = doc(db, "approvedBooks", bookId);
      const bookDoc = await getDoc(bookRef);
      const bookData = bookDoc.data();

      await addDoc(collection(db, "declinedBooks"), {
        ...bookData,
        removedAt: new Date(),
      });

      await deleteDoc(bookRef);
      await sendNotification(
        sellerId || selectedBook.sellerId,
        `Your book "${bookData.title}" has been removed.`,
        bookData.title
      );

      removeBook(bookId);
    } catch (error) {
      console.error("Error declining book:", error);
    }
  };

  const sendNotification = async (sellerId, message, bookTitle) => {
    try {
      await addDoc(collection(db, "notification"), {
        sellerId,
        message,
        bookTitle,
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

  const handleConfirmation = (action, book) => {
    setConfirmationDialog({ open: true, action, book });
  };

  const confirmAction = async () => {
    if (confirmationDialog.action === "remove") {
      await handleRemove(
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

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Approved Books</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <Skeleton height={200} />
              <Skeleton count={3} className="mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {books.map((book) => (
            <ApprovalCard
              key={book.id}
              book={book}
              onRemove={() => handleConfirmation("remove", book)}
              onViewDetails={() => handleViewDetails(book)}
              showApproval={false}
              showDecline={true}
            />
          ))}
        </div>
      )}

      {isDialogOpen && selectedBook && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-xl transition-all transform scale-100">
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
                onClick={() => handleConfirmation("remove", selectedBook)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Remove Book
              </button>
              <button
                onClick={closeDialog}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmationDialog.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Action
            </h2>
            <p className="mb-4">
              Are you sure you want to remove the book "
              {confirmationDialog.book.title}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Yes, Remove
              </button>
              <button
                onClick={() =>
                  setConfirmationDialog({
                    open: false,
                    action: null,
                    book: null,
                  })
                }
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApprovedBooks;
