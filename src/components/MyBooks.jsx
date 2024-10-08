import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faBook,
  faLanguage,
  faCalendarAlt,
  faTags,
  faInfoCircle,
  faBookOpen,
  faUser,
  faFilter,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { auth, db } from "../config/firebase.config";
import HeadingText from "./Heading";
import { formatDate } from "./utils/timeStampConversion";
import ShrinkDescription from "./utils/ShrinkDescription";

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchMyBooks();
  }, [currentUser]);

  const fetchMyBooks = async () => {
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, "approvedBooks"),
        where("sellerId", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedBooks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(fetchedBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const filteredBooks = books.filter((book) => {
    // Apply filter based on availability
    const availabilityFilter = filter === "all" || book.availability === filter;

    // Apply search filter (case-insensitive)
    const searchFilter =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    return availabilityFilter && searchFilter;
  });

  const renderBookDetail = (icon, label, value) => (
    <div
      className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm 
                    rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="bg-blue-100 p-2 rounded-lg">
        <FontAwesomeIcon icon={icon} className="w-4 h-4 text-blue-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );

  const openModal = (book) => {
    setSelectedBook(book);
    document.body.style.overflow = "hidden"; // Prevent background scroll
  };

  const closeModal = () => {
    setSelectedBook(null);
    document.body.style.overflow = "auto"; // Restore background scroll
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          size="2x"
          className="text-blue-500"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <HeadingText fullName="Listed on Platform" bgName="My Books" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow-sm">
          <FontAwesomeIcon icon={faFilter} className="text-blue-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-none bg-transparent focus:outline-none cursor-pointer text-gray-700"
          >
            <option value="all">All Books</option>
            <option value="sell">For Sale</option>
            <option value="rent">For Rent</option>
            <option value="donation">For Donation</option>
          </select>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <FontAwesomeIcon
            icon={faBook}
            size="3x"
            className="text-gray-400 mb-4"
          />
          <p className="text-xl text-gray-600">
            No books available for this filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="relative aspect-[5/4] cursor-pointer rounded-xl overflow-hidden"
              onClick={() => openModal(book)}
            >
              <img
                src={book.images[0] || "/placeholder-book.jpg"}
                alt={book.title}
                className="w-full h-full object-cover hover:object-contain"
              />

              <div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent
                        flex flex-col justify-end p-4"
              >
                <h2 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                  {book.title}
                </h2>

                <p className="text-gray-300 text-sm mb-2">
                  Posted {formatDate(book.postedAt)}
                </p>

                <div className="flex items-center">
                  {book.availability === "donation" ? (
                    <span className="inline-block bg-green-500 text-white text-sm px-3 py-1 rounded-full">
                      For Donation
                    </span>
                  ) : (
                    <span
                      className={`inline-block text-white text-sm px-3 py-1 rounded-full
                              ${
                                book.availability === "rent"
                                  ? "bg-blue-500"
                                  : "bg-purple-500"
                              }`}
                    >
                      For {book.availability === "rent" ? "Rent" : "Sale"}
                    </span>
                  )}
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
            className="bg-gradient-to-br from-slate-200 to-gray-100 rounded-3xl w-full max-w-5xl 
                    shadow-2xl transform transition-all duration-500 ease-out overflow-hidden"
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
                    <div
                      className="aspect-w-3 aspect-h-4 rounded-2xl overflow-hidden 
                            shadow-xl group-hover:shadow-2xl transition-shadow duration-300"
                    >
                      <img
                        src={selectedBook.images[0] || "/placeholder-book.jpg"}
                        alt={selectedBook.title}
                        className="w-full h-[300px] md:h-[600px] object-cover"
                      />
                    </div>
                    {selectedBook.availability !== "donation" && (
                      <div
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm 
                    px-4 py-3 rounded-xl shadow-lg space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-gray-500 text-sm">
                            Original Price:
                          </p>
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
                              : formatPrice(selectedBook.sellingPrice)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div
                      className={`px-5 py-2 rounded-full font-medium ${
                        selectedBook.availability === "donation"
                          ? "bg-green-100 text-green-700 border-2 border-green-200"
                          : selectedBook.availability === "rent"
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                          : "bg-purple-100 text-purple-700 border-2 border-purple-200"
                      }`}
                    >
                      <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
                      {selectedBook.availability.charAt(0).toUpperCase() +
                        selectedBook.availability.slice(1)}
                    </div>
                    <div
                      className={`px-5 py-2 rounded-full font-medium capitalize ${
                        selectedBook.condition === "New"
                          ? "bg-green-100 text-green-700 border-2 border-green-200"
                          : selectedBook.condition === "Like New"
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                          : "bg-yellow-100 text-yellow-700 border-2 border-yellow-200"
                      }`}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                      {selectedBook.condition}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold ">
                      {selectedBook.title}
                    </h2>
                    <p className="text-gray-500 mt-2 flex items-center">
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      by {selectedBook.author}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {renderBookDetail(
                      faTags,
                      "Category",
                      selectedBook.category
                    )}
                    {renderBookDetail(
                      faLanguage,
                      "Language",
                      selectedBook.language
                    )}
                    {renderBookDetail(
                      faInfoCircle,
                      "Edition",
                      selectedBook.edition
                    )}
                    {renderBookDetail(
                      faCalendarAlt,
                      "Published",
                      selectedBook.publishYear
                    )}
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                      <FontAwesomeIcon
                        icon={faBook}
                        className="mr-2 text-blue-500"
                      />
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      <ShrinkDescription
                        desc={selectedBook.description}
                        size={250}
                      />
                    </p>
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

export default MyBooks;
