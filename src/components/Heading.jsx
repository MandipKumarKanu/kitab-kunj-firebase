import React from "react";

const HeadingText = ({ fullName = "Featured Books", bgName = "FEATURED" }) => {
  return (
    <div className="relative flex items-center justify-center min-h-[160px] mt-10">
      <div className="absolute text-[12rem] text-gray-300 opacity-40 font-suntage font-bold">
        {bgName}
      </div>
      <div className="text-7xl font-bold relative z-10 text-center font-sfpro">
        {fullName}
      </div>
    </div>
  );
};

export default HeadingText;
