"use client";
import React, { useState } from "react";
import "../../../styles/globals.css";
import Header from "../../header";
import Footer from "../../footer";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar";
// Fungsi untuk generate opsi waktu
function generateTimeOptions() {
  const times = [];
  for (let hour = 10; hour <= 19; hour++) {
    const time = `${hour}:00`;
    times.push(
      <option key={time} value={time}>
        {time}
      </option>
    );
  }
  return times;
}

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimeDropdowns, setShowTimeDropdowns] = useState(false);
  const [fromTime, setFromTime] = useState("");
  const [untilTime, setUntilTime] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  return (
    <div className="home-container">
      {/* Bagian Header */}
      <Header />

      {/* Bagian Reservation */}
      <section id="reservation" className="section">
        <div className="reservation-box">
          <div className="input-group">
            <label>Reservation date</label>
            <button
              className="placeholder"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              {selectedDate ? selectedDate.toDateString() : "Add dates"}
            </button>
            {showCalendar && (
              <div className="calendar-container">
                <Calendar onChange={handleDateChange} value={selectedDate} />
              </div>
            )}
          </div>
          <div className="input-group">
            <label>Reservation time</label>
            <button
              className="placeholder"
              onClick={() => setShowTimeDropdowns(!showTimeDropdowns)}
            >
              Add times
            </button>
            {showTimeDropdowns && (
              <div className="time-dropdown-container">
                <div className="time-input">
                  <label>From</label>
                  <select
                    className="time-dropdown"
                    value={fromTime}
                    onChange={(e) => setFromTime(e.target.value)}
                  >
                    <option value="">Select</option>
                    {generateTimeOptions()}
                  </select>
                </div>
                <div className="time-input">
                  <label>Until</label>
                  <select
                    className="time-dropdown"
                    value={untilTime}
                    onChange={(e) => setUntilTime(e.target.value)}
                  >
                    <option value="">Select</option>
                    {generateTimeOptions()}
                  </select>
                </div>
              </div>
            )}
          </div>
          <button
            id="find"
            className="find-room-button"
            onClick={() => {
              if (!selectedDate || !fromTime || !untilTime) {
                alert("Please select a valid date and time.");
                return;
              }
              if (fromTime >= untilTime){
                alert("Start time cannot be the same or before end time.");
                return;
              }
            
              const startDateTime = `${selectedDate.toLocaleDateString("sv-SE")}T${fromTime}:00`;
              const endDateTime = `${selectedDate.toLocaleDateString("sv-SE")}T${untilTime}:00`;
            
              localStorage.setItem("startDateTime", startDateTime); // Simpan waktu mulai
              localStorage.setItem("endDateTime", endDateTime); // Simpan waktu selesai
            
              console.log("Start DateTime:", startDateTime);
              console.log("End DateTime:", endDateTime);
            
              const query = `?startDateTime=${startDateTime}&endDateTime=${endDateTime}`;
              window.location.href = `/find-room${query}`;
            }}
>
            Find Room
          </button>
        </div>
      </section>

      {/* Bagian Rules */}
      <section id="rules" className="section rules-section">
        <video
          src="/homevid.mp4"
          className="rules-video"
          autoPlay
          loop
          muted
        >
          Your browser does not support the video tag.
        </video>
      </section>

      {/* Bagian Reviews */}
      

      {/* Bagian Footer */}
      <Footer />
    </div>
  );
}
