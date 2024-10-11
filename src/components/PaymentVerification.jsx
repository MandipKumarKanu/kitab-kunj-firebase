import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase.config";

function PaymentVerification() {
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(location.search);
      const pidx = params.get("pidx");

      const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));

      console.log("pidx", pidx, pendingOrder);
      if (!pidx || !pendingOrder) {
        setStatus("error");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/payment/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pidx }),
          }
        );

        const verificationResult = await response.json();

        console.log(verificationResult);

        if (verificationResult.status === "Completed") {
          const orderPendingRef = collection(db, "orderPending");
          await addDoc(orderPendingRef, {
            ...pendingOrder,
            purchasedBy: auth.currentUser.uid,
            createdAt: new Date(),
            status: "completed",
            paymentDetails: verificationResult,
            paymentMethod: "khalti",
          });

          localStorage.removeItem("pendingOrder");
          setStatus("success");
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {status === "verifying" && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primaryColor mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
          <p>Please wait while we confirm your payment...</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
          <p>Redirecting to order confirmation...</p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">
            Payment Verification Failed
          </h2>
          <p className="mb-4">
            We couldn't verify your payment. Please try again or contact
            support.
          </p>
          <button
            onClick={() => navigate("/cart")}
            className="px-4 py-2 bg-primaryColor text-white rounded-full"
          >
            Return to Cart
          </button>
        </div>
      )}
    </div>
  );
}

export default PaymentVerification;
