import React, { useEffect, useState } from "react";
import HeadingText from "../components/Heading";
import BookCard from "../components/BookCard";
import { auth, db } from "../config/firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";

const RentPage = () => {
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchBookForRent();
  }, []);

  const [books, setBooks] = useState([]);

  const fetchBookForRent = async () => {
    try {
      const booksRef = collection(db, "approvedBooks");
      const q = query(
        booksRef,
        where("availability", "==", "rent"),
        where("sellerId", "!=", currentUser?.uid || ""),
        where("listStatus", "==", true)
      );
      const querySnapshot = await getDocs(q);

      const bookForRent = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBooks(bookForRent);

      console.log("Latest Books:", bookForRent);
    } catch (error) {
      console.error("Error fetching latest books:", error);
    }
  };

  return (
    <>
      <HeadingText fullName="Rent a Book" bgName="Book For Rent" />

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
                perWeekPrice={book.perWeekPrice}
                condition={book.condition}
                availability={book.availability}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default RentPage;
