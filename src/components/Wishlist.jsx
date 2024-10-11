import { useEffect, useState } from "react";
import { fetchWishlistBooks } from "../hooks/Wishlist.Hook";
import { auth, db } from "../config/firebase.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faSpinner,
  faBook,
  faInfoCircle,
  faHeart,
  faShoppingCart,
  faHandHoldingUsd,
} from "@fortawesome/free-solid-svg-icons";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { toast } from "react-hot-toast";
import HeadingText from "./Heading";
import ShrinkDescription from "./utils/ShrinkDescription";
import { useCart } from "./context/CartContext";

const Wishlist = () => {
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingItems, setProcessingItems] = useState({});
  const userId = auth?.currentUser?.uid;

  const { setCartLength } = useCart();

  useEffect(() => {
    fetchWishlistBooks(userId, setWishlistBooks).finally(() =>
      setLoading(false)
    );
  }, [userId]);

  useEffect(() => {
    if (selectedBook) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedBook]);

  const setProcessing = (bookId, action, isProcessing) => {
    setProcessingItems((prev) => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        [action]: isProcessing,
      },
    }));
  };

  const removeFromWishlist = async (bookId) => {
    if (!userId || processingItems[bookId]?.remove) return;

    setProcessing(bookId, "remove", true);
    const userRef = doc(db, "users", userId);

    try {
      await updateDoc(userRef, {
        wishlist: arrayRemove(bookId),
      });

      setWishlistBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== bookId)
      );
      toast.success("Removed from wishlist");

      if (selectedBook?.id === bookId) {
        setSelectedBook(null);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    } finally {
      setProcessing(bookId, "remove", false);
    }
  };

  const addToCart = async (bookId) => {
    if (!userId || processingItems[bookId]?.cart) return;

    setProcessing(bookId, "cart", true);
    const userRef = doc(db, "users", userId);

    try {
      await updateDoc(userRef, {
        cart: arrayUnion(bookId),
      });

      removeFromWishlist(bookId);
      setCartLength((prev) => prev + 1);
      toast.success("Added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setProcessing(bookId, "cart", false);
    }
  };

  const rentBook = async (bookId) => {
    if (!userId || processingItems[bookId]?.rent) return;

    setProcessing(bookId, "rent", true);

    try {
      // Implement your rent logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call
      toast.success("Book rented successfully");
      removeFromWishlist(bookId);
    } catch (error) {
      console.error("Error renting book:", error);
      toast.error("Failed to rent book");
    } finally {
      setProcessing(bookId, "rent", false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="3x"
            className="text-purple-500"
          />
          <FontAwesomeIcon
            icon={faBook}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
            size="lg"
          />
        </div>
      </div>
    );
  }

  const renderActionButton = (book) => {
    if (book.availability === "rent") {
      return (
        <button
          onClick={() => rentBook(book.id)}
          disabled={processingItems[book.id]?.rent}
          className="w-10 h-10 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed relative"
          title="Rent Book"
        >
          {processingItems[book.id]?.rent ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            <FontAwesomeIcon icon={faHandHoldingUsd} />
          )}
        </button>
      );
    } else {
      return (
        <button
          onClick={() => addToCart(book.id)}
          disabled={processingItems[book.id]?.cart}
          className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed relative"
          title="Add to Cart"
        >
          {processingItems[book.id]?.cart ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            <FontAwesomeIcon icon={faShoppingCart} />
          )}
        </button>
      );
    }
  };

  return (
    <div className="container mx-auto">
      <HeadingText
        fullName="Wishlist"
        bgName="Books you liked"
        bgNameStyle={"lg:text-[9rem]"}
      />

      {wishlistBooks.length === 0 ? (
        <div className="text-center pt-20">
          <FontAwesomeIcon
            icon={faBook}
            size="4x"
            className="text-gray-400 mb-4"
          />
          <p className="text-2xl text-gray-600 font-medium">
            Your wishlist is empty!
          </p>
          <p className="text-gray-500 mt-2">
            Time to discover some amazing books!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {wishlistBooks.map((book) => (
            <div
              key={book.id}
              className="group relative bg-white/70 backdrop-blur-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-purple-100 flex flex-col h-full"
            >
              <div className="p-4 flex-grow">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-1/3">
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow text-sm font-medium text-purple-600 z-10">
                      {book.availability === "rent"
                        ? `₹${book.perWeekPrice.toLocaleString()}/week`
                        : `₹${book.sellingPrice.toLocaleString()}`}
                    </div>
                    <img
                      src={book.images?.[0] || "/placeholder-book.jpg"}
                      alt={book.title}
                      className="w-full h-48 object-cover rounded-lg shadow-lg transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-800 line-clamp-2 mb-2">
                      {book.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2 italic">
                      by {book.author}
                    </p>
                    <p className="text-sm font-medium text-purple-500 mb-2">
                      {book.availability === "rent"
                        ? "Available for Rent"
                        : "Available for Sale"}
                    </p>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                      {book.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 mt-auto">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setSelectedBook(book)}
                    className="text-purple-500 hover:text-purple-700 transition-colors flex items-center"
                  >
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                    Details
                  </button>
                  <div className="flex space-x-2">
                    {renderActionButton(book)}
                    <button
                      onClick={() => removeFromWishlist(book.id)}
                      disabled={processingItems[book.id]?.remove}
                      className="w-10 h-10 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
                      title="Remove from Wishlist"
                    >
                      {processingItems[book.id]?.remove ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : (
                        <FontAwesomeIcon icon={faHeart} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBook && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-500 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-4 sm:p-6 border-b border-purple-100">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Book Details
              </h3>
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 sm:top-6 right-4 sm:right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>

            <div
              className="p-4 sm:p-6 overflow-y-auto"
              style={{ maxHeight: "calc(90vh - 80px)" }}
            >
              <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
                <div className="md:w-1/3">
                  <img
                    src={selectedBook.images?.[0] || "/placeholder-book.jpg"}
                    alt={selectedBook.title}
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                  />
                  <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                    {selectedBook.availability === "rent" ? (
                      <>
                        <p className="text-xl font-bold text-gray-800">
                          Weekly Rent: ₹
                          {selectedBook.perWeekPrice.toLocaleString()}
                        </p>
                        <p className="text-gray-600">
                          Original Price: ₹
                          {selectedBook.originalPrice.toLocaleString()}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xl font-bold text-gray-800">
                          Selling Price: ₹
                          {selectedBook.sellingPrice.toLocaleString()}
                        </p>
                        <p className="text-gray-600">
                          Original Price: ₹
                          {selectedBook.originalPrice.toLocaleString()}
                        </p>
                      </>
                    )}

                    <div className="flex space-x-2 mt-4">
                      {selectedBook.availability === "rent" ? (
                        <button
                          onClick={() => rentBook(selectedBook.id)}
                          disabled={processingItems[selectedBook.id]?.rent}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingItems[selectedBook.id]?.rent ? (
                            <FontAwesomeIcon
                              icon={faSpinner}
                              spin
                              className="mr-2"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faHandHoldingUsd}
                              className="mr-2"
                            />
                          )}
                          Rent Book
                        </button>
                      ) : (
                        <button
                          onClick={() => addToCart(selectedBook.id)}
                          disabled={processingItems[selectedBook.id]?.cart}
                          className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processingItems[selectedBook.id]?.cart ? (
                            <FontAwesomeIcon
                              icon={faSpinner}
                              spin
                              className="mr-2"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faShoppingCart}
                              className="mr-2"
                            />
                          )}
                          Add to Cart
                        </button>
                      )}
                      <button
                        onClick={() => removeFromWishlist(selectedBook.id)}
                        disabled={processingItems[selectedBook.id]?.remove}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingItems[selectedBook.id]?.remove ? (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                          <FontAwesomeIcon icon={faHeart} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-4 sm:space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {selectedBook.title}
                  </h2>
                  <p className="text-lg sm:text-xl text-gray-600">
                    by {selectedBook.author}
                  </p>
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                    <h4 className="text-lg font-semibold mb-2">Description</h4>
                    <p className="text-gray-700 leading-relaxed max-h-[275px] overflow-y-auto">
                      <ShrinkDescription
                        desc={selectedBook.description}
                        size={300}
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

export default Wishlist;
