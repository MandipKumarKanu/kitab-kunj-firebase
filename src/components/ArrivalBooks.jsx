import React from "react";
import ArrivalCard from "./ArrivalCard";

const ArrivalBooks = () => {
  const arrivalBook = [
    {
      name: "Best Seller",
      img: "/image/book6.webp",
      author: "handleCardClick",
    },
    {
      name: "Top Picks",
      img: "/image/book5.webp",
      author: "handleCardClick",
    },
    {
      name: "Reader Picks",
      img: "/image/book4.webp",
      author: "handleCardClick",
    },
    {
      name: "Trending Books",
      img: "/image/book3.jpg",
      author: "handleCardClick",
    },
    {
      name: "Recent Books",
      img: "/image/book2.png",
      author: "handleCardClick",
    },
    {
      name: "Books for Rent",
      img: "/image/book1.jpg",
      author: "handleCardClick",
    },
  ];
  return (
    <div className="m-auto max-w-[1500px] mt-14 flex justify-between">
      {arrivalBook &&
        arrivalBook.map((arr, index) => (
          <ArrivalCard
            key={index}
            img={arr.img}
            title={arr.title}
            author={arr.author}
          />
        ))}
    </div>
  );
};

export default ArrivalBooks;
