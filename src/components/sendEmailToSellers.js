import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase.config";
import emailjs from "emailjs-com";


export const sendEmailToSellers = (order) => {
  const sellerIds = [
    ...new Set(order.product_details.map((book) => book.sellerId)),
  ];

  sellerIds.forEach(async (sellerId) => {
    try {
      const sellerRef = doc(db, "users", sellerId);
      const sellerDoc = await getDoc(sellerRef);

      if (sellerDoc.exists()) {
        const sellerEmail = sellerDoc.data().email;
        const sellerName = sellerDoc.data().name;
        const message = `
            Hello ${sellerName},
  
            You have received a new book purchase request from ${
              order.customerInfo.name
            }.
  
            Buyer Details:
            - Name: ${order.customerInfo.name}
            - Email: ${order.customerInfo.email}
            - Phone: ${order.customerInfo.phone}
  
            Order Details:
            Order ID: ${order.purchaseOrderId}
            Items:
            ${order.product_details
              .map(
                (item) =>
                  `- ${item.name} (Qty: ${item.quantity}) - ₹${item.total_price}`
              )
              .join("\n")}
  
  
            Thank you for using our service!
          `;

        const templateParams = {
          subject: "Book Request",
          message,
          to_email: sellerEmail, 
        };

        emailjs
          .send(
            "service_8qw2ss9", 
            "template_a2wix1p", 
            templateParams,
            "BAmZcO0uauyoISeH0" 
          )
          .then((response) => {
            console.log("Email sent successfully to:", sellerEmail);
          })
          .catch((error) => {
            console.error("Failed to send email:", error);
          });
      } else {
        console.error(`No seller found for ID: ${sellerId}`);
      }
    } catch (error) {
      console.error("Error fetching seller info:", error);
    }
  });
};
