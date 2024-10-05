import React from "react";

function CateCards({
  name = "Best Seller",
  img = "https://via.placeholder.com/200",
  onClick,
}) {
  return (
    <div
      className="max-w-[400px] w-full h-[180px] sm:h-[200px] lg:h-[250px] relative overflow-hidden transition-transform 
      transform hover:scale-105 shadow-lg rounded-tl-lg rounded-bl-lg"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute right-0 h-full w-[65%] bg-gradient-to-t from-primaryColor 
        to-secondaryColor opacity-95 flex items-center rounded-tl-[30px]"
      >
        <div className="text-white font-bold p-3 sm:p-4">
          <div className="text-base sm:text-lg lg:text-xl leading-tight">
            {name}
          </div>
          <div className="text-xs mt-1 cursor-pointer" onClick={onClick}>
            More{" >>>"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CateCards;
