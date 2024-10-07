import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { capitalizeFirstLetter } from "../components/utils/Capitalise";

export const searchBooks = async (searchTerm) => {
  if (!searchTerm.trim()) return [];

  const booksRef = collection(db, "approvedBooks");
  const books = new Set();

  const originalTerm = searchTerm.trim();
  const lowerCaseTerm = originalTerm.toLowerCase();
  const upperCaseTerm = capitalizeFirstLetter(originalTerm);

  const yearPattern = /^\d{4}$/;
  const isYear = yearPattern.test(originalTerm);

  console.log(isYear, originalTerm);

  let allQueries = [];

  if (isYear) {
    const yearQuery = query(booksRef, where("publishYear", ">=", originalTerm));
    allQueries.push(yearQuery);
  } else {
    const titleQueries = [
      query(
        booksRef,
        where("title", ">=", upperCaseTerm),
        where("title", "<=", upperCaseTerm + "\uf8ff")
      ),
      query(
        booksRef,
        where("title", ">=", lowerCaseTerm),
        where("title", "<=", lowerCaseTerm + "\uf8ff")
      ),
    ];

    const authorQueries = [
      query(
        booksRef,
        where("author", ">=", upperCaseTerm),
        where("author", "<=", upperCaseTerm + "\uf8ff")
      ),
      query(
        booksRef,
        where("author", ">=", lowerCaseTerm),
        where("author", "<=", lowerCaseTerm + "\uf8ff")
      ),
    ];

    const languageQueries = [
      query(
        booksRef,
        where("language", ">=", upperCaseTerm),
        where("language", "<=", upperCaseTerm + "\uf8ff")
      ),
      query(
        booksRef,
        where("language", ">=", lowerCaseTerm),
        where("language", "<=", lowerCaseTerm + "\uf8ff")
      ),
    ];

    allQueries = [...titleQueries, ...authorQueries, ...languageQueries];
  }

  const queryPromises = allQueries.map((q) => getDocs(q));
  const querySnapshots = await Promise.all(queryPromises);

  querySnapshots.forEach((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      books.add(JSON.stringify({ id: doc.id, ...doc.data() }));
    });
  });

  const uniqueBooks = Array.from(books).map((book) => JSON.parse(book));

  console.log("Search results:", uniqueBooks);
  return uniqueBooks;
};
