import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase.config";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faBook,
  faSpinner,
  faCalendar,
  faLanguage,
  faTags,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../utils/timeStampConversion";
import ShrinkDescription from "../utils/ShrinkDescription";
import { formatPrice } from "../utils/formatPrice";
import Skeleton from "react-loading-skeleton";

const MyApprovedBooks = () => {
  const [approvedBooks, setApprovedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchApprovedBooks = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, "approvedBooks"),
          where("sellerId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const books = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApprovedBooks(books);
        setLoading(false);

        const bookIdFromState = location.state?.bookId;
        console.log(bookIdFromState);
        if (bookIdFromState) {
          const book = books.find((b) => b.id === bookIdFromState);
          if (book) {
            setSelectedBook(book);
          } else {
            const bookDoc = await getDoc(
              doc(db, "approvedBooks", bookIdFromState)
            );
            if (bookDoc.exists()) {
              setSelectedBook({ id: bookDoc.id, ...bookDoc.data() });
            }
          }
        }
      }
    };

    fetchApprovedBooks();
  }, [location]);

  const openModal = (book) => {
    setSelectedBook(book);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedBook(null);
    document.body.style.overflow = "auto";
  };

  if (loading) {
    return (
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl overflow-hidden shadow-lg"
          >
            <Skeleton height={250} />
            <div className="p-4">
              <Skeleton height={20} width="75%" />
              <Skeleton height={15} width="50%" />
              <div className="flex justify-between items-center mt-4">
                <Skeleton height={20} width="25%" />
                <Skeleton height={15} width="30%" />
              </div>
              <div className="flex justify-between items-center w-full">
                <Skeleton height={35} width="80px" />
                <Skeleton height={35} width="50px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        My Approved Books
      </h1>
      {approvedBooks.length === 0 ? (
        <p className="text-gray-600 text-lg">
          You don't have any approved books yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {approvedBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => openModal(book)}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative h-64">
                <img
                  src={book.images[0] || "/placeholder-book.jpg"}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 m-2">
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Approved
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2 h-[3.5rem]">
                  {book.title}
                </h2>
                <p className="text-gray-600 mb-2 line-clamp-1">by {book.author}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-blue-600 font-bold">
                    {book.availability === "rent"
                      ? `${formatPrice(book.perWeekPrice)}/week`
                      : formatPrice(book.sellingPrice || book.originalPrice)}
                  </span>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                      book.condition === "new"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {book.condition}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBook && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-gradient-to-br from-slate-200 to-gray-100 rounded-3xl w-full max-w-5xl shadow-2xl transform transition-all duration-500 ease-out overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-14">
              <button onClick={closeModal} className="absolute top-4 right-6">
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>

            <div className="p-4 md:p-8 pt-2 max-h-[90vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="aspect-w-3 aspect-h-4 rounded-2xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-shadow duration-300">
                      <img
                        src={selectedBook.images[0] || "/placeholder-book.jpg"}
                        alt={selectedBook.title}
                        className="w-full h-[300px] md:h-[600px] object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {selectedBook.title}
                    </h2>
                    <p className="text-gray-600 mt-2">
                      by {selectedBook.author}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {selectedBook.availability}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        selectedBook.condition === "new"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedBook.condition}
                    </span>
                    {selectedBook.listStatus && (
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Listed
                      </span>
                    )}
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500 text-sm flex items-center">
                          <FontAwesomeIcon icon={faTags} className="mr-2" />
                          Category:
                        </p>
                        <p className="text-gray-800 font-medium">
                          {selectedBook.category}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm flex items-center">
                          <FontAwesomeIcon icon={faLanguage} className="mr-2" />
                          Language:
                        </p>
                        <p className="text-gray-800 font-medium">
                          {selectedBook.language}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm flex items-center">
                          <FontAwesomeIcon icon={faEdit} className="mr-2" />
                          Edition:
                        </p>
                        <p className="text-gray-800 font-medium">
                          {selectedBook.edition}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm flex items-center">
                          <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                          Published Year:
                        </p>
                        <p className="text-gray-800 font-medium">
                          {selectedBook.publishYear}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon
                        icon={faBook}
                        className="mr-2 text-blue-500"
                      />
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed max-h-[250px] overflow-y-auto">
                      <ShrinkDescription
                        desc={selectedBook.description}
                        size={250}
                      />
                    </p>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3">Pricing</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-500 text-sm">Original Price:</p>
                        <p className="text-gray-600 font-medium ml-2">
                          {formatPrice(selectedBook.originalPrice)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-blue-600 text-sm font-medium">
                          {selectedBook.availability === "rent"
                            ? "Rental Price:"
                            : "Selling Price:"}
                        </p>
                        <p className="text-blue-600 font-bold ml-2">
                          {selectedBook.availability === "rent"
                            ? `${formatPrice(selectedBook.perWeekPrice)}/week`
                            : formatPrice(
                                selectedBook.sellingPrice ||
                                  selectedBook.originalPrice
                              )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApprovedBooks;
