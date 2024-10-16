import { useState } from "react";
import { Package, User, X, ShoppingBag } from "lucide-react";
import { formatDate } from "./utils/timeStampConversion";

export const OrderDetailsDialog = ({ order, onClose, onAccept, onCancel }) => {
  const [activeTab, setActiveTab] = useState("details");

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 font-medium text-sm rounded-t-lg flex items-center space-x-2 ${
        activeTab === id
          ? "bg-white text-indigo-600 border-b-2 border-indigo-600"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            Order #{order.id.slice(-6)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="border-b">
          <div className="flex px-6">
            <TabButton id="details" label="Order Details" icon={Package} />
            <TabButton id="products" label="Products" icon={ShoppingBag} />
            <TabButton id="customer" label="Customer Info" icon={User} />
          </div>
        </div>
        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 200px)" }}
        >
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "accepted"
                      ? "bg-emerald-100 text-emerald-800"
                      : order.status === "cancelled"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              {order.cancelReason && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reason:</span>
                  <span className=" text-rose-800 capitalize line-clamp-2">
                    {order.cancelReason}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date:</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold">₹{order.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Items:</span>
                <span>
                  {order.product_details.reduce(
                    (acc, product) => acc + product.quantity,
                    0
                  )}
                </span>
              </div>
            </div>
          )}
          {activeTab === "products" && (
            <div className="space-y-4">
              {order.product_details.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
                >
                  <img
                    src={product.produc_img}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-grow">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-gray-600">
                      Quantity: {product.quantity}
                    </p>
                    <p className="text-gray-600">₹ {product.unit_price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activeTab === "customer" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Name:</span>
                <span>{order.customerInfo.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email:</span>
                <span>{order.customerInfo.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phone:</span>
                <span>{order.customerInfo.phone}</span>
              </div>
            </div>
          )}
        </div>
        {order.status === "pending" && (
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => onAccept(order)}
                className=" bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Accept Order
              </button>
              <button
                onClick={() => onCancel(order)}
                className=" bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
