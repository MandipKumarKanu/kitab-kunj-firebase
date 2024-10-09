import React from "react";

const HeadingText = ({
  fullName = "Featured Books",
  bgName = "FEATURED",
  fullNameStyle,
  bgNameStyle,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center ${fullNameStyle} min-h-[100px] sm:min-h-[120px] md:min-h-[140px] lg:min-h-[160px] mt-6 sm:mt-8 md:mt-10 overflow-hidden`}
    >
      <div
        className={`absolute max-w-full ${bgNameStyle} text-4xl sm:text-6xl md:text-8xl lg:text-[11rem] text-gray-300 opacity-40 font-suntage font-bold uppercase tracking-wider whitespace-nowrap`}
      >
        {bgName}
      </div>
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold relative z-10 text-center font-sfpro uppercase px-4">
        {fullName}
      </div>
    </div>
  );
};

export default HeadingText;
