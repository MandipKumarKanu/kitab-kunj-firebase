import {
  addDoc,
  arrayRemove,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase.config";
import { useCart } from "../components/context/CartContext";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoice,
  faHome,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";

const OrderSuccessPage = () => {
  const { setCartLength } = useCart();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const data = location.state?.orderData;
    if (data) {
      setOrderData(data);
      // const ids = data.product_details.map((product) => product.identity);
      // updateListStatus(ids, data);
    }
  }, [location.state]);

  // const updateListStatus = async (ids, currentOrderData) => {
  //   if (!currentOrderData || !currentOrderData.product_details) {
  //     console.error("Invalid orderData:", currentOrderData);
  //     return;
  //   }

  //   const userId = auth.currentUser.uid;
  //   const userRef = doc(db, "users", userId);

  //   // try {
  //   //   const orderPendingRef = collection(db, "pendingOrder");
  //   //   const pendingOrderDoc = await addDoc(orderPendingRef, {
  //   //     ...currentOrderData,
  //   //     purchasedBy: userId,
  //   //     createdAt: new Date(),
  //   //     status: "pending",
  //   //     paymentMethod: "khalti",
  //   //   });

  //   //   console.log("Created pendingOrder document:", pendingOrderDoc.id);

  //   //   for (const id of ids) {
  //   //     try {
  //   //       const bookRef = doc(db, "approvedBooks", id);
  //   //       const bookSnap = await getDoc(bookRef);

  //   //       if (bookSnap.exists()) {
  //   //         const bookData = bookSnap.data();

  //   //         if (bookData.listStatus === true) {
  //   //           // await updateDoc(bookRef, {
  //   //           //   listStatus: false,
  //   //           // });
  //   //           // console.log(`Updated listStatus for book ${id} to false`);

  //   //           // await updateDoc(userRef, {
  //   //           //   cart: arrayRemove(id),
  //   //           // });
  //   //           // console.log(`Removed book ${id} from user's cart`);

  //   //           const productDetail = currentOrderData.product_details.find(
  //   //             (product) => product.identity === id
  //   //           );

  //   //           if (productDetail) {
  //   //             const verifyOrdersRef = collection(db, "verifyOrders");
  //   //             await addDoc(verifyOrdersRef, {
  //   //               customerInfo: currentOrderData.customerInfo,
  //   //               product_detail: productDetail,
  //   //               pendingOrderId: pendingOrderDoc.id,
  //   //               sellerId: productDetail.sellerId,
  //   //             });
  //   //             console.log(`Created verifyOrder document for book ${id}`);
  //   //           }

  //   //           setCartLength((prev) => prev - 1);
  //   //         } else {
  //   //           console.log(
  //   //             `listStatus is already false for book ${id}. No update needed.`
  //   //           );
  //   //         }
  //   //       } else {
  //   //         console.log(`Book ${id} not found in approvedBooks collection.`);
  //   //       }
  //   //     } catch (error) {
  //   //       console.error(`Error processing book ${id}:`, error);
  //   //     }
  //   //   }
  //   // } catch (error) {
  //   //   console.error("Error creating pendingOrder document:", error);
  //   // }
  // };
  // };

  const handlePrint = () => {
    window.print();
  };

  if (!orderData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-greyColor shadow-lg rounded-lg overflow-hidden">
        <div className="print:shadow-none" id="invoice-content">
          <div className="px-6 py-8">
            <div className="flex justify-between items-center border-b-2 border-gray-200 pb-6 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
                <p className="text-sm text-gray-600 mt-1">Order Confirmation</p>
              </div>
              <div className="text-right">
                <img
                  src="/image/logo.png"
                  alt="Kitab Kunj"
                  className="h-12 ml-auto"
                />
                <p className="text-sm font-semibold text-gray-800 mt-2">
                  Kitab Kunj
                </p>
                <p className="text-sm text-gray-600">Nepal</p>
              </div>
            </div>

            {orderData && (
              <>
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      Bill To:
                    </h2>
                    <p className="text-gray-700">
                      {orderData.customerInfo.name}
                    </p>
                    <p className="text-gray-700">
                      {orderData.customerInfo.email}
                    </p>
                    <p className="text-gray-700">
                      {orderData.customerInfo.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="mb-1">
                      <span className="font-semibold text-gray-800">
                        Invoice No:
                      </span>{" "}
                      <span className="text-gray-700">
                        {orderData.purchaseOrderId}
                      </span>
                    </p>
                    <p className="mb-1">
                      <span className="font-semibold text-gray-800">Date:</span>{" "}
                      <span className="text-gray-700">
                        {new Date().toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>

                <table className="w-full mb-8">
                  <thead>
                    <tr className=" text-gray-700">
                      <th className="text-left py-3 px-4 font-semibold">
                        Item
                      </th>
                      <th className="text-center py-3 px-4 font-semibold">
                        Quantity
                      </th>
                      <th className="text-right py-3 px-4 font-semibold">
                        Price
                      </th>
                      <th className="text-right py-3 px-4 font-semibold">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.product_details.map((product, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <img
                              src={product.produc_img}
                              alt={product.name}
                              className="w-16 h-20 object-cover mr-4 rounded"
                            />
                            <span className="font-medium text-gray-800">
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="text-center py-4 px-4 text-gray-700">
                          {product.quantity}
                        </td>
                        <td className="text-right py-4 px-4 text-gray-700">
                          ₹{product.unit_price.toFixed(2)}
                        </td>
                        <td className="text-right py-4 px-4 font-medium text-gray-800">
                          ₹{product.total_price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end">
                  <div className="w-1/2 space-y-3">
                    <div className="flex justify-between border-b border-gray-200 py-2">
                      <span className="font-medium text-gray-800">
                        Subtotal:
                      </span>
                      <span className="text-gray-700">
                        ₹
                        {(
                          orderData.amount -
                          orderData.platformFee -
                          parseFloat(orderData.shippingFee)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 py-2">
                      <span className="font-medium text-gray-800">
                        Platform Fee:
                      </span>
                      <span className="text-gray-700">
                        ₹{orderData.platformFee.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 py-2">
                      <span className="font-medium text-gray-800">
                        Shipping Fee:
                      </span>
                      <span className="text-gray-700">
                        ₹{orderData.shippingFee}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2">
                      <span className="text-gray-800">Total Paid:</span>
                      <span className="text-gray-900">
                        ₹{orderData.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center print:hidden">
          <button
            onClick={handlePrint}
            className="bg-gradient-to-t from-primaryColor to-secondaryColor rounded-3xl text-white text-xl font-bold shadow-lg  py-2 px-4  transition duration-200 flex items-center"
          >
            <FontAwesomeIcon icon={faPrint} className="mr-2" />
            Print Invoice
          </button>
          <div className="space-x-4">
            <Link
              to="/orders"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
              View All Orders
            </Link>
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
