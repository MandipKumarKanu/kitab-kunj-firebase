import React from "react";
import PrimaryBtn from "./PrimaryBtn";

const BookCard = ({
  id = 69,
  img = "/api/placeholder/200/200",
  name = "University Physics and its Applications in Modern Technology",
  author = "Rohit Raj",
  publishYear = "2015",
  Offerprice = 120,
  condition = "like new",
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 w-full bg-white rounded-xl shadow-none hover:shadow-md transition-shadow duration-300">
      <div className="w-full sm:w-48 h-48 sm:h-64 flex-shrink-0">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-col justify-between flex-grow">
        <div>
          <span className="inline-block uppercase text-sm font-bold text-green-500 mb-1">
            {condition}
          </span>
          <div className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
            <div className="overflow-hidden overflow-ellipsis line-clamp-2">
              {name}
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-1">{author}</p>
          <span className="text-xs text-gray-500">{publishYear}</span>
        </div>

        <div className="flex flex-col mt-4">
          <div className="font-semibold text-primary text-xl mb-2">
            ₹{Number(Offerprice).toFixed(2)}
          </div>
          {/* <button className="w-full px-4 py-2 sm:py-3 bg-btnColor text-white rounded-full hover:bg-opacity-90 transition duration-300">
            Buy Now
          </button> */}
          <PrimaryBtn name="Buy Now" style="max-w-[165px] "/>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
