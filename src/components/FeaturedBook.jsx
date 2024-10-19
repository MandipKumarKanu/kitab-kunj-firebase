import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import BookCard from "./BookCard";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import SkeletonCard from "./SkeletonCard";

const FeaturedBook = () => {
  const currentUser = auth.currentUser;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestBooks();
  }, []);

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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching latest books:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 mt-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 9 }).map((_, index) => (
              <SkeletonCard index={index} />
            ))
          : books.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                img={book.images[0]}
                name={book.title}
                author={book.author}
                publishYear={book.publishYear}
                perWeekPrice={book.perWeekPrice}
                condition={book.condition}
                sellingPrice={book.sellingPrice}
                showAva={false}
              />
            ))}
      </div>
    </div>
  );
};

export default FeaturedBook;
