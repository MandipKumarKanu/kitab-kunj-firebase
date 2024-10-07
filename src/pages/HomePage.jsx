import React from "react";
import LandingPage from "../components/LandingPage";
import HomeSearch from "../components/HomeSearch";
import Category from "../components/Category";
import HeadingText from "../components/Heading";
import FeaturedBook from "../components/FeaturedBook";
import ArrivalBooks from "../components/ArrivalBooks";
import DonationSection from "../components/DonationSection";

function HomePage() {
  return (
    <>
      <LandingPage />
      <HomeSearch />
      <Category />
      <HeadingText fullName="Featured Books" bgName="FEATURED" />
      <FeaturedBook />
      <HeadingText fullName="New Arrival" bgName="New Arrival" />
      <ArrivalBooks />
      <HeadingText fullName="Recent Donors" bgName="Donors" />
      <DonationSection />
    </>
  );
}

export default HomePage;
