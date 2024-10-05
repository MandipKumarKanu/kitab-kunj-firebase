import React from "react";

function LandingPage() {
  return (
    <div className="m-auto flex items-center justify-center gap-10 mt-20">
      <div className="max-w-[670px]">
        <div className="font-meditative text-[96px] leading-none">
          Empower Minds, Ignite Change
        </div>
        <div className="font-sfpro text-threeColor text-[28px] font-bold mt-5">
          Unleashing the Power of Books Through Generosity
        </div>
      </div>
      <div>
        <img src="/image/heroImg.png" alt="reading book" className="w-full" />
      </div>
    </div>
  );
}

export default LandingPage;
