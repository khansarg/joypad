"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../../styles/login.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login button clicked");
    setError(null); // Reset error sebelum login
  
    if (!username || !password) {
      alert("Please fill in both fields");
      return;
    }
  
    // Tentukan apakah input adalah email atau username
    const isInputEmail = /\S+@\S+\.\S+/.test(username);
  
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [isInputEmail ? "email" : "username"]: username,
          password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
  
        // Simpan token di localStorage
        localStorage.setItem("token", data.token);
  
        // Redirect berdasarkan role
        if (data.role === "Customer") {
          router.push("/customer/homepage"); // Halaman homepage customer
        } else if (data.role === "Admin") {
          router.push("/admin/homepage"); // Halaman homepage admin
        } else {
          setError("Unknown role.");
        }
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: "Login failed. Please try again." };
        }
        setError(errorData.message || "Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      {/* Logo */}
      <div className="logo-container">
        <img src='/image/Journey 2.png' alt="Logo" className="logo" />
      </div>

      {/* Login Form */}
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-input"
          placeholder="Username or Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <button type="submit" className="login-button">
          Log In
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>

      {/* Register Link */}
      <p className="register-link">
        Doesn’t have any account yet?{" "}
        <a href="/register">Register</a>
      </p>
    </div>
  );
}
