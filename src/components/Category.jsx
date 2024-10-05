import React from "react";
import CateCards from "./CateCards";

function Category() {
  const handleCardClick = () => {
    console.log("More information clicked!");
  };

  const cateArray = [
    {
      name: "Best Seller",
      img: "/image/book6.webp",
      onClick: handleCardClick,
    },
    {
      name: "Top Picks",
      img: "/image/book5.webp",
      onClick: handleCardClick,
    },
    {
      name: "Reader Picks",
      img: "/image/book4.webp",
      onClick: handleCardClick,
    },
    {
      name: "Trending Books",
      img: "/image/book3.jpg",
      onClick: handleCardClick,
    },
    {
      name: "Recent Books",
      img: "/image/book2.png",
      onClick: handleCardClick,
    },
    {
      name: "Books for Rent",
      img: "/image/book1.jpg",
      onClick: handleCardClick,
    },
  ];

  return (
    <div className="m-auto max-w-[1500px] mt-14 flex justify-between">
      {cateArray.map((cat, index) => (
        <CateCards
          key={index}
          name={cat.name}
          img={cat.img}
          onClick={cat.onClick}
        />
      ))}
    </div>
  );
}

export default Category;
