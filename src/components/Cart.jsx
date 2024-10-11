import React, { useEffect, useState } from "react";
import {
  fetchCartBooks,
  updateCartInFirebase,
  moveToWishlist,
} from "../hooks/Cart.Hook";
import { auth, db } from "../config/firebase.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faLocationDot,
  faShoppingCart,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import BillingDetailsModal from "./BillingDetailsModal";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useCart } from "./context/CartContext";

const MAX_ADDRESSES = 5;
const shippingFee = 50;

const Cart = () => {
  const currentUser = auth.currentUser;
  const { uid } = currentUser;
  const navigate = useNavigate();

  const { setCartLength } = useCart();

  const [cartBooks, setCartBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState({});
  const [isWishlistDialogOpen, setIsWishlistDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSingleDelete, setIsSingleDelete] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  useEffect(() => {
    loadCartBooks();
    fetchUserAddresses();
  }, [uid]);

  const loadCartBooks = async () => {
    setIsLoading(true);
    await fetchCartBooks(uid, setCartBooks);
    setIsLoading(false);
  };

  const fetchUserAddresses = async () => {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.addresses && userData.addresses.length > 0) {
          setUserAddresses(userData.addresses);
          setSelectedAddressIndex(0);
        }
      }
    } catch (error) {
      console.error("Error fetching user addresses: ", error);
    }
  };

  const handleSelectBook = (id) => {
    setSelectedBooks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = () => {
    const allSelected = cartBooks.every((book) => selectedBooks[book.id]);
    if (allSelected) {
      setSelectedBooks({});
    } else {
      const newSelected = {};
      cartBooks.forEach((book) => {
        newSelected[book.id] = true;
      });
      setSelectedBooks(newSelected);
    }
  };

  const handleRemoveItem = (id) => {
    setCurrentBook(cartBooks.find((book) => book.id === id));
    setIsSingleDelete(true);
    setIsDeleteDialogOpen(true);
  };

  const handleRemoveSelected = async () => {
    setIsLoading(true);
    const selectedIds = isSingleDelete
      ? [currentBook.id]
      : Object.keys(selectedBooks).filter((id) => selectedBooks[id]);

    // console.log(selectedIds)

    const updatedBooks = cartBooks.filter(
      (book) => !selectedIds.includes(book.id)
    );
    await updateCartInFirebase(uid, updatedBooks);
    setCartBooks(updatedBooks);
    setCartLength((prev) => prev - selectedIds?.length);
    if (!isSingleDelete) setSelectedBooks({});

    setIsLoading(false);
    setIsDeleteDialogOpen(false);
    setIsSingleDelete(false);
  };

  const handleMoveToWishlist = async () => {
    if (currentBook) {
      setIsLoading(true);
      await moveToWishlist(uid, currentBook.id);
      const updatedBooks = cartBooks.filter(
        (book) => book.id !== currentBook.id
      );
      setCartBooks(updatedBooks);
      setSelectedBooks((prev) => {
        const { [currentBook.id]: removed, ...rest } = prev;
        return rest;
      });
      setCartLength((prev) => prev - 1);

      setIsLoading(false);
      setIsWishlistDialogOpen(false);
    }
  };

  const calculateSubtotal = () => {
    return cartBooks.reduce(
      (total, book) =>
        selectedBooks[book.id]
          ? total + book.sellingPrice * (book.quantity || 1)
          : total,
      0
    );
  };

  // console.log(cartBooks)
  const prepareCheckoutData = () => {
    const selectedBookDetails = cartBooks
      .filter((book) => selectedBooks[book.id])
      .map((book) => ({
        id: book.id,
        bookName: book.title,
        author: book.author,
        sellingPrice: book.sellingPrice,
        images: book.images[0],
      }));

    const checkoutData = {
      selectedBooks: selectedBookDetails,
      subtotal: calculateSubtotal(),
      shippingFee,
      selectedAddressIndex,
    };

    return checkoutData;
  };

  const handleCheckout = () => {
    const checkoutData = prepareCheckoutData();
    navigate("/billing", { state: { checkoutData } });
  };

  const handleBillingSubmit = async (billingData) => {
    try {
      if (userAddresses.length >= MAX_ADDRESSES) {
        alert(
          "You've reached the maximum number of addresses. Please delete an address to add a new one."
        );
        return;
      }

      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, {
          addresses: arrayUnion(billingData),
        });
      } else {
        await setDoc(userRef, {
          addresses: [billingData],
        });
      }

      console.log("Address successfully added!");

      await fetchUserAddresses();
      setSelectedAddressIndex(userAddresses.length);

      setIsBillingModalOpen(false);
    } catch (error) {
      console.error("Error adding address: ", error);
    }
  };

  const handleAddressSelection = (index) => {
    setSelectedAddressIndex(index);
    setIsAddressDialogOpen(false);
  };

  const handleDeleteAddress = async (index) => {
    try {
      const updatedAddresses = userAddresses.filter((_, i) => i !== index);
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        addresses: updatedAddresses,
      });
      setUserAddresses(updatedAddresses);
      if (selectedAddressIndex === index) {
        setSelectedAddressIndex(0);
      } else if (selectedAddressIndex > index) {
        setSelectedAddressIndex(selectedAddressIndex - 1);
      }
    } catch (error) {
      console.error("Error deleting address: ", error);
    }
  };

  const isCheckoutDisabled = Object.values(selectedBooks).every((v) => !v);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
        Your Cart
      </h1>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 ">
        <div className="w-full lg:w-2/3">
          <div className="bg-greyColor shadow-lg rounded-[2rem] p-3 sm:p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 sm:h-5 sm:w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  checked={
                    cartBooks.length > 0 &&
                    cartBooks.every((book) => selectedBooks[book.id])
                  }
                  onChange={handleSelectAll}
                />
                <span className="ml-2 text-xs sm:text-sm font-medium text-gray-700">
                  SELECT ALL ({cartBooks.length} ITEM
                  {cartBooks.length !== 1 ? "S" : ""})
                </span>
              </label>
              <button
                className="text-red-500 text-xs sm:text-sm hover:underline transition duration-300 ease-in-out transform hover:scale-105"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isCheckoutDisabled || isLoading}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className="mr-1"
                  title="Delete selected"
                />
                DELETE
              </button>
            </div>
            {isLoading ? (
              <div className="text-center py-8 ">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-sm sm:text-base text-gray-600">
                  Loading your cart...
                </p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {cartBooks.map((book) => (
                  <CartItem
                    key={book.id}
                    book={book}
                    selectedBooks={selectedBooks}
                    handleSelectBook={handleSelectBook}
                    handleRemoveItem={handleRemoveItem}
                    setCurrentBook={setCurrentBook}
                    setIsWishlistDialogOpen={setIsWishlistDialogOpen}
                    isLoading={isLoading}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-1/3">
          <div className="sticky top-24">
            <div className="bg-greyColor shadow-lg rounded-[2rem] overflow-hidden top-6">
              <div className="p-3 sm:p-4 md:p-6 pb-4 border-b-2 text-gray-600">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-base sm:text-lg font-semibold">
                    Delivery Address
                  </h2>
                  {userAddresses.length > 0 && (
                    <button
                      className="text-blue-500 hover:underline text-sm"
                      onClick={() => setIsAddressDialogOpen(true)}
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-1" />
                      View All
                    </button>
                  )}
                </div>
                {userAddresses.length > 0 ? (
                  <div className="text-xs sm:text-sm">
                    <p>{`${userAddresses[selectedAddressIndex].firstName} ${userAddresses[selectedAddressIndex].lastName} (${userAddresses[selectedAddressIndex].phone})`}</p>
                    <p>{`${userAddresses[selectedAddressIndex].landmark}, ${userAddresses[selectedAddressIndex].town}`}</p>
                    <p>{userAddresses[selectedAddressIndex].streetAddress}</p>
                  </div>
                ) : (
                  <div
                    className="flex items-center text-xs sm:text-sm cursor-pointer"
                    onClick={() => setIsBillingModalOpen(true)}
                  >
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="mr-2 text-btnColor"
                    />
                    <span>Add Shipping Address</span>
                  </div>
                )}
                {userAddresses.length > 0 &&
                  userAddresses.length < MAX_ADDRESSES && (
                    <button
                      className="text-blue-500 hover:underline mt-2 text-sm"
                      onClick={() => setIsBillingModalOpen(true)}
                    >
                      Add New Address
                    </button>
                  )}
                {userAddresses.length >= MAX_ADDRESSES && (
                  <p
                    className="text-red-500 mt-2 text-xs cursor-not-allowed"
                    title="You must delete an address to add a new one"
                  >
                    Maximum address limit reached to add new address
                  </p>
                )}
              </div>
              <div className="p-3 sm:p-4 md:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">
                  Order Summary
                </h2>
                <div className="space-y-2 mb-4 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span>
                      Subtotal (
                      {Object.values(selectedBooks).filter(Boolean).length}{" "}
                      items)
                    </span>
                    <span>Rs. {calculateSubtotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span>Rs. {shippingFee}</span>
                  </div>
                </div>
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Enter Voucher Code"
                    className="flex-grow text-sm border p-2 px-4 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primaryColor"
                  />
                  <button className="rounded-3xl bg-gradient-to-t from-primaryColor to-secondaryColor text-white font-bold shadow-lg px-3 sm:px-4 py-2 transition duration-200 whitespace-nowrap text-sm">
                    APPLY
                  </button>
                </div>
                <div className="flex justify-between font-semibold text-base sm:text-lg mb-4">
                  <span>Total</span>
                  <span>
                    Rs.
                    {calculateSubtotal() > 0
                      ? calculateSubtotal() + shippingFee
                      : 0}
                  </span>
                </div>
                <button
                  className={`w-full py-2 sm:py-3 rounded-3xl text-white font-semibold transition duration-200 text-sm sm:text-base ${
                    isCheckoutDisabled
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-gradient-to-t from-primaryColor to-secondaryColor rounded-3xl text-white text-xl font-bold shadow-lg"
                  }`}
                  disabled={isCheckoutDisabled || isLoading}
                  onClick={handleCheckout}
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                  PROCEED TO CHECKOUT (
                  {Object.values(selectedBooks).filter(Boolean).length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isWishlistDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg max-w-sm w-full">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Move to Wishlist
            </h2>
            <p className="mb-6 text-sm sm:text-base">
              Are you sure you want to move this item to your wishlist?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200 text-sm"
                onClick={() => setIsWishlistDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 text-sm"
                onClick={handleMoveToWishlist}
                disabled={isLoading}
              >
                {isLoading ? "Moving..." : "Yes, Move to Wishlist"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg max-w-sm w-full">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Confirm {isSingleDelete ? "Single" : "Bulk"} Deletion
            </h2>
            <p className="mb-6 text-sm sm:text-base">
              Are you sure you want to remove the{" "}
              {isSingleDelete ? "item" : "selected items"} from your cart?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-200 text-sm"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 text-sm"
                onClick={handleRemoveSelected}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddressDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg max-w-md w-full">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">
              Your Addresses
            </h2>
            {userAddresses.map((address, index) => (
              <div
                key={index}
                className={`p-2 mb-2 cursor-pointer ${
                  index === selectedAddressIndex ? "bg-blue-100 rounded" : ""
                }`}
              >
                <div className="flex justify-between items-center">
                  <div onClick={() => handleAddressSelection(index)}>
                    <p>{`${address.firstName} ${address.lastName} (${address.phone})`}</p>
                    <p>{`${address.landmark}, ${address.town}`}</p>
                    <p>{address.streetAddress}</p>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteAddress(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                onClick={() => setIsAddressDialogOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {!isLoading && cartBooks.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <FontAwesomeIcon icon={faShoppingCart} className="text-5xl" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Looks like you haven't added any books to your cart yet.
          </p>
          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
            Continue Shopping
          </button>
        </div>
      )}

      <BillingDetailsModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
        onSubmit={handleBillingSubmit}
      />
    </div>
  );
};

export default Cart;
