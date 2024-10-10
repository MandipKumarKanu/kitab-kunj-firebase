import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase.config";

export const fetchCartBooks = async (userId, setCartBooks) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const { cart } = userDoc.data();

      const validBookIds = cart?.filter((bookId) => bookId) || [];

      if (validBookIds.length > 0) {
        await fetchBooksInCart(validBookIds, setCartBooks);
      } else {
        console.log("No valid books in cart");
        setCartBooks([]);
      }
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};

const fetchBooksInCart = async (bookIds, setCartBooks) => {
  try {
    const booksRef = collection(db, "approvedBooks");

    if (bookIds.length > 0) {
      const q = query(booksRef, where(documentId(), "in", bookIds));
      const querySnapshot = await getDocs(q);

      const cartBooks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCartBooks(cartBooks);
    }
  } catch (error) {
    console.error("Error fetching books in cart:", error);
  }
};

export const updateCartInFirebase = async (uid, updatedBooks) => {
  try {
    const userRef = doc(db, "users", uid);

    const updatedBookIds = updatedBooks.map((book) => book.id);

    await updateDoc(userRef, {
      cart: updatedBookIds,
    });

    console.log("Cart updated successfully");
  } catch (error) {
    console.error("Error updating cart in Firebase:", error);
    throw error;
  }
};

export const moveToWishlist = async (uid, bookId) => {
  try {
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      cart: arrayRemove(bookId),
      wishlist: arrayUnion(bookId),
    });

    console.log("Book moved to wishlist successfully");
  } catch (error) {
    console.error("Error moving book to wishlist:", error);
    throw error;
  }
};
