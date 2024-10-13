import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../config/firebase.config";
import { Link } from "react-router-dom";

const BuyRequests = () => {
  const [buyRequests, setBuyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuyRequests = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, "buyRequests"),
          where("sellerId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const requests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBuyRequests(requests);
        setLoading(false);
      }
    };

    fetchBuyRequests();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Buy Requests</h1>
      {buyRequests.length === 0 ? (
        <p>You don't have any buy requests at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buyRequests.map((request) => (
            <Link
              to={`/admin/buy-request/${request.id}`}
              key={request.id}
              className="block"
            >
              <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={request.bookCoverImage}
                  alt={request.bookTitle}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">
                    {request.bookTitle}
                  </h2>
                  <p className="text-gray-600 mb-2">
                    Buyer: {request.buyerName}
                  </p>
                  <p className="text-blue-500">Status: Pending</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Requested on:{" "}
                    {new Date(
                      request.requestDate.toDate()
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyRequests;
