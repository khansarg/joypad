'use client';
import React, { useState, useEffect } from 'react';
import "../../../styles/home_admin.css";
import Header_admin from '@/app/header_admin';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[400px] max-w-[90%] text-[#374151]">
        <h2 className="text-xl font-semibold mb-4">
          Are you sure you want to delete this reservation?
        </h2>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[20px] bg-gray-200"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-[20px] text-white bg-pink-400"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

const ExtendModal = ({ reservation, onClose, onConfirm }) => {
  const [untilTime, setUntilTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!untilTime) {
      setErrorMessage('Please select a valid time.');
      return;
    }

    try {
      await onConfirm(untilTime);
      setShowSuccess(true);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-[500px] max-w-[90%] text-[#374151]">
          <h2 className="text-xl font-semibold mb-4">Extension Successful!</h2>
          <p className="mb-4">The reservation has been extended successfully.</p>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-[20px] text-white bg-pink-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[500px] max-w-[90%] text-[#374151]">
        <h2 className="text-xl font-semibold mb-4">Extend Reservation Time</h2>
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
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

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://joypadjourney-be-production.up.railway.app/api/admin/viewReservations", {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDeleteClick = (id) => {
    setReservationToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (reservationToDelete) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://joypadjourney-be-production.up.railway.app/api/reservations/reservations/${reservationToDelete}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete reservation");
        }

        setReservations((prev) =>
          prev.filter((reservation) => reservation.reservationID !== reservationToDelete)
        );

        setIsDeleteModalOpen(false);
        setReservationToDelete(null);
      } catch (error) {
        console.error("Error deleting reservation:", error.message);
        alert("Failed to delete reservation: " + error.message);
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setReservationToDelete(null);
  };

  const handleExtendClick = (reservation) => {
    const currentTime = new Date();
    const reservationStartTime = new Date(reservation.startDateTime);
    const reservationEndTime = new Date(reservation.endDateTime);

    const extendDeadline = new Date(reservationEndTime.getTime() - 35 * 60 * 1000);

    if (currentTime < reservationStartTime || currentTime > extendDeadline || reservation.status !== "PAID") {
      alert(
        "You can only extend your reservation within the valid time range: after it starts and up to 30 minutes before it ends."
      );
      return;
    }

    setSelectedReservation(reservation);
    setShowExtendModal(true);
  };

  const handleExtendConfirm = async (untilTime) => {
    if (selectedReservation) {
      const token = localStorage.getItem("token");
      const newEnd = `${selectedReservation.startDateTime.split('T')[0]}T${untilTime}:00`;

      try {
        const response = await fetch(
          `https://joypadjourney-be-production.up.railway.app/api/admin/reservations/${selectedReservation.reservationID}/extend`,
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

  if (loading) return <div>Loading reservations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header_admin />
      </div>
      <div className="flex justify-center pt-20">
        <main className="w-full max-w-7xl px-4">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Daftar Reservasi</h2>
            <button className="px-4 py-2 rounded-[20px] text-white">
              <a href="/admin/add_admin">+ Tambah Reservasi</a>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left">Reservation ID</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Time</th>
                  <th className="p-4 text-left">Room</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left"></th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.reservationID}>
                    <td className="p-4">{reservation.reservationID}</td>
                    <td className="p-4">{new Date(reservation.startDateTime).toLocaleDateString()}</td>
                    <td className="p-4">
                      {new Date(reservation.startDateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} -
                      {new Date(reservation.endDateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4">{reservation.room.roomName}</td>
                    <td className="p-4">{reservation.status}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDeleteClick(reservation.reservationID)}
                        className="mr-2 p-2 hover:bg-gray-100 rounded-full"
                      >
                        🗑️
                      </button>
                      <button
                        onClick={() => handleExtendClick(reservation)}
                        className="px-4 py-2 rounded-[20px] text-white bg-pink-400"
                      >
                        Extend
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      {showExtendModal && selectedReservation && (
        <ExtendModal
          reservation={selectedReservation}
          onClose={() => setShowExtendModal(false)}
          onConfirm={handleExtendConfirm}
        />
      )}
    </div>
  );
};

export default ReservationList;
