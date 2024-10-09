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

export const toggleWishlist = async (userId, bookId) => {
  try {
    const userRef = doc(db, "users", userId);

    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();

    if (userData.wishlist.includes(bookId)) {
      await updateDoc(userRef, {
        wishlist: arrayRemove(bookId),
      });
      console.log("Book removed from wishlist");
    } else {
      await updateDoc(userRef, {
        wishlist: arrayUnion(bookId),
      });
      console.log("Book added to wishlist");
    }
  } catch (error) {
    console.error("Error updating wishlist: ", error);
  }
};

export const fetchWishlistStatus = async (userId, bookId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const wishlist = userSnap.data().wishlist || [];
      return wishlist.includes(bookId);
    } else {
      console.log("User not found");
      return false;
    }
  } catch (error) {
    console.error("Error fetching wishlist status:", error);
    return false;
  }
};

export const fetchWishlistBooks = async (userId, setWishlistBooks) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const { wishlist } = userDoc.data();

      const validBookIds = wishlist?.filter((bookId) => bookId) || [];

      if (validBookIds.length > 0) {
        await fetchBooksInWishlist(validBookIds, setWishlistBooks);
      } else {
        console.log("No valid books in wishlist");
        setWishlistBooks([]);
      }
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error);
  }
};

const fetchBooksInWishlist = async (bookIds, setWishlistBooks) => {
  try {
    const booksRef = collection(db, "approvedBooks");

    if (bookIds.length > 0) {
      const q = query(booksRef, where(documentId(), "in", bookIds));
      const querySnapshot = await getDocs(q);

      const wishlistBooks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setWishlistBooks(wishlistBooks);
    }
  } catch (error) {
    console.error("Error fetching books in wishlist:", error);
  }
};
