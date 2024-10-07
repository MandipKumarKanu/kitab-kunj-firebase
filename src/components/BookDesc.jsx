import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faHeart as faHeartSolid,
  faBox,
  faBookmark,
  faBook,
  faTruck,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { RWebShare } from "react-web-share";
import { useLocation, useParams } from "react-router-dom";
import { auth, db } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import Magnifier from "react18-image-magnifier";
import ShrinkDescription from "./utils/ShrinkDescription";
import { fetchWishlistStatus, toggleWishlist } from "../hooks/Wishlist.Hook";

const BookDesc = () => {
  const currentUser = auth.currentUser;
  const { uid } = currentUser;

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [book, setBook] = useState(null);
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    fetchBook();
    checkWishlistStatus();
  }, [id]);

  const fetchBook = async () => {
    try {
      const bookDoc = doc(db, "approvedBooks", id);
      const bookSnapshot = await getDoc(bookDoc);

      if (bookSnapshot.exists()) {
        setBook({ id: bookSnapshot.id, ...bookSnapshot.data() });
      } else {
        console.log("No book found with the provided ID.");
      }
    } catch (error) {
      console.error("Error fetching book:", error);
    }
  };

  const checkWishlistStatus = async () => {
    const wishlisted = await fetchWishlistStatus(uid, id);
    setIsWishlisted(wishlisted);
  };

  const handleWishlist = async () => {
    await toggleWishlist(uid, id);
    setIsWishlisted(!isWishlisted);
  };

  const currentUrl = `${window.location.origin}${location.pathname}`;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-5 mb-6 px-6 py-8 bg-purple-100 rounded-3xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20  ">
        <div>
          <div className="sticky top-8 w-full h-96 sm:h-[680px] flex-shrink-0 overflow-hidden rounded-lg">
            <Magnifier
              src={book.images[0]}
              zoomFactor={1.65}
              alt={book.title}
              className="w-full shadow-lg h-full object-cover"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                display: "block",
                cursor: "crosshair",
              }}
            />
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-gray-600">by {book.author}</p>
          </div>

          <div className="flex items-baseline gap-4 mb-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                {book.availability === "rent" ? (
                  <>
                    <span className="text-3xl font-bold text-btnColor">
                      {formatPrice(book.perWeekPrice)}/week
                    </span>
                    {book.originalPrice > 0 && (
                      <span className="text-sm text-gray-500">
                        Original Price: {formatPrice(book.originalPrice)}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-emerald-600">
                      {formatPrice(book.sellingPrice)}
                    </span>
                    {book.originalPrice > book.sellingPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(book.originalPrice)}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleWishlist}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors duration-200"
                >
                  <FontAwesomeIcon
                    icon={isWishlisted ? faHeartSolid : faHeartRegular}
                    className={`${isWishlisted && "text-red-500"} text-2xl`}
                  />
                </button>
                <RWebShare
                  data={{
                    text: `Check out "${book.title}" by ${book.author} - A must-read book!`,
                    url: currentUrl,
                    title: `KitabKunj - ${book.title}`,
                  }}
                  onClick={() => console.log("shared successfully!")}
                >
                  <button className="p-2 text-gray-500 hover:text-blue-500 transition-colors duration-200">
                    <FontAwesomeIcon icon={faShareNodes} className="text-2xl" />
                  </button>
                </RWebShare>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faBox}
                className="text-gray-400 w-5 mr-2"
              />
              <span className="text-gray-700">Condition: </span>
              <span
                className={`ml-1 font-medium uppercase ${
                  book.condition === "new"
                    ? "text-emerald-600"
                    : "text-amber-600"
                }`}
              >
                {book.condition}
              </span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faBookmark}
                className="text-gray-400 w-5 mr-2"
              />
              <span className="text-gray-700">Category: </span>
              <span className="ml-1 font-medium text-gray-900">
                {book.category}
              </span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faBook}
                className="text-gray-400 w-5 mr-2"
              />
              <span className="text-gray-700">Availability: </span>
              <span className="ml-1 font-medium text-gray-900 capitalize">
                {book.availability}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">
              <ShrinkDescription desc={book.description} size={300} />
            </p>
          </div>
        </div>

        <div>
          <div className="bg-green-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Product Details
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Edition:</span>
                <span className="text-gray-900">{book.edition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Language:</span>
                <span className="text-gray-900">{book.language}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Publish Year:</span>
                <span className="text-gray-900">{book.publishYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seller:</span>
                <span className="text-gray-900">{book.sellerName}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-yellow-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Delivery Information
            </h2>
            <div className="flex items-center mb-3">
              <FontAwesomeIcon
                icon={faTruck}
                className="text-gray-400 w-5 mr-2"
              />
              <span className="text-gray-700">
                Delivery Charge: ₹50 on all orders
              </span>
            </div>
            <div className="mb-3">
              <span className="text-gray-700">
                No return policy is available.
              </span>
            </div>

            <button className="w-full px-6 py-3 bg-gradient-to-t from-primaryColor to-secondaryColor rounded-3xl text-white text-xl font-bold shadow-lg transition-colors duration-300 ease-in-out hover:bg-gradient-to-t hover:from-secondaryColor hover:to-primaryColor">
              <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
              {book.availability === "rent" ? "Rent Now" : "Buy Now"}
            </button>

            {book.availability === "rent" && (
              <p className="mt-4 text-sm text-gray-600">
                Enjoy reading with our flexible rental option. Rent the book for
                ₹{book.perWeekPrice}/week and return it anytime!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDesc;
