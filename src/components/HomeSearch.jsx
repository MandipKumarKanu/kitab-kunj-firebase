import React from "react";
import PrimaryBtn from "./PrimaryBtn";

function HomeSearch() {
  return (
    <div className="flex flex-col md:flex-row gap-4 m-auto justify-center mt-20">
      <input
        type="text"
        placeholder="What's the title of the book?"
        className="border-[1px] px-4 h-10 py-2 text-lg rounded-3xl border-primaryColor w-full md:w-1/3 lg:w-1/4 xl:w-1/5"
      />
      <input
        type="text"
        placeholder="Who wrote the book?"
        className="border-[1px] px-4 h-10 py-2 text-lg rounded-3xl border-primaryColor w-full md:w-1/3 lg:w-1/4 xl:w-1/5"
      />
      <input
        type="number"
        min="1900"
        max={new Date().getFullYear()}
        placeholder="When was the book published?"
        className="border-[1px] px-4 h-10 py-2 text-lg rounded-3xl border-primaryColor w-full md:w-1/3 lg:w-1/4 xl:w-1/5"
      />
      <PrimaryBtn name="Search" />
    </div>
  );
}

export default HomeSearch;
