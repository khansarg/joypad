'use client';

import React, { useState, useEffect } from 'react';
import Header from "../../header.js";
import Footer from "../../footer.js";
import "../../../styles/myreservation.css";

const PaymentSuccessModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#A98EB2] rounded-2xl p-6 w-[400px] h-[250px] max-w-[90%] text-white text-center">
        <div className="flex justify-center mb-4">
          <div className="w-39 h-39 rounded-full border-2 border-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">Payment Successfully!</h2>
        <button
          onClick={onClose}
          className="mt-4 underline text-sm"
        >
          Check your reservation
        </button>
      </div>
    </div>
  );
};

const ExtendModal = ({ reservation, onClose, onConfirm }) => {
  const [untilTime, setUntilTime] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      await onConfirm(untilTime);
      setShowSuccess(true);
    } catch (err) {
      alert(`Failed to extend reservation: ${err.message}`);
    }
  };

  if (showSuccess) {
    return <PaymentSuccessModal onClose={onClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[500px] max-w-[90%] text-[#374151]">
        <h2 className="text-xl font-semibold mb-4">Extend Reservation Time</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Until</label>
          <input
            type="time"
            value={untilTime}
            onChange={(e) => setUntilTime(e.target.value)}
            className="w-full p-2 border rounded-[10px]"
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[20px] bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-[20px] text-white bg-pink-400"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ReservationPage() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://joypadjourney-be-production.up.railway.app/api/customer/reservations", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }

      const data = await response.json();
      setReservations(data);
    } catch (err) {
      console.error("Error fetching reservations:", err.message);
      setError(err.message);
    }
  };

  const handleExtendClick = (reservation) => {
    const currentTime = new Date();
    const reservationStartTime = new Date(reservation.startDateTime);
    const reservationEndTime = new Date(reservation.endDateTime);

    // Waktu maksimal untuk extend (30 menit sebelum akhir reservasi)
    const extendDeadline = new Date(reservationEndTime.getTime() - 35 * 60 * 1000);

    // Validasi waktu
    if (currentTime < reservationStartTime || currentTime > extendDeadline || reservation.status !== "PAID") {
      alert(
        "You can only extend your reservation within the valid time range: after it starts and up to 30 minutes before it ends."
      );
      return;
    }

    // Jika validasi lolos, buka modal
    setSelectedReservation(reservation);
    setShowExtendModal(true);
  };

  const handleExtendConfirm = async (untilTime) => {
    if (selectedReservation) {
      const token = localStorage.getItem("token");
      const newEnd = `${selectedReservation.startDateTime.split('T')[0]}T${untilTime}:00`;
  
      try {
        const response = await fetch(
          `https://joypadjourney-be-production.up.railway.app/api/customer/reservations/${selectedReservation.reservationID}/extend`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              newEnd,
              roomName: selectedReservation.room.roomName,
            }),
          }
        );
  
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }
  
        const updatedReservation = await response.json();
        setReservations((prev) =>
          prev.map((reservation) =>
            reservation.reservationID === updatedReservation.reservationID
              ? {
                  ...reservation,
                  endDateTime: updatedReservation.endDateTime,
                }
              : reservation
          )
        );
        setShowExtendModal(false);
        setSelectedReservation(null);
      } catch (error) {
        alert(`Failed to extend reservation: ${error.message}`);
      }
    }
  };
  
  

  useEffect(() => {
    fetchReservations();
  }, []);

  if (reservations.length === 0) {
    return (
      <>
        <Header />
        <main className="main-card flex justify-center items-center h-screen">
          <h1 className="text-2xl font-bold">No Reservations Found</h1>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main-card">
        <div className="flex justify-center items-center mb-6">
          <h1 className="card-title">YOUR RESERVATIONS</h1>
        </div>

        <div className="reservation-list">
          {reservations.map((reservation) => (
            <div key={reservation.reservationID} className="reservation-grid">
              <div className="grid-item">
                <span className="label">Reservation ID</span>
                <span className="value">{reservation.reservationID}</span>
              </div>
              <div className="grid-item">
                <span className="label">Date</span>
                <span className="value">
                  {new Date(reservation.startDateTime).toLocaleDateString()}
                </span>
              </div>
              <div className="grid-item">
                <span className="label">Time</span>
                <span className="value">
                  {new Date(reservation.startDateTime).toLocaleTimeString()} -{" "}
                  {new Date(reservation.endDateTime).toLocaleTimeString()}
                </span>
              </div>
              <div className="grid-item">
                <span className="label">Room</span>
                <span className="value">{reservation.room.roomName}</span>
              </div>
              <div className="grid-item">
                <span className="label">Status</span>
                <span
                  className={`value ${
                    reservation.status === "PAID"
                      ? "success"
                      : reservation.status === "COMPLETED"
                      ? "completed"
                      : "pending"
                  }`}
                >
                  {reservation.status}
                </span>
              </div>

              <div>
                <button
                  className="Extends-btn"
                  onClick={() => handleExtendClick(reservation)}
                >
                  Extends
                </button>
              </div>
            </div>
          ))}
        </div>

        {showExtendModal && selectedReservation && (
          <ExtendModal
            reservation={selectedReservation}
            onClose={() => setShowExtendModal(false)}
            onConfirm={handleExtendConfirm}
          />
        )}
      </main>
      <Footer />
    </>
  );
}