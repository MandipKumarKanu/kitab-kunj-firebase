import React, { useEffect, useState } from "react";
import { fetchLatestDonatedBooks } from "../hooks/FetchLatestDonatedBooks";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DonorCard from "./DonaterCard";

function DonationSection() {
  const [donationData, setDonationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLatestDonatedBooks();
      setDonationData(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="mt-10 container mx-auto mb-16">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <div className="bg-white rounded-xl shadow-lg flex max-w-md w-full max-h-52 mx-auto">
                <div className="w-1/2 bg-blue-100 rounded-l-xl flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full">
                    <Skeleton circle={true} height={96} width={96} />
                  </div>
                </div>

                <div className="w-1/2 p-6 flex flex-col justify-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    <Skeleton width={100} />
                  </h2>
                  <p className="text-gray-600">
                    <Skeleton width={80} />
                  </p>
                  <p className="text-sm text-gray-500 mt-2 font-semibold">
                    <Skeleton width={150} />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : donationData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {donationData.map((donation, index) => (
            <DonorCard
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
