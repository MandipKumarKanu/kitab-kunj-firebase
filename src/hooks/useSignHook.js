import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../config/firebase.config";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

export const useSignUpHook = async (data) => {
  console.log("Signup data:", data);

  try {
    const resp = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    if (resp.user.uid) {
      await updateProfile(auth.currentUser, { displayName: data.name });
      const userCollection = collection(db, "users");

      await setDoc(doc(userCollection, resp.user.uid), {
        ...data,
        credit: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
        ordered: 0,
        purchased: 0,
        sold: 0,
        rented: 0,
        donated: 0,
      });
    }
  } catch (err) {
    console.log("Sign-up error:", err);
  }
};

export const useSignInHook = async (data, updatedUser) => {
  try {
    const resp = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    console.log("Sign-in response:", resp);

    if (resp.user.uid) {
      const userDoc = await getDoc(doc(collection(db, "users"), resp.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log(userData);

        updatedUser(userData);
      }
      navigate(-1);
    }
  } catch (err) {
    console.log("Sign-in error:", err);
  }
};

export const useLogoutHook = async (updatedUser) => {
  try {
    await signOut(auth);
    updatedUser(null);
    console.log("User signed out successfully.");
  } catch (err) {
    console.error("Logout error:", err);
  }
};
