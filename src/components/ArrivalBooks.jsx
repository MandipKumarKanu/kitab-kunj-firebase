import React from "react";
import ArrivalCard from "./ArrivalCard";

const ArrivalBooks = () => {
  const arrivalBook = [
    {
      title: "Best Seller",
      img: "/image/book6.webp",
      author: "handleCardClick",
    },
    {
      title: "Top Picks",
      img: "/image/book5.webp",
      author: "handleCardClick",
    },
    {
      title: "Reader Picks",
      img: "/image/book4.webp",
      author: "handleCardClick",
    },
    {
      title: "Trending Books",
      img: "/image/book3.jpg",
      author: "handleCardClick",
    },
    {
      title: "Recent Books",
      img: "/image/book2.png",
      author: "handleCardClick",
    },
    {
      title: "Books for Rent",
      img: "/image/book1.jpg",
      author: "handleCardClick",
    },
  ];

  return (
    <div className="m-auto max-w-[1500px] mt-14 p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {arrivalBook.map((arr, index) => (
          <ArrivalCard
            key={index}
            img={arr.img}
            title={arr.title}
            author={arr.author}
          />
        ))}
      </div>
    </div>
  );
};

export default ArrivalBooks;
