import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTimes } from "@fortawesome/free-solid-svg-icons";
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
import { motion, AnimatePresence } from "framer-motion";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [popupNotification, setPopupNotification] = useState(null);
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

        if (newNotifications.length > 0 && !newNotifications[0].read) {
          setPopupNotification(newNotifications[0]);
          setTimeout(() => {
            setPopupNotification(null);
          }, 5000);
        }
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
    } else {
      navigate("/admin/orderconfirmation", {
        state: { orderId: notification.bookId },
      });
    }

    setIsOpen(false);
  };

  return (
    <>
      <ClickOutside onClick={() => setIsOpen(false)} className="relative">
        <motion.button
          onClick={togglePanel}
          className="text-white relative focus:outline-none transition-transform transform hover:scale-110 duration-200"
          animate={unreadCount > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 5 }}
        >
          <FontAwesomeIcon icon={faBell} className="text-2xl" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-[-0.55rem] right-[-0.65rem] inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
              >
                {unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl overflow-hidden z-20 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center">
                <div className="pt-2 px-4 ">
                  <h2 className="text-lg font-semibold">Notifications</h2>
                </div>

                {unreadCount > 0 && (
                  <button
                    className="text-right px-4 pt-2 text-blue-600 font-semibold hover:bg-gray-100 transition duration-200"
                    onClick={markAllAsRead}
                  >
                    Mark All as Read
                  </button>
                )}
              </div>
              <div className="py-2">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-gray-500 text-center">
                    <FontAwesomeIcon icon={faBell} className="text-4xl mb-2" />
                    <p>No new notifications</p>
                  </div>
                ) : (
                  <>
                    <div className="border-b border-gray-200 my-2" />
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className={`flex flex-col px-4 py-3 hover:bg-gray-100 cursor-pointer transition-all duration-200 ${
                          !notification.read ? "bg-blue-50" : "bg-white"
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-center">
                          <FontAwesomeIcon
                            icon={faBell}
                            className={`text-xl ${
                              !notification.read
                                ? "text-blue-600"
                                : "text-gray-400"
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
                            className={`text-xs mt-1 font-semibold ${
                              notification.status === "declined"
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            Status: {notification.status}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </ClickOutside>

      <AnimatePresence>
        {popupNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 w-80 p-4 bg-white text-gray-800 rounded-lg shadow-lg z-50 border border-gray-300"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">New Notification</p>
              <button
                onClick={() => setPopupNotification(null)}
                className="text-gray-800 focus:outline-none"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="mt-2 text-sm">{popupNotification.message}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationPanel;
