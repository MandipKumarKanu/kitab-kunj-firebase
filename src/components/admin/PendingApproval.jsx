import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase.config";
import ApprovalCard from "./ApprovalBookCard";
import BookDetailsDialog from "./BookDetailsDialog";
import ConfirmationDialog from "./ConfirmationDialog";
import FeedbackDialog from "./FeedbackDialog";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const PendingApproval = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmationDialog, setConfirmationDialog] = useState({
    open: false,
    action: null,
    book: null,
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
    const bookToApprove = books.find((book) => book.id === bookId);

    try {
      const bookRef = doc(db, "pendingBooks", bookId);
      const bookDoc = await getDoc(bookRef);
      const bookData = bookDoc.data();

      await setDoc(doc(db, "approvedBooks", bookId), {
        ...bookData,
        approvedAt: new Date(),
      });

      await deleteDoc(bookRef);

      const dataToSend = {
        sellerId: sellerId || selectedBook.sellerId,
        bookId,
      };

      await sendNotification(
        dataToSend,
        `Your book "${bookData.title}" has been approved.`,
        bookData.title,
        "approved",
        bookId
      );

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error approving book:", error);
      setBooks((prevBooks) => [...prevBooks, bookToApprove]);
    }

    setDialogOpen(false);
    setSelectedBook(null);
  };

  const handleDecline = async (bookId, sellerId) => {
    setFeedbackDialog({ open: true, bookId, sellerId });
  };

  const submitDeclineWithFeedback = async () => {
    const { bookId, sellerId } = feedbackDialog;
    const bookToDecline = books.find((book) => book.id === bookId);

    try {
      const bookRef = doc(db, "pendingBooks", bookId);
      const bookDoc = await getDoc(bookRef);
      const bookData = bookDoc.data();

      await setDoc(doc(db, "declinedBooks", bookId), {
        ...bookData,
        feedback,
        declinedAt: new Date(),
      });

      await deleteDoc(bookRef);

      const dataToSend = {
        feedback,
        sellerId: sellerId || selectedBook.sellerId,
        bookId,
      };

      await sendNotification(
        dataToSend,
        `Your book "${bookData.title}" has been declined.`,
        bookData.title,
        "declined",
        bookId
      );

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Error declining book:", error);
      setBooks((prevBooks) => [...prevBooks, bookToDecline]);
    }

    setFeedbackDialog({ open: false, bookId: null, sellerId: null });
    setFeedback("");
    setDialogOpen(false);
    setSelectedBook(null);
  };

  const sendNotification = async (
    dataToSend,
    message,
    bookTitle,
    status,
    bookId
  ) => {
    try {
      await setDoc(doc(db, "notification", bookId), {
        ...dataToSend,
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pending Approval</h1>
        <div className="text-sm text-gray-500">
          {books.length} {books.length === 1 ? "book" : "books"} pending
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-center">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="rounded-lg bg-white shadow-md">
              <Skeleton height={200} className="rounded-t-lg" />
              <div className="p-4">
                <Skeleton height={30} width="80%" className="mb-2" />
                <Skeleton height={20} width="60%" className="mb-2" />
                <Skeleton height={20} width="40%" className="mb-4" />
                <div className="flex justify-between">
                  <Skeleton height={30} width="30%" />
                  <Skeleton height={30} width="30%" />
                  <Skeleton height={30} width="30%" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">No pending books</div>
          <p className="text-gray-500 mt-2">New submissions will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-center">
          {books.map((book) => (
            <ApprovalCard
              key={book.id}
              book={book}
              loading={loading}
              onApprove={() => handleConfirmation("approve", book)}
              onDecline={() => handleConfirmation("decline", book)}
              onViewDetails={() => {
                setSelectedBook(book);
                setDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <BookDetailsDialog
        isOpen={isDialogOpen}
        book={selectedBook}
        onClose={() => {
          setDialogOpen(false);
          setSelectedBook(null);
        }}
        onApprove={() => handleApprove(selectedBook.id, selectedBook.sellerId)}
        onDecline={() => handleDecline(selectedBook.id, selectedBook.sellerId)}
      />

      <ConfirmationDialog
        isOpen={confirmationDialog.open}
        action={confirmationDialog.action}
        book={confirmationDialog.book}
        onConfirm={confirmAction}
        onClose={() =>
          setConfirmationDialog({ open: false, action: null, book: null })
        }
      />

      <FeedbackDialog
        isOpen={feedbackDialog.open}
        onClose={() =>
          setFeedbackDialog({ open: false, bookId: null, sellerId: null })
        }
        onSubmit={submitDeclineWithFeedback}
        feedback={feedback}
        onFeedbackChange={(e) => setFeedback(e.target.value)}
      />
    </div>
  );
};

export default PendingApproval;
