import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { auth, db } from "../config/firebase.config";
import { Package } from "lucide-react";
import { OrderCard } from "./OrderCard";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import {
  sendOrderAcceptedEmailToCustomer,
  sendOrderRejectedEmailToCustomer,
} from "./EmailToCostumer";

const OrderConfirmation = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const location = useLocation();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const q = query(
          collection(db, "orders"),
          where("sellerId", "==", user.uid),
          where("status", "==", "pending"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(fetchedOrders);
        setOrders(fetchedOrders);
        setLoading(false);

        const orderIdFromState = location.state?.orderId;
        if (orderIdFromState) {
          const order = fetchedOrders.find((o) => o.id === orderIdFromState);
          if (order) {
            setSelectedOrder(order);
            setIsDialogOpen(true);
          }
        }
      }
    };

    fetchOrders();
  }, [location, user]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleAccept = async () => {
    try {
      const orderRef = doc(db, "orders", selectedOrder.id);
      await updateDoc(orderRef, { status: "accepted" });
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: "accepted" } : o
        )
      );
      setIsAcceptDialogOpen(false);
      setIsDialogOpen(false);
      sendOrderAcceptedEmailToCustomer(selectedOrder);
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleCancel = async () => {
    try {
      const orderRef = doc(db, "orders", selectedOrder.id);
      await updateDoc(orderRef, {
        status: "cancelled",
        cancelReason: cancelReason,
      });
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === selectedOrder.id
            ? { ...o, status: "cancelled", cancelReason: cancelReason }
            : o
        )
      );
      setIsCancelDialogOpen(false);
      setIsDialogOpen(false);
      setCancelReason("");
      sendOrderRejectedEmailToCustomer(selectedOrder, cancelReason);
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  return (
    <div
      className={`min-h-screen text-gray-900 transition-colors duration-300`}
    >
      <div className="max-w-[1450px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Order Confirmations</h1>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className={`h-[60dvh] flex justify-center items-center text-center`}>
            <div>
              <Package className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
              <p className="text-xl font-medium">No orders found.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {orders &&
              orders
                .filter((order) => order.status === "pending")
                .map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={handleViewDetails}
                    onAccept={() => {
                      setSelectedOrder(order);
                      setIsAcceptDialogOpen(true);
                    }}
                    onCancel={() => {
                      setSelectedOrder(order);
                      setIsCancelDialogOpen(true);
                    }}
                  />
                ))}
          </div>
        )}
      </div>

      {isDialogOpen && selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          onClose={() => setIsDialogOpen(false)}
          onAccept={() => {
            setIsDialogOpen(false);
            setIsAcceptDialogOpen(true);
          }}
          onCancel={() => {
            setIsDialogOpen(false);
            setIsCancelDialogOpen(true);
          }}
        />
      )}

      {isAcceptDialogOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div
            className={`${"bg-white text-gray-900"} rounded-lg p-6 max-w-sm w-full`}
          >
            <h2 className="text-xl font-semibold mb-4">Confirm Acceptance</h2>
            <p className="mb-6">Are you sure you want to accept this order?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAcceptDialogOpen(false)}
                className={`px-4 py-2 ${"bg-gray-200 text-gray-800"} rounded-lg hover:opacity-80 transition-opacity`}
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {isCancelDialogOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div
            className={`${"bg-white text-gray-900"} rounded-lg p-6 max-w-sm w-full`}
          >
            <h2 className="text-xl font-semibold mb-4">Cancel Order</h2>
            <p className="mb-4">Please provide a reason for cancellation:</p>
            <textarea
              className={`w-full p-2 border ${"bg-white border-gray-300"} rounded-md mb-4`}
              rows="3"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason"
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsCancelDialogOpen(false)}
                className={`px-4 py-2 ${"bg-gray-200 text-gray-800"} rounded-lg hover:opacity-80 transition-opacity`}
              >
                Back
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                disabled={!cancelReason.trim()}
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
