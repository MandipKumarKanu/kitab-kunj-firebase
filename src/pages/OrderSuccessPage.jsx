import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoice, faHome } from "@fortawesome/free-solid-svg-icons";

const OrderSuccessPage = () => {
  const location = useLocation();
  const { orderData } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
            <p className="text-sm text-gray-600">Thank you for your purchase</p>
          </div>
          <div className="text-right">
            <img
              src="/api/placeholder/150/50"
              alt="Kitab Kunj"
              className="h-12"
            />
            <p className="text-sm text-gray-600 mt-2">Kitab Kunj</p>
            <p className="text-sm text-gray-600">Nepal</p>
          </div>
        </div>

        {orderData && (
          <>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
                <p className="text-gray-700">{orderData.customerInfo.name}</p>
                <p className="text-gray-700">{orderData.customerInfo.email}</p>
                <p className="text-gray-700">{orderData.customerInfo.phone}</p>
              </div>
              <div className="text-right">
                <p className="mb-1">
                  <span className="font-semibold">Invoice No:</span>{" "}
                  {orderData.purchaseOrderId}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">
                    Item
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600">
                    Quantity
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">
                    Price
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderData.product_details.map((product, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <img
                          src={product.produc_img}
                          alt={product.name}
                          className="w-16 h-20 object-cover mr-4"
                        />
                        <span className="font-medium text-gray-800">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4">
                      {product.quantity}
                    </td>
                    <td className="text-right py-4 px-4">
                      ₹{product.unit_price.toFixed(2)}
                    </td>
                    <td className="text-right py-4 px-4 font-medium">
                      ₹{product.total_price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-1/2 space-y-3">
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-medium">Subtotal:</span>
                  <span>
                    ₹
                    {(
                      orderData.amount -
                      orderData.platformFee -
                      parseFloat(orderData.shippingFee)
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-medium">Platform Fee:</span>
                  <span>₹{orderData.platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 py-2">
                  <span className="font-medium">Shipping Fee:</span>
                  <span>₹{orderData.shippingFee}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total Due:</span>
                  <span>₹{orderData.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mt-8 space-y-3">
          <Link
            to="/orders"
            className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-medium rounded transition duration-200"
          >
            <FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
            View All Orders
          </Link>
          <Link
            to="/"
            className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 text-center font-medium rounded transition duration-200"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
