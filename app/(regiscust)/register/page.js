"use client"; // Menandai file ini sebagai komponen klien

import React, { useState } from "react";
import Header from "../../header";
import Footer  from "../../footer";
import Link from 'next/link';
import "../../../styles/register.css"
import { useRouter } from "next/navigation";


export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/customer/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
          phoneNum,
          firstName,
          lastName,
        }),
      });

      if (response.ok) {
        setSuccess("Registration successful! Redirecting to login...");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setPhoneNum("");
        setFirstName("");
        setLastName("");
        // Redirect ke halaman login
        setTimeout(() => {
          router.push("/login");
        }, 2000); // Tambahkan delay 2 detik untuk menampilkan pesan sukses
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };
  return (
    <div className="signup-container">
      <div className="logo-container">
        <img src='/image/Journey 1.png' alt="Logo" className="logo" />
      </div>

      <div className="form-container">
        <h1>Create Your Account</h1>

        <form className="signup-form" onSubmit={handleSubmit}>
        <input
            type="text"
            className="form-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            className="form-input"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Phone Number"
            value={phoneNum}
            onChange={(e) => setPhoneNum(e.target.value)}
          />
          <input
            type="email"
            className="form-input"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={togglePasswordVisibility}
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  showPassword
                    ? "/structure/View_duotone_line.svg"
                    : "/structure/View_hide_light.svg"
                }
                alt="Toggle Password Visibility"
                style={{ width: "20px", height: "20px" }}
              />
            </span>
          </div>
          <div className="password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="form-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={toggleConfirmPasswordVisibility}
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  showConfirmPassword
                    ? "/structure/View_duotone_line.svg"
                    : "/structure/View_hide_light.svg"
                }
                alt="Toggle Confirm Password Visibility"
                style={{ width: "20px", height: "20px" }}
              />
            </span>
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <p>
          Already have an account? <a href="login">Login here</a>
        </p>
      </div>
    </div>
  );
}