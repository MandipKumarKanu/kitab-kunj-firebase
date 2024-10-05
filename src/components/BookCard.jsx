import React from "react";

const BookCard = ({
  id = 69,
  img = "https://via.placeholder.com/200",
  name = "University Physics",
  author = "Rohit Raj",
  publishYear = "2015",
  Offerprice = 120,
  condition = "like new",
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 w-full max-w-[440px] items-center bg-white rounded-xl shadow-none hover:shadow-md transition-shadow duration-300">
      <div className="w-full sm:w-48 h-48 sm:h-64 flex-shrink-0">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-col justify-between flex-grow w-full">
        <div>
          <span className="inline-block uppercase text-sm font-bold text-green-500 mb-1">
            {condition}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight line-clamp-2">
            {name}
          </h2>
          <p className="text-gray-600 text-sm mt-1">{author}</p>
          <span className="text-xs text-gray-500">{publishYear}</span>
        </div>

        <div className="flex flex-col mt-4">
          <div className="font-semibold text-primary text-xl mb-2">
            ₹{Number(Offerprice).toFixed(2)}
          </div>
          <button className="w-full px-4 py-2 sm:py-3 bg-btnColor text-white rounded-full hover:bg-opacity-90 transition duration-300">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
