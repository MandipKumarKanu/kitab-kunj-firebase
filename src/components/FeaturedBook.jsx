import React, { useEffect, useState } from "react";
import BookCard from "./BookCard";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";

const FeaturedBook = () => {
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchLatestBooks();
  }, []);

  const [books, setBooks] = useState([]);

  const fetchLatestBooks = async () => {
    try {
      const booksRef = collection(db, "approvedBooks");
      const q = query(
        booksRef,
        where("availability", "==", "sell"),
        where("sellerId", "!=", currentUser?.uid || ""),
        limit(9)
      );
      const querySnapshot = await getDocs(q);

      const latestBooks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBooks(latestBooks);

      console.log("Latest Books:", latestBooks);

      return latestBooks;
    } catch (error) {
      console.error("Error fetching latest books:", error);
    }
  };

  return (
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
            />
          ))}
      </div>
    </div>
  );
};

export default FeaturedBook;
