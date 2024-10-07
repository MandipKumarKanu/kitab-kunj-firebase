import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { capitalizeFirstLetter } from "../components/utils/Capitalise";

export const homeSearchBook = async (searchFields) => {
  const { title, author, year } = searchFields;

  console.log(searchFields);

  if (!title && !author && !year) return [];

  const booksRef = collection(db, "approvedBooks");
  const bookPromises = [];

  const capitalizedTitle = capitalizeFirstLetter(title.trim());
  const capitalizedAuthor = capitalizeFirstLetter(author.trim());

  const q = query(
    booksRef,
    where("title", ">=", capitalizedTitle),
    where("title", "<=", capitalizedTitle + "\uf8ff"),
    where("author", ">=", capitalizedAuthor),
    where("author", "<=", capitalizedAuthor + "\uf8ff"),
    where("publishYear", ">=", year),
    where("availability", "!=", "donation")
  );
  bookPromises.push(getDocs(q));

  try {
    const querySnapshots = await Promise.all(bookPromises);
    const books = [];

    querySnapshots.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() });
      });
    });

    return books;
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
};
