"use client";

import React, { useState, useEffect } from "react";
import "../styles/header.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [username, setUsername] = useState("Guest");
  const pathname = usePathname();

  const toggleDropdown = () => {
    console.log("Dropdown toggled"); // Debugging
    setDropdownVisible(!dropdownVisible);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("http://localhost:8080/api/user/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            console.log("User data:", userData);
            setUsername(userData.username);
            localStorage.setItem("username", userData.username)
          } else {
            console.error("Failed to fetch user profile");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // Function to determine if a link is active
  const isLinkActive = (path) => {
    return pathname === path;
  };

  return (
    <header>
      <div className="navbar">
        <div className="logo">
          <img src="/image/Journey 1.png" alt="Logo Website" />
        </div>
        <nav>
          <ul>
            <li>
              <Link 
                href="/customer/homepage" 
                className={`nav-link ${isLinkActive('/customer/homepage') ? 'active' : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/myreservation" 
                className={`nav-link ${isLinkActive('/myreservation') ? 'active' : ''}`}
              >
                My Reservation
              </Link>
            </li>
            <li>
              <Link 
                href="/review" 
                className={`nav-link ${isLinkActive('/review') ? 'active' : ''}`}
              >
                Review
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <nav>
        <ul>
          <div className="profile-container">
            <div className="profile">
              <img
                className="profile-circle"
                src="/image/user.png"
                alt="Profile Picture"
              />
            </div>
          </div>
          <div className="user-profile">
            <li>
              <a className="username" id="username" onClick={toggleDropdown}>
                {username}
              </a>
              <div
                className={`dropdown-content ${
                  dropdownVisible ? "visible" : ""
                }`}
              >
               
                <a href="/" onClick={handleLogout}>Log Out</a>
              </div>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Header;