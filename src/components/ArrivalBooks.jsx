import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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
      setLoading(false); 
    } catch (error) {
      console.error("Error fetching latest books:", error);
      setLoading(false); 
    }
  };

  return (
    <div className="m-auto max-w-[1500px] mt-14 p-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="max-w-[200px] w-full">
                <Skeleton height={208} width={200} />
                <div className="mt-3">
                  <Skeleton height={20} width={160} />
                  <Skeleton height={16} width={100} className="mt-1" />
                </div>
              </div>
            ))
          : books.length > 0 &&
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
