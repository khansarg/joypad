"use client";
import React, { useState, useEffect } from "react";
import "../../../styles/pembayaranpromo.css";
import Header from "../../header";
const Pembayaran = () => {
  const [reservationID, setReservationID] = useState("");
  const [room, setRoom] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [pricePerHour, setPrice] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    // Ambil data dari localStorage
    setReservationID(localStorage.getItem("reservationID") || "");
    setRoom(localStorage.getItem("room") || "");
    setDate(localStorage.getItem("date") || "");
    setTime(localStorage.getItem("time") || "");
    setDuration(localStorage.getItem("duration") || "");
    setSubtotal(parseFloat(localStorage.getItem("subtotal")) || 0);
    setDiscount(parseFloat(localStorage.getItem("discount")) || 0);
    setTotal(parseFloat(localStorage.getItem("total")) || 0);
    setPrice(parseFloat(localStorage.getItem("pricePerHour")) || 0);
  }, []);
  const handleNext = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      {/* Header */}
      <Header />

      <div className="body">
        <div className="formContainer">
          <h1 className="formTitle">Booking Form</h1>
          <div className="formhead">
            <span>Reservation ID</span>
          </div>
          <div className="formRow">
            <span>{reservationID}</span>
          </div>
          <div className="formhead">
            <span>Your Order</span>
          </div>
          <div className="formRow">
            <span className="label">Room</span>
            <span className="separator">:</span>
            <span className="value">{room} Room</span>
            <span className="extra">Rp. {pricePerHour.toLocaleString("id-ID")}</span>
          </div>
          <div className="formRow">
            <span className="label">Date</span>
            <span className="separator">:</span>
            <span className="value">{date}</span>
          </div>
          <div className="formRow">
            <span className="label">Time</span>
            <span className="separator">:</span>
            <span className="value">{time}</span>
          </div>
          <div className="formRow">
            <span className="label">Duration</span>
            <span className="separator">:</span>
            <span className="value">{duration} hour</span>
            <span className="extra">(X1)</span>
          </div>
          <div className="divider"></div>
          <div className="formRow">
            <span className="label">SUBTOTAL</span>
            <span className="separator">:</span>
            <span className="extra">Rp. {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="formRow">
            <span className="label">Voucher</span>
            <span className="separator">:</span>
            <span className="extra">Rp. -{discount.toLocaleString("id-ID")}</span>
          </div>
          <div className="formRow">
            <span className="labeltot">TOTAL</span>
            <span className="separatortot">:</span>
            <span className="valuetot">Rp. {total.toLocaleString("id-ID")}</span>
          </div>
          <div className="buttonGroup">
            <button className="customButton" onClick={handleNext}>
              Bayar Sekarang
            </button>
          </div>
        </div>

        {/* Popup */}
        {showPopup && (
          <div className="popupOverlay">
            <div className="popup">
              <div className="checkmark">
                <img
                  src="/structure/paymentsuccess.png"
                  alt="Payment"
                  className="payment"
                />
              </div>
              <h2>Payment Successfully!</h2>
              <p>
                <a href="/reservation">Check your reservation</a>
              </p>
              <button className="closeButton" onClick={handleClosePopup}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pembayaran;
