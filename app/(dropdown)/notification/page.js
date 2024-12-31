'use client';
import React, { useState, useEffect } from "react";
import "../../../styles/notification.css";
import Header from "../../header.js";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username"); // Pastikan username tersedia di localStorage
        console.log(username);
        if (!username) {
          throw new Error("Username not found in localStorage.");
        }

        const response = await fetch(`http://localhost:8080/api/customer/notifications/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch notifications.");
        }

        const data = await response.json();
        setNotifications(
          data.map((message, index) => ({
            id: index + 1,
            text: message,
            date: new Date().toLocaleDateString(), // Tambahkan tanggal sekarang, Anda dapat menggantinya jika backend menyediakan tanggal
            avatar: "/image/user.png", // Default avatar
          }))
        );
      } catch (err) {
        console.error("Error fetching notifications:", err.message);
        setError(err.message);
      }
    };

    fetchNotifications();
  }, []);

  const handleRemoveNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  if (error) {
    return (
      <div>
        <Header />
        <div className="notifications-container">
          <h1>Notifications</h1>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="notifications-container">
        <h1>Notifications</h1>
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-item">
            <img src={notification.avatar} alt="Notification Avatar" />
            <div className="notification-content">
              <p>{notification.text}</p>
              <div className="date">{notification.date}</div>
            </div>
            <div
              className="notification-close"
              onClick={() => handleRemoveNotification(notification.id)}
            >
              &#10006;
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
