import React from "react";

function PrimaryBtn({ onClick, name, style }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 h-10 py-6 max-w-[250px] flex items-center justify-center w-full bg-gradient-to-t from-primaryColor to-secondaryColor rounded-3xl text-white text-xl font-bold shadow-lg transition-transform duration-300 ease-in-out hover:scale-105 ${style}`}
    >
      {name}
    </button>
  );
}

export default PrimaryBtn;
