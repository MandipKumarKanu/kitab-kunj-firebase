import React, { useEffect, useState } from "react";
import BookCard from "../components/BookCard";
import { auth, db } from "../config/firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import HeadingText from "../components/Heading";

const AllBooks = () => {
  const currentUser = auth.currentUser;

  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    fetchAllBook();
  }, [filter, sort]);

  const fetchAllBook = async () => {
    try {
      const booksRef = collection(db, "books");
      // let q;

      // if (filter === "all") {
      //   q = query(booksRef, where("sellerId", "!=", currentUser?.uid || ""));
      // } else {
      //   q = query(
      //     booksRef,
      //     where("sellerId", "!=", currentUser?.uid || ""),
      //     where("availability", "==", filter)
      //   );
      // }

      const q = query(
        booksRef,
        // where("availability", "==", "sell", "||", "availability", "==", "rent"),
        where("sellerId", "!=", currentUser?.uid || "")
      );

      const querySnapshot = await getDocs(q);
      const allBook = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredBook = allBook.filter((book) => {
        return book.availability != "donation";
      });

      // if (sort === "asc") {
      //   allBook.sort((a, b) => a.Offerprice - b.Offerprice);
      // } else if (sort === "desc") {
      //   allBook.sort((a, b) => b.Offerprice - a.Offerprice);
      // }

      setBooks(filteredBook);
      console.log("Latest Books:", allBook);

      return allBook;
    } catch (error) {
      console.error("Error fetching latest books:", error);
    }
  };

  return (
    <>
      <HeadingText fullName="All Books" bgName="ALL BOOKS" />

      <div className="container mx-auto px-4 mt-14">
        {/* <div className="flex items-center mb-4">
          <div className="mr-4">
            <label
              htmlFor="availability-filter"
              className="mr-2 text-lg font-semibold"
            >
              Filter by Availability:
            </label>
            <select
              id="availability-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="all">All</option>
              <option value="sell">Sell</option>
              <option value="rent">Rent</option>
              <option value="donation">Donation</option>
            </select>
          </div>

          <div>
            <label htmlFor="price-sort" className="mr-2 text-lg font-semibold">
              Sort by Price:
            </label>
            <select
              id="price-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="default">Select</option>
              <option value="asc">Lowest to Highest</option>
              <option value="desc">Highest to Lowest</option>
            </select>
          </div>
        </div> */}

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

export default AllBooks;
