import React, { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import Auth from "./components/Auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./config/firebase.config";
import { useAuth } from "./components/context/AuthContext";
import { getDoc, doc, collection } from "firebase/firestore";
import Loader from "./components/loader/loader";
import AddBook from "./components/AddBook";
import AllBooks from "./pages/AllBooks";
import GotoTop from "./components/GoToTop";
import BuyPage from "./pages/BuyPage";
import RentPage from "./pages/RentPage";
import AdminLayout from "./components/admin/layout/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import ViewApprovedBooks from "./components/admin/ViewApprovedBooks";
import PendingApproval from "./components/admin/PendingApproval";
import ViewDeclinedBooks from "./components/admin/ViewDeclinedBooks";
import BookDesc from "./components/BookDesc";
import SearchPage from "./components/SearchPage";
import useResetScrollPosition from "./hooks/useResetScrollPosition";
import Footer from "./components/Footer";

const App = () => {
  const { updatedUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { pathname } = location;

  useResetScrollPosition(location);
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
    <>
      {!pathname.includes("/admin") && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/allbooks" element={<AllBooks />} />
        <Route path="/sellbooks" element={<BuyPage />} />
        <Route path="/rentbook" element={<RentPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/addbook" element={<AddBook />} />
        <Route path="/book/:id" element={<BookDesc />} />
        <Route path="/search" element={<SearchPage />} />

        <Route element={<AdminLayout />}>
          <Route path="/admin/home" element={<AdminDashboard />} />
          <Route path="/admin/toapprove" element={<PendingApproval />} />
          <Route path="/admin/approvedbooks" element={<ViewApprovedBooks />} />
          <Route path="/admin/declineddbooks" element={<ViewDeclinedBooks />} />
        </Route>
      </Routes>
      <Footer/>
      <GotoTop />
    </>
  );
};

export default App;
