import React, { useEffect, useState } from "react";
import ArrivalCard from "./ArrivalCard";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase.config";

const ArrivalBooks = () => {
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
        where("availability", "!=", "donation"),
        orderBy("postedAt", "desc"),
        limit(6)
      );
      const querySnapshot = await getDocs(q);

      const latestBooks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBooks(latestBooks);

      console.log("Latest Books:", latestBooks);

      // return latestBooks;
    } catch (error) {
      console.error("Error fetching latest books:", error);
    }
  };

  return (
    <div className="m-auto max-w-[1500px] mt-14 p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {books.length > 0 &&
          books.map((arr, index) => (
            <ArrivalCard
              key={index}
              id={arr.id}
              img={arr.images[0]}
              title={arr.title}
              author={arr.author}
              availability={arr.availability}
            />
          ))}
      </div>
    </div>
  );
};

export default ArrivalBooks;
