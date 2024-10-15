import { formatDate } from "./utils/timeStampConversion";

export const OrderCard = ({ order, onViewDetails, onAccept, onCancel }) => {
  const { id, product_details, customerInfo, createdAt, amount, status } =
    order;

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
      <div className="flex flex-col h-full">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <div className="absolute inset-0 grid grid-cols-2 gap-1 p-2">
            {product_details.slice(0, 4).map((product, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg">
                <img
                  src={product.produc_img}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <p className="text-white text-xs font-medium text-center px-1">
                    {product.name}
                  </p>
                </div>
              </div>
            ))}
            {product_details.length > 4 && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs font-medium rounded-full px-2 py-1">
                +{product_details.length - 4} more
              </div>
            )}
          </div>
        </div>
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Order #{id.slice(-6)}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                status
              )}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Customer: {customerInfo.name}</p>
            <p>Date: {formatDate(createdAt)}</p>
            <p>Amount: ₹{amount}</p>
            <p>Items: {product_details.length}</p>
          </div>
        </div>
        <div className="p-4 bg-gray-50">
          <div className="flex space-x-2">
            {status === "pending" && (
              <>
                <button
                  onClick={() => onAccept(order)}
                  className="flex-1 bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
                >
                  Accept
                </button>
                <button
                  onClick={() => onCancel(order)}
                  className="flex-1 bg-rose-500 text-white py-2 px-4 rounded-lg hover:bg-rose-600 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={() => onViewDetails(order)}
              className="flex-1 bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
