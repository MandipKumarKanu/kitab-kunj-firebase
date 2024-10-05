import React from "react";

function CateCards({
  name = "Best Seller",
  img = "https://via.placeholder.com/200",
  onClick,
}) {
  return (
    <div
      className="w-[220px] h-[250px] rounded-tl-xl rounded-bl-xl relative overflow-hidden transition-transform transform hover:scale-105 shadow-lg"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute right-0 h-full w-[65%] bg-gradient-to-t from-primaryColor to-secondaryColor opacity-95 flex items-center rounded-tl-[40px]">
        <div className="text-white font-bold px-4 pb-3">
          <div className="text-xl max-w-20 w-full leading-tight ">{name}</div>
          <div className="text-xs mt-1 cursor-pointer" onClick={onClick}>
            More{" >>>"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CateCards;
