import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  addDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ApprovalCard from "./ApprovalCard";
import { db } from "../../config/firebase.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import ShrinkDescription from "../utils/ShrinkDescription";

const ViewDeclinedBooks = () => {
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
    fetchDeclinedBooks();
  }, []);

  const fetchDeclinedBooks = async () => {
    try {
      const declinedBooksRef = collection(db, "declinedBooks");
      const querySnapshot = await getDocs(declinedBooksRef);
      const fetchedBooks = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const sellerName = await fetchSellerName(data.sellerId);
          return { id: doc.id, sellerName, ...data };
        })
      );
      setBooks(fetchedBooks);
    } catch (error) {
      console.error("Error fetching declined books:", error);
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

  const handleDelete = async (bookId) => {
    try {
      const collectionRef = collection(db, "declinedBooks");
      const q = query(collectionRef, where("id", "==", bookId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnapshot) => {
          const bookRef = doc(db, "declinedBooks", docSnapshot.id);
          await deleteDoc(bookRef);
          console.log(
            `Document with ID: ${docSnapshot.id} deleted successfully.`
          );
          removeBook(bookId);
        });
      } else {
        console.log("No document found with the specified field value.");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleApprove = async (book) => {
    try {
      const approvedBookRef = doc(db, "approvedBooks", book.id);
      await setDoc(approvedBookRef, book);
      //   await deleteDoc(doc(db, "declinedBooks", book.id));
      //   removeBook(book.id);
      handleDelete(book.id);
    } catch (error) {
      console.error("Error approving book:", error);
    }
  };

  const removeBook = (bookId) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    setDialogOpen(false);
    setSelectedBook(null);
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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Declined Books</h1>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {books.map((book) => (
            <ApprovalCard
              key={book.id}
              book={book}
              onDelete={() => handleDelete(book.id)}
              onApprove={() => handleApprove(book)}
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
                onClick={() => handleApprove(selectedBook)}
                className="px-8 h-10 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition duration-200"
              >
                Approve
              </button>
              <button
                onClick={() => handleDelete(selectedBook.id)}
                className="px-8 h-10 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmationDialog.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl transition-all transform scale-100">
            <h2 className="text-lg font-semibold text-gray-800">
              Confirm Deletion
            </h2>
            <p className="mt-2 text-gray-700">
              Are you sure you want to delete this book?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setConfirmationDialog({ open: false })}
                className="mr-4 px-4 h-10 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmationDialog.action === "delete") {
                    handleDelete(confirmationDialog.bookId);
                  }
                  setConfirmationDialog({ open: false });
                }}
                className="px-4 h-10 rounded-lg bg-red-500 text-white hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDeclinedBooks;
