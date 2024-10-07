import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
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
