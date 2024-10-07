import React, { useEffect, useState } from "react";
import { fetchLatestDonatedBooks } from "../hooks/FetchLatestDonatedBooks";
import DonaterCard from "./DonaterCard";

function DonationSection() {
  const [donationData, setDonationData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLatestDonatedBooks();
      setDonationData(data);
    };

    fetchData();
  }, []);

  return (
    <div className="mt-10 container mx-auto mb-16">
      {donationData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {donationData.map((donation, index) => (
            <DonaterCard
              key={index}
              book={donation.book}
              seller={donation.seller}
            />
          ))}
        </div>
      ) : (
        <p className="text-center mt-4">No recent donations found.</p>
      )}
    </div>
  );
}

export default DonationSection;
