export const OrderCard = ({
  bookImage,
  title,
  requestedBy,
  date,
  price,
  onViewDetails,
  onAccept,
  onReject,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 transition-all duration-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row items-center">
        <img
          src={bookImage}
          alt={title}
          className="w-full sm:w-24 h-48 sm:h-36 object-cover rounded-md mb-4 sm:mb-0 sm:mr-6"
        />
        <div className="flex-grow w-full sm:w-auto">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">{title}</h2>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div>
              <p className="text-gray-500">Requested by</p>
              <p className="text-gray-700">{requestedBy}</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="text-gray-700">{date}</p>
            </div>
            <div>
              <p className="text-gray-500">Price</p>
              <p className="text-gray-700">₹{price}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col justify-center sm:justify-start space-x-2 sm:space-x-0 sm:space-y-2 mt-4 sm:mt-0 sm:ml-6">
          <button
            onClick={onAccept}
            className="px-4 py-1.5 border border-green-500 text-green-500 rounded-full text-sm font-medium hover:bg-green-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            Accept
          </button>
          <button
            onClick={onReject}
            className="px-4 py-1.5 border border-red-500 text-red-500 rounded-full text-sm font-medium hover:bg-red-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            Reject
          </button>
          <button
            onClick={onViewDetails}
            className="px-4 py-1.5 border border-blue-500 text-blue-500 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};
