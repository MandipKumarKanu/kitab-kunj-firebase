import React from "react";

const ArrivalCard = ({
  img = "https://via.placeholder.com/200",
  title = "Sample Title",
  author = "Sample Author",
}) => {
  return (
    <div className="max-w-[200px] w-full">
      <div className="relative group">
        <img
          src={img}
          alt={title}
          className="object-cover rounded-lg h-52 w-full shadow-[8px_10px_8px_rgba(0,0,0,0.15)] transition-transform transform group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col mt-3">
        <strong className="text-lg font-semibold text-gray-800 overflow-hidden text-ellipsis whitespace-nowrap">
          {title}
        </strong>
        <span className="text-sm text-gray-600">{author}</span>
      </div>
    </div>
  );
};

export default ArrivalCard;
