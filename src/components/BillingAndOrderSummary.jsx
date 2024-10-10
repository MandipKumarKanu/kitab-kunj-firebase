import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function BillingAndOrderSummary() {
  const location = useLocation();
  const checkoutData = location.state?.checkoutData;
  const platformFee = checkoutData ? checkoutData.subtotal * 0.1 : 0;
  const totalPayment = checkoutData
    ? checkoutData.subtotal + checkoutData.shippingFee + platformFee
    : 0;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (auth?.currentUser) {
        const userDocRef = doc(db, "users", auth?.currentUser?.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setAddresses(userData.addresses || []);
          if (userData.addresses && userData.addresses.length > 0) {
            setSelectedAddress(
              userData.addresses[checkoutData.selectedAddressIndex || 0]
            );
          }
        }
      }
    };

    fetchAddresses();

    console.log(addresses);
  }, [auth.currentUser, db, checkoutData.selectedAddressIndex]);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsAddressDialogOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 container mx-auto">
      <div className="flex-1 bg-greyColor p-8 rounded-2xl shadow-lg h-fit">
        <div className="flex items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold ">Billing Details</h2>
          <button
            className="text-blue-500 hover:underline text-sm"
            onClick={() => setIsAddressDialogOpen(true)}
          >
            <FontAwesomeIcon icon={faEye} className="mr-1" />
            View All
          </button>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                value={selectedAddress?.firstName || ""}
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={selectedAddress?.lastName || ""}
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={selectedAddress?.streetAddress || ""}
              readOnly
              className="w-full px-4 py-2 bg-transparent border border-black rounded-full focus:outline-none focus:border-primaryColor transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                value="Nepal"
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Province</label>
              <input
                type="text"
                value={selectedAddress?.province || ""}
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Town/City
              </label>
              <input
                type="text"
                value={selectedAddress?.town || ""}
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Landmark</label>
              <input
                type="text"
                value={selectedAddress?.landmark || ""}
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={selectedAddress?.phone || ""}
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={selectedAddress?.email || ""}
                readOnly
                className="w-full bg-transparent border border-black px-4 py-2 rounded-full focus:outline-none focus:border-primaryColor transition"
              />
            </div>
          </div>

          {/* <button
            onClick={() => setIsAddressDialogOpen(true)}
            className="w-full py-2 bg-primaryColor text-white rounded-full"
          >
            Choose Address
          </button> */}
        </div>
      </div>

      <div className="lg:w-1/3">
        <div className="bg-greyColor p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Your Order</h2>
          <div className="space-y-4">
            {checkoutData?.selectedBooks.map((book) => (
              <div key={book.id} className="flex justify-between">
                <div className="w-1/2 flex flex-col">
                  <span
                    className="line-clamp-2 font-semibold"
                    title={book.bookName}
                  >
                    {book.bookName}
                  </span>
                  {book.author}
                </div>

                <div>1x</div>
                <div>Rs. {book.sellingPrice.toFixed(2)}</div>
              </div>
            ))}

            <div className="w-full h-[2px] bg-primaryColor my-4"></div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {checkoutData?.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Rs. {checkoutData?.shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee:</span>
                <span>Rs. {platformFee.toFixed(2)}</span>
              </div>

              <div className="w-full h-[2px] bg-primaryColor my-4"></div>

              <div className="flex justify-between font-semibold">
                <span>Total Payment:</span>
                <span>Rs. {totalPayment.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  className="mr-2"
                  defaultChecked
                  style={{ accentColor: "#531D99" }}
                />
                <span>Direct Credit Transfer</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="payment"
                  className="mr-2"
                  style={{ accentColor: "#531D99" }}
                />
                <span>eSewa</span>
              </label>
            </div>
          </div>
        </div>
        <button className="w-full py-3 mt-8 bg-gradient-to-t from-primaryColor to-secondaryColor rounded-full text-white text-lg font-bold shadow-lg hover:from-primaryColor hover:to-primaryColor transition">
          Place Order
        </button>
      </div>

      {isAddressDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Choose an Address</h3>
            {addresses.map((address, index) => (
              <div
                key={index}
                className="p-2 border rounded mb-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleAddressSelect(address)}
              >
                <p>{`${address.firstName} ${address.lastName} (${address.phone})`}</p>
                <p>{`${address.landmark}, ${address.town}`}</p>
                <p>{address.streetAddress}</p>
              </div>
            ))}
            <button
              onClick={() => setIsAddressDialogOpen(false)}
              className="mt-4 px-4 py-2 bg-primaryColor text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillingAndOrderSummary;
