import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { auth, db } from "../config/firebase.config";
import { OrderCard } from "./OrderCard";

const OrderConfirmation = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [remark, setRemark] = useState("");
  const location = useLocation();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchVerifyOrders = async () => {
      if (user) {
        const q = query(
          collection(db, "verifyOrders"),
          where("sellerId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
        setLoading(false);

        const orderIdFromState = location.state?.orderId;
        if (orderIdFromState) {
          const order = fetchedOrders.find(
            (b) => b.product_detail.identity === orderIdFromState
          );

          if (order) {
            setSelectedOrder(order);
            setIsDialogOpen(true);
          }
        }
      }
    };

    fetchVerifyOrders();
  }, [location, user]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const formatDate = (seconds) => {
    return new Date(seconds * 1000).toLocaleString();
  };

  const handleAccept = async () => {
    try {
      const { purchaseOrderId, index } = selectedOrder;

      const pendingOrderRef = doc(db, "pendingOrder", purchaseOrderId);
      const pendingOrderDoc = await getDoc(pendingOrderRef);

      if (!pendingOrderDoc.exists()) {
        console.error("Pending order not found");
        return;
      }

      const pendingOrderData = pendingOrderDoc.data();
      const updatedProductDetails = pendingOrderData.product_details.map(
        (product, i) => {
          if (i === index) {
            return { ...product, status: "approved" };
          }
          return product;
        }
      );

      await updateDoc(pendingOrderRef, {
        product_details: updatedProductDetails,
      });

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: "approved" } : o
        )
      );

      setIsAcceptDialogOpen(false);
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleReject = async () => {
    try {
      const { purchaseOrderId, index } = selectedOrder;

      const pendingOrderRef = doc(db, "pendingOrder", purchaseOrderId);
      const pendingOrderDoc = await getDoc(pendingOrderRef);

      if (!pendingOrderDoc.exists()) {
        console.error("Pending order not found");
        return;
      }

      const pendingOrderData = pendingOrderDoc.data();
      const updatedProductDetails = pendingOrderData.product_details.map(
        (product, i) => {
          if (i === index) {
            return { ...product, status: "rejected", remark: remark };
          }
          return product;
        }
      );

      await updateDoc(pendingOrderRef, {
        product_details: updatedProductDetails,
      });

      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: "rejected" } : o
        )
      );

      setIsRejectDialogOpen(false);
      setRemark("");
    } catch (error) {
      console.error("Error rejecting order:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 sm:mb-8">
          Order Confirmations
        </h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-xl font-medium text-gray-600">
            No orders found.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                bookImage={order.product_detail.produc_img}
                title={order.product_detail.name}
                requestedBy={order.customerInfo.name}
                date={formatDate(order.createdAt.seconds)}
                price={order.product_detail.total_price}
                onViewDetails={() => handleViewDetails(order)}
                onAccept={() => {
                  setSelectedOrder(order);
                  setIsAcceptDialogOpen(true);
                }}
                onReject={() => {
                  setSelectedOrder(order);
                  setIsRejectDialogOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative shadow-xl">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-1/2 mb-6 sm:mb-0 sm:mr-6">
                <img
                  src={selectedOrder?.product_detail.produc_img}
                  alt={selectedOrder?.product_detail.name}
                  className="w-full h-64 sm:h-full object-cover rounded-lg"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  {selectedOrder?.product_detail.name}
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <DetailItem
                    title="Customer Name"
                    value={selectedOrder?.customerInfo.name}
                  />
                  <DetailItem
                    title="Customer Email"
                    value={selectedOrder?.customerInfo.email}
                  />
                  <DetailItem
                    title="Customer Phone"
                    value={selectedOrder?.customerInfo.phone}
                  />
                  <DetailItem
                    title="Quantity"
                    value={selectedOrder?.product_detail.quantity}
                  />
                  <DetailItem
                    title="Total Price"
                    value={`₹${selectedOrder?.product_detail.total_price}`}
                  />
                  <DetailItem
                    title="Order Date"
                    value={
                      selectedOrder &&
                      formatDate(selectedOrder.createdAt.seconds)
                    }
                  />
                </div>
                <div className="mt-6 p-4 bg-gray-100 rounded-md text-sm">
                  <p className="font-medium text-gray-700">
                    Order ID:{" "}
                    <span className="font-normal">{selectedOrder?.id}</span>
                  </p>
                  <p className="font-medium text-gray-700 mt-2">
                    Status:{" "}
                    <span className="font-normal text-yellow-600">Pending</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAcceptDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center         justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 sm:p-8 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Acceptance
            </h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to accept this order? Please ensure you have
              the product with you.
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsAcceptDialogOpen(false)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {isRejectDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 sm:p-8 shadow-xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Rejection
            </h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this order? Please provide a
              remark for the cancellation.
            </p>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              rows="3"
              placeholder="Enter your remark here"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              required
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setIsRejectDialogOpen(false);
                  setRemark("");
                }}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={!remark.trim()}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ title, value }) => (
  <div>
    <p className="text-gray-500">{title}</p>
    <p className="text-gray-800 font-medium">{value}</p>
  </div>
);

export default OrderConfirmation;
