import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase.config";
import emailjs from "emailjs-com";

const fetchUserDetails = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return {
      email: userDoc.data().email,
      name: userDoc.data().name,
    };
  } else {
    throw new Error(`User not found for ID: ${userId}`);
  }
};

const createHTMLTemplate = (title, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="padding: 40px 30px; background-color: #6D28D9; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">${title}</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 30px; font-size: 16px; color: #333;">
                ${content}
            </td>
        </tr>
        <tr>
            <td style="background-color: #6D28D9; color: #ffffff; text-align: center; padding: 20px;">
                <p style="margin: 0; font-size: 14px;">© ${new Date().getFullYear()} Kitabkunj. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export const sendOrderAcceptedEmailToCustomer = async (order) => {
  try {
    const { email: customerEmail, name: customerName } = await fetchUserDetails(
      order.userId
    );
    const deliveryName = order.customerInfo.name;

    const content = `
      <p style="margin-bottom: 20px;">Hello ${customerName},</p>
      <p style="margin-bottom: 20px;">We're excited to inform you that your order with the ID <span style="font-weight: bold; color: #6D28D9;">${
        order.id
      }</span> has been accepted.</p>
      
      <h2 style="color: #6D28D9; font-size: 20px; margin-bottom: 15px;">Delivery Details</h2>
      <p><strong>Name:</strong> ${deliveryName}</p>
      <p><strong>Address:</strong> ${order.customerInfo.address}</p>
      <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
      
      <h2 style="color: #6D28D9; font-size: 20px; margin-bottom: 15px;">Order Details</h2>
      <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
        <tr style="background-color: #f8f8f8;">
          <th style="text-align: left; border-bottom: 2px solid #6D28D9; color: #6D28D9;">Item</th>
          <th style="text-align: center; border-bottom: 2px solid #6D28D9; color: #6D28D9;">Quantity</th>
          <th style="text-align: right; border-bottom: 2px solid #6D28D9; color: #6D28D9;">Price</th>
        </tr>
        ${order.product_details
          .map(
            (item) => `
          <tr>
            <td style="border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="text-align: center; border-bottom: 1px solid #eee;">${item.quantity}</td>
            <td style="text-align: right; border-bottom: 1px solid #eee;">₹${item.total_price}</td>
          </tr>
        `
          )
          .join("")}
        <tr style="font-weight: bold;">
          <td colspan="2" style="text-align: right;">Total:</td>
          <td style="text-align: right;">₹${order.amount}</td>
        </tr>
      </table>

      <p>Your order will be processed and shipped soon. Thank you for choosing our service!</p>
      <p>Best regards,<br>The Kitabkunj Team</p>
    `;

    const htmlMessage = createHTMLTemplate("Order Accepted", content);

    const templateParams = {
      subject: "Order Accepted",
      message: htmlMessage,
      to_email: customerEmail,
    };

    await emailjs.send(
      "service_8qw2ss9",
      "template_a2wix1p",
      templateParams,
      "BAmZcO0uauyoISeH0"
    );

    console.log("Order accepted email sent to:", customerEmail);
  } catch (error) {
    console.error("Failed to send order accepted email:", error);
  }
};

export const sendOrderRejectedEmailToCustomer = async (order, cancelReason) => {
  try {
    const { email: customerEmail, name: customerName } = await fetchUserDetails(
      order.userId
    );
    const deliveryName = order.customerInfo.name;

    const content = `
      <p style="margin-bottom: 20px;">Hello ${customerName},</p>
      <p style="margin-bottom: 20px;">We're sorry to inform you that your order with the ID <span style="font-weight: bold; color: #6D28D9;">${
        order.id
      }</span> has been rejected.</p>
      
      <h2 style="color: #6D28D9; font-size: 20px; margin-bottom: 15px;">Reason for Rejection</h2>
      <p style="background-color: #f8f8f8; padding: 15px; border-left: 4px solid #6D28D9;">${cancelReason}</p>

      <h2 style="color: #6D28D9; font-size: 20px; margin-bottom: 15px;">Order Details</h2>
      <p><strong>Delivery Name:</strong> ${deliveryName}</p>
      <p><strong>Address:</strong> ${order.customerInfo.address}</p>
      <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>

      <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
        <tr style="background-color: #f8f8f8;">
          <th style="text-align: left; border-bottom: 2px solid #6D28D9; color: #6D28D9;">Item</th>
          <th style="text-align: center; border-bottom: 2px solid #6D28D9; color: #6D28D9;">Quantity</th>
          <th style="text-align: right; border-bottom: 2px solid #6D28D9; color: #6D28D9;">Price</th>
        </tr>
        ${order.product_details
          .map(
            (item) => `
          <tr>
            <td style="border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="text-align: center; border-bottom: 1px solid #eee;">${item.quantity}</td>
            <td style="text-align: right; border-bottom: 1px solid #eee;">₹${item.total_price}</td>
          </tr>
        `
          )
          .join("")}
        <tr style="font-weight: bold;">
          <td colspan="2" style="text-align: right;">Total:</td>
          <td style="text-align: right;">₹${order.amount}</td>
        </tr>
      </table>

      <p>If you have any questions, feel free to reach out to our support team. We apologize for the inconvenience and hope to serve you better next time.</p>
      <p>Best regards,<br>The Kitabkunj Team</p>
    `;

    const htmlMessage = createHTMLTemplate("Order Rejected", content);

    const templateParams = {
      subject: "Order Rejected",
      message: htmlMessage,
      to_email: customerEmail,
    };

    await emailjs.send(
      "service_8qw2ss9",
      "template_a2wix1p",
      templateParams,
      "BAmZcO0uauyoISeH0"
    );

    console.log("Order rejection email sent to:", customerEmail);
  } catch (error) {
    console.error("Failed to send order rejection email:", error);
  }
};
