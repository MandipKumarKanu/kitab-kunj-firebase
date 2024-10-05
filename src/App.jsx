import React from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import HomeSearch from "./components/HomeSearch";
import Category from "./components/Category";
import HeadingText from "./components/Heading";
import ArrivalBooks from "./components/ArrivalBooks";

const App = () => {
  return (
    <div className="pb-96">
      <Navbar />
      <LandingPage />
      <HomeSearch />
      <Category />
      <HeadingText fullName="Featured Books" bgName="FEATURED" />
      <HeadingText fullName="New Arrival" bgName="New Arrival" />
      <ArrivalBooks />
    </div>
  );
};

export default App;
