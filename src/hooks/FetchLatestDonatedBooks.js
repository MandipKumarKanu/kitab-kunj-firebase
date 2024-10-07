import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../config/firebase.config";

export const fetchLatestDonatedBooks = async () => {
  try {
    const booksRef = collection(db, "approvedBooks");
    const q = query(
      booksRef,
      where("availability", "==", "donation"),
      orderBy("postedAt", "desc"),
      limit(10)
    );

    const bookSnapshot = await getDocs(q);
    if (bookSnapshot.empty) {
      return [];
    }

    const books = [];
    const uniqueSellers = new Set();

    for (const docs of bookSnapshot.docs) {
      const book = docs.data();
      if (!uniqueSellers.has(book.sellerId)) {
        uniqueSellers.add(book.sellerId);


        const sellerRef = doc(db, "users", book.sellerId);
        const sellerSnapshot = await getDoc(sellerRef);

        if (sellerSnapshot.exists()) {
          const sellerData = sellerSnapshot.data();
          books.push({
            book: { id: doc.id, ...book },
            seller: sellerData,
          });
        }

        if (books.length === 3) break;
      }
    }

    return books;
  } catch (error) {
    console.error("Error fetching latest donated books:", error);
    return [];
  }
};
