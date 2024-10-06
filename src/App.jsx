import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import Auth from "./components/Auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./config/firebase.config";
import { useAuth } from "./components/context/AuthContext";
import { getDoc, doc, collection } from "firebase/firestore";
import Loader from "./components/loader/loader";
import AddBook from "./components/AddBook";

const App = () => {
  const { updatedUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.uid) {
          const userDoc = await getDoc(doc(collection(db, "users"), user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log(userData);
            updatedUser(userData);
          }
        }
      } else {
        updatedUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <>
        <Loader />
      </>
    );
  }

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/addbook" element={<AddBook />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
