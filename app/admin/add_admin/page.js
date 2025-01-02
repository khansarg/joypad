'use client'; 

import React, { useState } from 'react';
import Header_admin from '@/app/header_admin';
import "../../../styles/add_admin.css";
import { useRouter } from 'next/router';

const fetchAvailableRooms = async (startDateTime, endDateTime) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `https://joypadjourney-be-production.up.railway.app/api/reservations/available-rooms?startDateTime=${startDateTime}&endDateTime=${endDateTime}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch available rooms");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching available rooms:", error.message);
    alert("Error fetching available rooms: " + error.message);
    return [];
  }
};

const createReservation = async (reservation) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("https://joypadjourney-be-production.up.railway.app/api/reservations/reservations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservation),
    });

    if (!response.ok) {
      throw new Error("Failed to create reservation");
    }

    const data = await response.json();
    alert("Reservation created successfully!");
    return data;
  } catch (error) {
    console.error("Error creating reservation:", error.message);
    alert("Error creating reservation: " + error.message);
    return null;
  }
};

const confirmPayment = async (reservationID) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("https://joypadjourney-be-production.up.railway.app/api/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reservationID }),
    });

    if (!response.ok) {
      throw new Error("Failed to confirm payment");
    }

    const data = await response.json();
    alert(data.message);
  } catch (error) {
    console.error("Error confirming payment:", error.message);
    alert("Error confirming payment: " + error.message);
  }
};

const ReservationList = () => {
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [showTimePopup, setShowTimePopup] = useState(false);
  const [showRoomPopup, setShowRoomPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);

  const [reservations, setReservations] = useState([
    {
      id: "--",
      date: "--",
      time: "--",
      room: "--",
      payment: "--",
    },
  ]);

  const isTableComplete = reservations.every(
    (reservation) =>
      reservation.id &&
      reservation.date &&
      reservation.time &&
      reservation.room &&
      reservation.payment
  );

  const handleAddReservation = async () => {
    setShowSuccess(true);
    setTimeout(() => {
        window.location.href = "/admin/home_admin"; 
    }, 2000);
  };

  const handleHeaderClick = async (header) => {
    if (header === 'Date') {
      setShowCalendarPopup(true);
    } else if (header === 'Time') {
      setShowTimePopup(true);
    } else if (header === 'Room') {
      handleRoomPopup();
    } else if (header === 'Payment') {
      const lastReservation = reservations[reservations.length - 1];
      const { date, time, room } = lastReservation;

      if (date === '--' || time === '--' || room === '--') {
        alert("Please complete Date, Time, and Room before confirming Payment.");
        return;
      }

      const [fromTime, untilTime] = time.split(" - ");
      const startDateTime = `${date}T${fromTime}:00`;
      const endDateTime = `${date}T${untilTime}:00`;
      
      try {
        // Create reservation
        const reservation = { room, startDateTime, endDateTime };
        const result = await createReservation(reservation);

        if (result) {
          // Confirm payment
          await confirmPayment(result.reservationID);

          // Update local state
          setReservations((prev) =>
            prev.map((r, i) =>
              i === prev.length - 1
                ? { ...r, id: result.reservationID, payment: "PAID" }
                : r
            )
          );

          alert("Reservation and payment completed successfully!");
        }
      } catch (error) {
        console.error("Error processing payment:", error.message);
        alert("Error processing payment: " + error.message);
      }
    }
  };

  const handleRoomPopup = async () => {
    const lastReservation = reservations[reservations.length - 1];
    const { date, time } = lastReservation;
    const [fromTime, untilTime] = time.split(" - ");
    const startDateTime = `${date}T${fromTime}:00`;
    const endDateTime = `${date}T${untilTime}:00`;

    const rooms = await fetchAvailableRooms(startDateTime, endDateTime);
    setAvailableRooms(rooms);
    setShowRoomPopup(true);
  };

  const handleRoomSelection = (room) => {
    setReservations((prev) => {
      const lastReservation = { ...prev[prev.length - 1], room };
      return [...prev.slice(0, -1), lastReservation];
    });
    setShowRoomPopup(false);
  };

  const handleDateSelection = (date) => {
    setReservations((prev) => {
      const lastReservation = { ...prev[prev.length - 1], date };
      return [...prev.slice(0, -1), lastReservation];
    });
    setShowCalendarPopup(false);
  };

  const handleTimeSelection = (from, until) => {
    const isMinuteValid = (time) => {
        const [, minute] = time.split(':');
        return minute === '00'; // Validasi menit
    };

    if (!isMinuteValid(from) || !isMinuteValid(until)) {
        alert("Both start and end times must have minutes set to 00. Please correct your input.");
        return;
    }

    if (from >= until) {
        alert("Start time must be earlier than end time. Please correct your input.");
        return;
    }

    setReservations((prev) => {
        const lastReservation = { ...prev[prev.length - 1], time: `${from} - ${until}` };
        return [...prev.slice(0, -1), lastReservation];
    });
    setShowTimePopup(false);
};

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header_admin />
      </div>
      <div className="flex justify-center pt-[100px]">
        <main className="w-full max-w-7xl px-4">
          <div className="card-style">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-black">Daftar Reservasi</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-[20px] text-white bg-[#A98EB2]" >
                  <a href="/admin/home_admin"> Cancel </a>
                </button>
                <button
                  onClick={handleAddReservation}
                  disabled={!isTableComplete}
                  className={`px-4 py-2 rounded-[20px] text-white ${
                    isTableComplete
                      ? "bg-[#A98EB2]"
                      : "bg-purple-200 cursor-not-allowed"
                  }`}
                >
                  Add
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-900">
                    <th className="pb-4 text-gray-900">Reservation ID</th>
                    <th
                      onClick={() => handleHeaderClick('Date')}
                      className="pb-4 cursor-pointer text-black-600 hover:underline"
                    >
                      Date
                    </th>
                    <th
                      onClick={() => handleHeaderClick('Time')}
                      className="pb-4 cursor-pointer text-black-600 hover:underline"
                    >
                      Time
                    </th>
                    <th
                      onClick={() => handleHeaderClick('Room')}
                      className="pb-4 cursor-pointer text-black-600 hover:underline"
                    >
                      Room
                    </th>
                    <th
                      onClick={() => handleHeaderClick('Payment')}
                      className="pb-4 cursor-pointer text-black-600 hover:underline"
                    >
                      Payment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="text-gray-700">
                      <td className="py-2">{reservation.id}</td>
                      <td className="py-2">{reservation.date}</td>
                      <td className="py-2">{reservation.time}</td>
                      <td className="py-2">{reservation.room}</td>
                      <td className="py-2">{reservation.payment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      {showCalendarPopup && (
        <CalendarPopup
          onSelectDate={handleDateSelection}
          onClose={() => setShowCalendarPopup(false)}
        />
      )}
      {showTimePopup && (
        <TimePopup
          onSelectTime={handleTimeSelection}
          onClose={() => setShowTimePopup(false)}
        />
      )}
      {showRoomPopup && (
        <RoomPopup
          availableRooms={availableRooms}
          onSelectRoom={handleRoomSelection}
          onClose={() => setShowRoomPopup(false)}
        />
      )}
      {showSuccess && (
        <PaymentSuccessModal onClose={() => (window.location.href = "/admin/home_admin")} />
      )}
    </div>
  );
};

const RoomPopup = ({ availableRooms, onSelectRoom, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[400px] max-w-[90%]">
      <h2 className="text-xl font-semibold mb-4 text-black">Select Room</h2>
      <div className="flex flex-col gap-2">
        {availableRooms.length > 0 ? (
          availableRooms.map((room, index) => (
            <button
              key={index}
              onClick={() => onSelectRoom(room.roomName)}
              className="px-4 py-2 rounded-[20px] bg-[#A98EB2] text-white"
            >
              {room.roomName}
            </button>
          ))
        ) : (
          <p className="text-gray-500">No rooms available for the selected time.</p>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <button onClick={onClose} className="px-4 py-2 rounded-[20px] text-white bg-[#A98EB2]">
          Close
        </button>
      </div>
    </div>
  </div>
);

const CalendarPopup = ({ onSelectDate, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[400px] max-w-[90%]">
      <h2 className="text-xl font-semibold mb-4 text-black">Select Date</h2>
      <input
        type="date"
        onChange={(e) => onSelectDate(e.target.value)}
        className="w-full p-2 border rounded-[10px] text-black"
      />
      <div className="flex justify-end mt-4">
        <button onClick={onClose} className="px-4 py-2 rounded-[20px] text-white bg-[#A98EB2]">
          Close
        </button>
      </div>
    </div>
  </div>
);

const TimePopup = ({ onSelectTime, onClose }) => {
  const [fromTime, setFromTime] = useState('');
  const [untilTime, setUntilTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateAndConfirm = () => {
      const isMinuteValid = (time) => {
          const [, minute] = time.split(':');
          return minute === '00'; // Validasi menit
      };

      if (!isMinuteValid(fromTime) || !isMinuteValid(untilTime)) {
          setErrorMessage("Both start and end times must have minutes set to 00.");
          return;
      }

      if (fromTime >= untilTime) {
          setErrorMessage("Start time must be earlier than end time.");
          return;
      }

      onSelectTime(fromTime, untilTime);
      onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-[400px] max-w-[90%]">
            <h2 className="text-xl font-semibold mb-4 text-black">Select Time</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-black-700 mb-1">From</label>
                <input
                    type="time"
                    value={fromTime}
                    onChange={(e) => setFromTime(e.target.value)}
                    className="w-full p-2 border rounded-[10px] text-black"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-black-700 mb-1">Until</label>
                <input
                    type="time"
                    value={untilTime}
                    onChange={(e) => setUntilTime(e.target.value)}
                    className="w-full p-2 border rounded-[10px] text-black"
                />
            </div>
            {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
            <div className="flex justify-end gap-2">
                <button
                    onClick={validateAndConfirm}
                    className="px-4 py-2 rounded-[20px] text-white bg-[#A98EB2]"
                >
                    Confirm
                </button>
                <button onClick={onClose} className="px-4 py-2 rounded-[20px] text-white bg-[#A98EB2]">
                    Close
                </button>
            </div>
        </div>
    </div>
);
};

const PaymentSuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[500px] max-w-[90%]">
      <h2 className="text-xl font-semibold mb-4 text-black">Reservation Successful!</h2>
      <p className="mb-4">You will be redirected to the homepage shortly.</p>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-[20px] text-white bg-[#A98EB2]"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default ReservationList;
