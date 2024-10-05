import React from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import HomeSearch from "./components/HomeSearch";
import CateCards from "./components/CateCards";
import Category from "./components/Category";
import HeadingText from "./components/Heading";

const App = () => {
  return (
    <div className="pb-96">
      <Navbar />
      <LandingPage />
      <HomeSearch />
      <Category />
      <HeadingText />
    </div>
  );
};

export default App;
