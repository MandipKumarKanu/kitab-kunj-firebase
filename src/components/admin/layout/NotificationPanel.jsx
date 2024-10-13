import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../../config/firebase.config";
import ClickOutside from "../../../hooks/ClickOutside";
import { useNavigate } from "react-router-dom";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

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
        setNotifications(newNotifications);
        setUnreadCount(newNotifications.filter((n) => !n.read).length);
      });

      return () => unsubscribe();
    }
  }, []);

  const togglePanel = () => setIsOpen(!isOpen);

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, "notification", notificationId);
      await updateDoc(notificationRef, { read: true });
    } catch (error) {
      console.error("Error marking notification as read: ", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const batch = notifications
        .filter((n) => !n.read)
        .map((n) => doc(db, "notification", n.id));
      batch.forEach(async (notificationRef) => {
        await updateDoc(notificationRef, { read: true });
      });
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read: ", error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    return "Unknown date";
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    if (notification.status === "declined") {
      navigate("/admin/mydeclined", {
        state: { bookId: notification.id },
      });
    } else if (notification.status === "approved") {
      navigate("/admin/myapproved", {
        state: { bookId: notification.id },
      });
    } else if (notification.source === "buy") {
      navigate("/admin/buy-requests");
    }

    setIsOpen(false);
  };

  return (
    <ClickOutside onClick={() => setIsOpen(false)} className="relative">
      <button
        onClick={togglePanel}
        className="text-white relative focus:outline-none transition-transform transform hover:scale-110 duration-200"
      >
        <FontAwesomeIcon icon={faBell} className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 max-h-[550px] overflow-y-auto transition-all transform opacity-100">
          <div className="py-2">
            {notifications.length === 0 ? (
              <div className="px-4 py-2 text-gray-500 text-center">
                No new notifications
              </div>
            ) : (
              <>
                <button
                  className="w-full text-left px-4 py-2 text-blue-600 font-semibold hover:bg-gray-100 transition duration-200"
                  onClick={markAllAsRead}
                >
                  Mark All as Read
                </button>
                <div className="border-b border-gray-200 my-2" />
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex flex-col px-4 py-3 rounded-md hover:bg-gray-100 cursor-pointer transition-all duration-200 ${
                      !notification.read ? "bg-gray-50" : "bg-white"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon={faBell}
                        className={`text-xl ${
                          !notification.read ? "text-blue-600" : "text-gray-400"
                        }`}
                      />
                      <p className="ml-2 text-sm text-gray-800">
                        {notification.message}
                      </p>
                    </div>
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
                    {notification.source === "buy" && (
                      <p className="text-xs text-blue-600 mt-1">Buy Request</p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </ClickOutside>
  );
};

export default NotificationPanel;
