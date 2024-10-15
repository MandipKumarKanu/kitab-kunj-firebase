import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  arrayRemove,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../config/firebase.config";
import { API_LINK } from "./helper/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faTriangleExclamation,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "./context/CartContext";
import { sendEmailToSellers } from "./sendEmailToSellers";

function PaymentVerification() {
  const { setCartLength } = useCart();
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const pidx = params.get("pidx");

      const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));
      console.log(pendingOrder);

      if (!pidx || !pendingOrder) {
        setStatus("error");
        return;
      }

      try {
        const response = await fetch(`${API_LINK}/api/payment/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pidx }),
        });

        const verificationResult = await response.json();

        if (verificationResult.status === "Completed") {
          const batch = writeBatch(db);
          const unavailableBooks = [];
          let userCartUpdates = [];

          const booksBySeller = pendingOrder.product_details.reduce(
            (acc, book) => {
              if (!acc[book.sellerId]) {
                acc[book.sellerId] = [];
              }
              acc[book.sellerId].push(book);
              return acc;
            },
            {}
          );

          for (const book of pendingOrder.product_details) {
            const bookRef = doc(db, "approvedBooks", book.identity);
            const bookDoc = await getDoc(bookRef);

            if (!bookDoc.exists() || bookDoc.data().listStatus !== true) {
              unavailableBooks.push(book.name);
            } else {
              userCartUpdates.push(book.identity);
            }
          }

          // if (unavailableBooks.length > 0) {
          //   setStatus("partialError");
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
              paymentMethod: "khalti",
              customerInfo: pendingOrder.customerInfo,
              product_details: books,
              sellerId: sellerId,
              amount: sellerAmount,
              userId: auth.currentUser.uid,
              paymentDetails: verificationResult,
            });

            const notificationRef = doc(collection(db, "notification"));
            batch.set(notificationRef, {
              orderId: orderRef.id,
              message: "You have an order waiting to be accepted",
              status: "pending",
              sellerId: sellerId,
              timestamp: timestamp,
              read: false,
            });

            books.forEach((book) => {
              const bookRef = doc(db, "approvedBooks", book.identity);
              batch.update(bookRef, { listStatus: false });
            });
          }

          const userRef = doc(db, "users", auth.currentUser.uid);
          batch.update(userRef, {
            cart: arrayRemove(...userCartUpdates),
          });

          await batch.commit();

          setCartLength((prevLength) => prevLength - userCartUpdates.length);

          localStorage.removeItem("pendingOrder");
          setStatus("success");
          sendEmailToSellers(pendingOrder);

          setTimeout(() => {
            navigate("/order-success", { state: { orderData: pendingOrder } });
          }, 2000);
        } else {
          throw new Error("Payment was not completed");
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [location, navigate]);

  const statusConfig = {
    verifying: {
      icon: faSpinner,
      title: "Verifying Payment",
      message: "Please wait while we confirm your payment...",
      color: "text-blue-500",
      spin: true,
    },
    success: {
      icon: faCircleCheck,
      title: "Payment Successful!",
      message: "Redirecting to order confirmation...",
      color: "text-green-500",
    },
    error: {
      icon: faCircleXmark,
      title: "Payment Verification Failed",
      message:
        "We couldn't verify your payment. Please try again or contact support.",
      color: "text-red-500",
      action: {
        text: "Return to Cart",
        onClick: () => navigate("/cart"),
      },
    },
    partialError: {
      icon: faTriangleExclamation,
      title: "Order Processing Issue",
      message:
        "Some books in your order are no longer available. Your payment has been processed, but we couldn't complete your order. Please contact support for assistance.",
      color: "text-yellow-500",
      action: {
        text: "Contact Support",
        onClick: () => navigate("/contact-support"),
      },
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <FontAwesomeIcon
          icon={currentStatus.icon}
          className={`text-6xl ${currentStatus.color} ${
            currentStatus.spin ? "animate-spin" : ""
          } mb-6`}
        />
        <h2 className="text-2xl font-semibold mb-4">{currentStatus.title}</h2>
        <p className="text-gray-600 mb-6">{currentStatus.message}</p>
        {currentStatus.action && (
          <button
            onClick={currentStatus.action.onClick}
            className="px-6 py-2 bg-primaryColor text-white rounded-full hover:bg-opacity-90 transition duration-300"
          >
            {currentStatus.action.text}
          </button>
        )}
      </div>
    </div>
  );
}

export default PaymentVerification;
