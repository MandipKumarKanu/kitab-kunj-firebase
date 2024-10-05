import React from "react";
import BookCard from "./BookCard";

const FeaturedBook = () => {
  const booksData = [
    {
      id: 1,
      img: "https://via.placeholder.com/200",
      name: "Advanced Engineering Mathematics",
      author: "Erwin Kreyszig",
      publishYear: "2011",
      Offerprice: 350,
      condition: "like new",
    },
    {
      id: 2,
      img: "https://via.placeholder.com/200",
      name: "Artificial Intelligence: A Modern Approach",
      author: "Stuart Russell, Peter Norvig",
      publishYear: "2020",
      Offerprice: 500,
      condition: "new",
    },
    {
      id: 3,
      img: "https://via.placeholder.com/200",
      name: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      publishYear: "2019",
      Offerprice: 450,
      condition: "good",
    },
    {
      id: 4,
      img: "https://via.placeholder.com/200",
      name: "The Pragmatic Programmer: Your Journey to Mastery",
      author: "Andrew Hunt, David Thomas",
      publishYear: "2019",
      Offerprice: 300,
      condition: "used",
    },
    {
      id: 5,
      img: "https://via.placeholder.com/200",
      name: "Clean Code: A Handbook of Agile Software Craftsmanship",
      author: "Robert C. Martin",
      publishYear: "2018",
      Offerprice: 400,
      condition: "like new",
    },
    {
      id: 6,
      img: "https://via.placeholder.com/200",
      name: "Design Patterns: Elements of Reusable Object-Oriented Software",
      author: "Erich Gamma",
      publishYear: "2016",
      Offerprice: 350,
      condition: "good",
    },
    {
      id: 7,
      img: "https://via.placeholder.com/200",
      name: "Cracking the Coding Interview: 189 Programming Questions and Solutions",
      author: "Gayle Laakmann McDowell",
      publishYear: "2018",
      Offerprice: 550,
      condition: "new",
    },
    {
      id: 8,
      img: "https://via.placeholder.com/200",
      name: "Head First Design Patterns: Building Extensible Software",
      author: "Eric Freeman, Elisabeth Robson",
      publishYear: "2014",
      Offerprice: 320,
      condition: "used",
    },
    {
      id: 9,
      img: "https://via.placeholder.com/200",
      name: "You Don't Know JS Yet: Get Started",
      author: "Kyle Simpson",
      publishYear: "2021",
      Offerprice: 290,
      condition: "like new",
    },
  ];

  return (
    <div className="m-auto max-w-[1500px] w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
      {booksData.map((book) => (
        <BookCard
          key={book.id}
          id={book.id}
          img={book.img}
          name={book.name}
          author={book.author}
          publishYear={book.publishYear}
          Offerprice={book.Offerprice}
          condition={book.condition}
        />
      ))}
    </div>
  );
};

export default FeaturedBook;
