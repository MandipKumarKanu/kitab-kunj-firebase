import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const DonorCard = ({ book, seller }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg flex max-w-md w-full max-h-52 mx-auto">
      <div className="w-1/2 bg-blue-100 rounded-l-xl flex items-center justify-center">
        {seller.image ? (
          <img
            src={seller.image}
            alt={seller.name}
            className="w-full h-full object-cover rounded-l-xl"
          />
        ) : (
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="text-blue-500 text-4xl" />
          </div>
        )}
      </div>

      <div className="w-1/2 p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-gray-900">{seller.name}</h2>
        <p className="text-gray-600">Total Contribution: {seller.donated}</p>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2 font-semibold">
          Recent: {book.title}
        </p>
      </div>
    </div>
  );
};

export default DonorCard;
