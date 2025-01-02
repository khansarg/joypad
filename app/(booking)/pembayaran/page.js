"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "../../../styles/pembayaran.css";
import Header from "../../header";
const BookingForm = () => {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const handleNext = () => {
    setShowPopup(true);
    setTimeout(() => {
      router.push("/myreservation");
    }, 2000);
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
            <span>RNEYJ1NOV241</span>
          </div>
          <div className="formhead">
            <span>Your Order</span>
          </div>
          <div className="formRow">
            <span className="label">Room</span>
            <span className="separator">:</span>
            <span className="value">Regular Room</span>
            <span className="extra">Rp. 20.000</span>
          </div>
          <div className="formRow">
            <span className="label">Date</span>
            <span className="separator">:</span>
            <span className="value">01/01/24</span>
          </div>
          <div className="formRow">
            <span className="label">Time</span>
            <span className="separator">:</span>
            <span className="value">10:00-11:00</span>
          </div>
          <div className="formRow">
            <span className="label">Duration</span>
            <span className="separator">:</span>
            <span className="value">1 hour</span>
            <span className="extra">(X1)</span>
          </div>
          <div className="divider"></div>
          <div className="formRow">
            <span className="label">SUBTOTAL</span>
            <span className="separator">:</span>
            <span className="extra">Rp. 20.000</span>
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
                <a href="/myreservation">Check your reservation</a>
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

export default BookingForm;
