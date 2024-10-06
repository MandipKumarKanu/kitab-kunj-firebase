import React, { useEffect, useState } from "react";
import HeadingText from "../components/Heading";
import BookCard from "../components/BookCard";
import { auth, db } from "../config/firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";

const BuyPage = () => {
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchBookForSell();
  }, []);

  const [books, setBooks] = useState([]);

  const fetchBookForSell = async () => {
    try {
      const booksRef = collection(db, "books");
      const q = query(
        booksRef,
        where("availability", "==", "sell"),
        where("sellerId", "!=", currentUser?.uid || "")
      );
      const querySnapshot = await getDocs(q);

      const bookForSell = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBooks(bookForSell);

      console.log("Latest Books:", bookForSell);
    } catch (error) {
      console.error("Error fetching latest books:", error);
    }
  };

  return (
    <>
      <HeadingText fullName="Buy Books" bgName="Book For Sell" />

      <div className="container mx-auto px-4 mt-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {books.length > 0 &&
            books.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                img={book.images[0]}
                name={book.title}
                author={book.author}
                publishYear={book.publishYear}
                Offerprice={book.Offerprice}
                condition={book.availability}
                availability={book.availability}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default BuyPage;
