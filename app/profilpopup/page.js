"use client";
import React, { useState } from "react";
import "../../../styles/cek.css"

const ProfilePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="profile-container">
      {/* Bagian Profil */}
      <button className="profile-button" onClick={togglePopup}>
        <span className="profile-icon">👤</span> Khansarz
      </button>

      {/* Bagian Popup */}
      {isOpen && (
        <div className="popup-menu">
          <ul>
            <li>
              <button>Notifications</button>
            </li>
            <li>
              <button>Account</button>
            </li>
            <li className="logout">
              <button>Log out</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfilePopup;
