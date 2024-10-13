import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../../../config/firebase.config";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const notificationsRef = collection(db, "notification");
      const q = query(
        notificationsRef,
        where("sellerId", "==", user.uid),
        orderBy("timestamp", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(newNotifications);
        setNotifications(newNotifications);
        setUnreadCount(newNotifications.filter((n) => !n.read).length);
      });

      return () => unsubscribe();
    }
  }, []);

  const togglePanel = () => setIsOpen(!isOpen);

  const markAsRead = (notificationId) => {
    // Implement the logic to mark a notification as read in Firestore
  };

  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    return "Unknown date";
  };

  return (
    <div className="relative">
      <button
        onClick={togglePanel}
        className="text-white hover:text-gray-200 focus:outline-none"
      >
        <FontAwesomeIcon icon={faBell} className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
          <div className="py-2">
            {notifications.length === 0 ? (
              <div className="px-4 py-2 text-gray-500">
                No new notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-2 hover:bg-gray-100 ${
                    notification.read ? "bg-gray-50" : "bg-white"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <p className="text-sm text-gray-800">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(notification.timestamp)}
                  </p>
                  {notification.status && (
                    <p
                      className={`text-xs mt-1 ${
                        notification.status === "declined"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      Status: {notification.status}
                    </p>
                  )}
                  {notification.feedback && (
                    <p className="text-xs text-gray-600 mt-1">
                      Feedback: {notification.feedback}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
