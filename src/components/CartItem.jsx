import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

const CartItem = ({
  book,
  selectedBooks,
  handleSelectBook,
  handleRemoveItem,
  setCurrentBook,
  setIsWishlistDialogOpen,
  isLoading,
}) => (
  <div className="flex items-start border-b border-gray-200 pb-4 bg-greyColor transition duration-300 rounded-lg p-2 sm:p-4">
    <div className="flex items-start space-x-2 sm:space-x-4 w-full">
      <div className="mt-1 sm:mt-1.5">
        <input
          type="checkbox"
          className="form-checkbox h-4 w-4 text-primaryColor rounded border-black focus:ring-primaryColor"
          checked={selectedBooks[book.id] || false}
          onChange={() => handleSelectBook(book.id)}
        />
      </div>

      <div className="flex-shrink-0 w-16 h-20 sm:w-20 sm:h-28">
        <img
          src={book.images[0]}
          alt={book.title}
          className="w-full h-full object-cover rounded-md shadow-md"
        />
      </div>

      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-sm sm:text-lg text-black mb-1 truncate">
          {book.title}
        </h3>
        <p className="text-xs sm:text-sm text-black mb-1 truncate">
          {book.author}
        </p>
        <p className="text-xs sm:text-sm text-black mb-2">
          Edition: {book.edition}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-2 sm:mb-0">
            <span className="text-red-500 font-semibold text-sm sm:text-lg">
              Rs. {book.sellingPrice}
            </span>
            <span className="text-black line-through ml-2 text-xs sm:text-sm">
              Rs. {book.originalPrice}
            </span>
          </div>

          <div className="flex justify-between sm:justify-normal items-center space-x-4 sm:space-x-6">
            <div className="flex items-center border rounded-md">
              <button
                className="px-2 py-0.5 sm:px-3 sm:py-1 hover:bg-gray-100 transition-colors duration-200 cursor-not-allowed"
                disabled
              >
                <FontAwesomeIcon
                  icon={faMinus}
                  className="text-xs sm:text-base"
                />
              </button>
              <span className="px-2 sm:px-4 py-0.5 sm:py-1 border-x text-sm">
                {book.quantity || 1}
              </span>
              <button
                className="px-2 py-0.5 sm:px-3 sm:py-1 hover:bg-gray-100 transition-colors duration-200 cursor-not-allowed"
                disabled
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-xs sm:text-base"
                />
              </button>
            </div>

            <div className="flex space-x-5 sm:space-x-6">
              <button
                className="text-gray-700 hover:text-purple-800 transition-colors duration-200"
                onClick={() => handleRemoveItem(book.id)}
                disabled={isLoading}
                title="Remove from cart"
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-xl sm:text-2xl"
                />
              </button>
              <button
                className="text-gray-700 hover:text-red-500 transition-colors duration-200"
                onClick={() => {
                  setCurrentBook(book);
                  setIsWishlistDialogOpen(true);
                }}
                disabled={isLoading}
                title="Move to wishlist"
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className="text-xl sm:text-2xl"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CartItem;
