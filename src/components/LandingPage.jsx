import React from "react";

function LandingPage() {
  return (
    <div className="m-auto flex flex-col items-center justify-center gap-10 mt-20 px-4 sm:flex-row sm:gap-16">
      <div className="max-w-[670px] text-center sm:text-left">
        <div className="font-meditative text-[48px] sm:text-[60px] md:text-[72px] lg:text-[96px] leading-none">
          Empower Minds, Ignite Change
        </div>
        <div className="font-sfpro text-threeColor text-[20px] sm:text-[22px] md:text-[24px] lg:text-[28px] font-bold mt-5">
          Unleashing the Power of Books Through Generosity
        </div>
      </div>
      <div className="w-full sm:w-1/2 flex items-center justify-center sm:justify-end">
        <img
          src="/image/heroImg.png"
          alt="reading book"
          className="w-[75] h-auto max-w-[400px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-full"
        />
      </div>
    </div>
  );
}

export default LandingPage;
