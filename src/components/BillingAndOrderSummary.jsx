import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  addDoc,
  setDoc,
  arrayRemove,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import BillingDetailsModal from "./BillingDetailsModal";
import { API_LINK } from "./helper/api";
import { useCart } from "./context/CartContext";
import { sendEmailToSellers } from "./sendEmailToSellers";

const MAX_ADDRESSES = 5;

function BillingAndOrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setCartLength } = useCart();

  const checkoutData = location.state?.checkoutData;
  const platformFee = checkoutData ? checkoutData.subtotal * 0.1 : 0;
  const totalPayment = checkoutData
    ? checkoutData.subtotal + checkoutData.shippingFee + platformFee
    : 0;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, [auth.currentUser, checkoutData?.selectedAddressIndex]);

  const fetchAddresses = async () => {
    if (auth?.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setAddresses(userData.addresses || []);
        if (userData.addresses && userData.addresses.length > 0) {
          setSelectedAddress(
            userData.addresses[checkoutData?.selectedAddressIndex || 0]
          );
        }
      }
    }
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsAddressDialogOpen(false);
  };

  const handleBillingSubmit = async (billingData) => {
    try {
      if (addresses.length >= MAX_ADDRESSES) {
        alert(
          "You've reached the maximum number of addresses. Please delete an address to add a new one."
        );
        return;
      }

      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        addresses: arrayUnion(billingData),
      });

      await fetchAddresses();
      setIsBillingModalOpen(false);
    } catch (error) {
      console.error("Error adding address: ", error);
    }
  };

  const handleDeleteAddress = async (addressToDelete) => {
    try {
      const updatedAddresses = addresses.filter(
        (address) => address !== addressToDelete
      );
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        addresses: updatedAddresses,
      });
      setAddresses(updatedAddresses);
      if (selectedAddress === addressToDelete) {
        setSelectedAddress(updatedAddresses[0] || null);
      }
    } catch (error) {
      console.error("Error deleting address: ", error);
    }
  };

  console.log(checkoutData);

  const generateOrderData = () => {
    const purchaseOrderId = `order_${Date.now()}`;
    return {
      purchaseOrderId,
      purchaseOrderName: "books",
      customerInfo: {
        name: `${selectedAddress.firstName} ${selectedAddress.lastName}`,
        email: selectedAddress.email,
        phone: "9811209589",
      },
      product_details: checkoutData.selectedBooks.map((book) => ({
        identity: book.id,
        produc_img: book.images,
        name: book.bookName,
        total_price: book.sellingPrice,
        quantity: 1,
        unit_price: book.sellingPrice,
        sellerId: book.sellerId,
      })),
      amount: totalPayment,
    };
  };

  const handlePaymentConfirm = async () => {
    console.log(generateOrderData());
    const orderData = generateOrderData();
    const dataToSave = {
      ...orderData,
      platformFee,
      shippingFee: checkoutData?.shippingFee?.toFixed(2) || 50,
    };
    localStorage.setItem("pendingOrder", JSON.stringify(dataToSave));

    if (paymentMethod === "wallet") {
      try {
        const response = await fetch(`${API_LINK}/api/payment/initiate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(result);
          window.location.href = result.payment_url;
        }
      } catch (error) {
        console.error("Payment initiation failed:", error);
      }
    } else if (paymentMethod === "credit") {
      try {
        const batch = writeBatch(db);
        const unavailableBooks = [];
        let userCartUpdates = [];

        const booksBySeller = orderData.product_details.reduce((acc, book) => {
          if (!acc[book.sellerId]) {
            acc[book.sellerId] = [];
          }
          acc[book.sellerId].push(book);
          return acc;
        }, {});

        for (const book of orderData.product_details) {
          const bookRef = doc(db, "approvedBooks", book.identity);
          const bookDoc = await getDoc(bookRef);

          if (!bookDoc.exists() || bookDoc.data().listStatus !== true) {
            unavailableBooks.push(book.name);
          } else {
            userCartUpdates.push(book.identity);
          }
        }

        // if (unavailableBooks.length > 0) {
        //   alert(
        //     `The following books are no longer available: ${unavailableBooks.join(
        //       ", "
        //     )}`
        //   );
        //   return;
        // }

        const timestamp = Timestamp.now();

        for (const [sellerId, books] of Object.entries(booksBySeller)) {
          const sellerAmount = books.reduce(
            (sum, book) => sum + book.total_price,
            0
          );

          const orderRef = await addDoc(collection(db, "orders"), {
            createdAt: timestamp,
            status: "pending",
            paymentMethod,
            customerInfo: orderData.customerInfo,
            product_details: books,
            sellerId: sellerId,
            amount: sellerAmount,
            userId: auth.currentUser.uid,
            read: false,
          });

          const notificationRef = doc(collection(db, "notification"));
          batch.set(notificationRef, {
            orderId: orderRef.id,
            message: "You have an order waiting to be accepted",
            status: "pending",
            sellerId: sellerId,
            timestamp: timestamp,
          });

          books.forEach((book) => {
            const bookRef = doc(db, "approvedBooks", book.identity);
            batch.update(bookRef, { listStatus: false });
          });
        }

        console.log(userCartUpdates);

        const userRef = doc(db, "users", auth.currentUser.uid);
        batch.update(userRef, {
          cart: arrayRemove(...userCartUpdates),
        });

        await batch.commit();

        setCartLength((prevLength) => prevLength - userCartUpdates.length);

        sendEmailToSellers(dataToSave);

        console.log("Order created successfully");
        navigate("/order-success", { state: { orderData: dataToSave } });
      } catch (error) {
        console.error("Failed to create order:", error);
        alert("There was an error processing your order. Please try again.");
      }
    }

    setIsPaymentDialogOpen(false);
  };

  const PaymentConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Confirm Payment</h3>
        <p className="mb-4">
          {paymentMethod === "credit"
            ? `Your credit balance of Rs. ${totalPayment.toFixed(
                2
              )} will be deducted.`
            : `You will be redirected to the payment gateway to pay Rs. ${totalPayment.toFixed(
                2
              )}.`}
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded"
            onClick={() => setIsPaymentDialogOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handlePaymentConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 container mx-auto">
      <div className="flex-1 bg-greyColor p-8 rounded-2xl shadow-lg h-fit">
        <div className="flex items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold ">Billing Details</h2>
          <button
            className="text-blue-500 hover:underline text-sm"
            onClick={() => setIsAddressDialogOpen(true)}
          >
            <FontAwesomeIcon icon={faEye} className="mr-1" />
            View All
          </button>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                value={selectedAddress?.firstName || ""}
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={selectedAddress?.lastName || ""}
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={selectedAddress?.streetAddress || ""}
              readOnly
              className="w-full px-4 py-2 bg-transparent border border-black rounded-full focus:outline-none focus:border-primaryColor transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                value="Nepal"
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Province</label>
              <input
                type="text"
                value={selectedAddress?.province || ""}
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Town/City
              </label>
              <input
                type="text"
                value={selectedAddress?.town || ""}
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Landmark</label>
              <input
                type="text"
                value={selectedAddress?.landmark || ""}
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={selectedAddress?.phone || ""}
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={selectedAddress?.email || ""}
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:w-1/3">
        <div className="bg-greyColor p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Your Order</h2>
          <div className="space-y-4">
            {checkoutData?.selectedBooks.map((book) => (
              <div key={book.id} className="flex justify-between">
                <div className="w-1/2 flex flex-col">
                  <span
                    className="line-clamp-2 font-semibold"
                    title={book.bookName}
                  >
                    {book.bookName}
                  </span>
                  <span>{book.author}</span>
                </div>
                <div>1x</div>
                <div>Rs. {book.sellingPrice.toFixed(2)}</div>
              </div>
            ))}

            <div className="w-full h-[2px] bg-primaryColor my-4"></div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {checkoutData?.subtotal?.toFixed(2) || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Rs. {checkoutData?.shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee:</span>
                <span>Rs. {platformFee.toFixed(2)}</span>
              </div>

              <div className="w-full h-[2px] bg-primaryColor my-4"></div>

              <div className="flex justify-between font-semibold">
                <span>Total Payment:</span>
                <span>Rs. {totalPayment.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="credit"
                  checked={paymentMethod === "credit"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                  style={{ accentColor: "#531D99" }}
                />
                <span>Direct Credit Transfer</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-2"
                  style={{ accentColor: "#531D99" }}
                />
                <span>Khalti</span>
              </label>
            </div>
          </div>
        </div>
        <button
          className="w-full py-3 mt-8 bg-gradient-to-t from-primaryColor to-secondaryColor rounded-full text-white text-lg font-bold shadow-lg hover:from-primaryColor hover:to-primaryColor transition"
          onClick={() => setIsPaymentDialogOpen(true)}
        >
          Place Order
        </button>
      </div>

      {isPaymentDialogOpen && <PaymentConfirmationDialog />}

      {isAddressDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Choose an Address</h3>
            <div className="max-h-96 overflow-y-auto">
              {addresses.map((address, index) => (
                <div
                  key={index}
                  className={`p-2 border rounded mb-2 ${
                    selectedAddress === address ? "bg-blue-100" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div
                      className="cursor-pointer flex-grow"
                      onClick={() => handleAddressSelect(address)}
                    >
                      <p>{`${address.firstName} ${address.lastName} (${address.phone})`}</p>
                      <p>{`${address.landmark}, ${address.town}`}</p>
                      <p>{address.streetAddress}</p>
                    </div>
                    <button
                      className="text-red-500 hover:text-red-700 ml-2"
                      onClick={() => handleDeleteAddress(address)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setIsBillingModalOpen(true)}
              >
                Add New Address
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => setIsAddressDialogOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <BillingDetailsModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
        onSubmit={handleBillingSubmit}
      />
    </div>
  );
}

export default BillingAndOrderSummary;
