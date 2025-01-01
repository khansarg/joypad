"use client";
import "../../../styles/bookingformpromo.css";
import React from "react";
import Header from "../../header"; 
import { useState, useEffect } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";

const BookingForm = () => {
  const [roomDetails, setRoomDetails] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [reservationID, setReservationID] = useState(0);
  const [total, setTotal] = useState(0);
  const [roomName, setRoomName] = useState("");
  const [durationInHours, setDurationInHours] = useState(null);
  const router = useRouter(); // Inisialisasi router

  const handleNext = () => {
    router.push("/pembayaranpromo"); // Navigasi ke halaman pembayaran
  };
  useEffect(() => {
    const room = localStorage.getItem("roomName");
    const startDateTime = localStorage.getItem("startDateTime");
    const endDateTime = localStorage.getItem("endDateTime");

    if (room) setRoomName(room);

    if (startDateTime && endDateTime) {
      const startDate = startDateTime.split("T")[0]; // Ambil tanggal
      const startTime = startDateTime.split("T")[1]; // Ambil waktu mulai
      const endTime = endDateTime.split("T")[1]; // Ambil waktu selesai
      setDate(startDate);
      setTime(`${startTime} - ${endTime}`);
      const duration = calculateDuration(startDateTime, endDateTime);
      setDurationInHours(duration);
    }
    const fetchRoomDetails = async () => {
      try { 
        console.log("Fetching room details for:", roomName);
        const token = localStorage.getItem("token"); // Ambil token dari localStorage
        if (!token) {
          throw new Error("No access token found. Please log in.");
        }
    
        const response = await fetch(`https://joypadjourney-be-production.up.railway.app/api/reservations/room-details?roomName=${room}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan token JWT di header Authorization
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch room details");

        const data = await response.json();
        setRoomDetails(data);

        // Kirim data ke backend untuk menghitung harga
        const requestBody = {
          room: room,
          startDateTime: startDateTime,
          endDateTime: endDateTime,
        };

        const priceResponse = await fetch("https://joypadjourney-be-production.up.railway.app/api/reservations/reservations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (!priceResponse.ok) throw new Error("Failed to calculate price");

        const priceData = await priceResponse.json();
        setSubtotal(priceData.subtotal);
        setDiscount(priceData.discount);
        setTotal(priceData.total);
        setReservationID(priceData.reservationID);
      } catch (err) {
        console.error("Error fetching room details:", err);
      }
    };

    fetchRoomDetails();
  }, []);
  const calculateDuration = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
  
    // Hitung selisih waktu dalam milidetik
    const durationInMilliseconds = endTime - startTime;
  
    // Konversi ke jam
    const durationInHours = durationInMilliseconds / (1000 * 60 * 60);
  
    return durationInHours;
  };

  if (!roomDetails) return <div>Loading...</div>;
  return (
    <div>
      <Header />
      <div className="body">
        <div className="formContainer">
          <h1 className="formTitle">Booking Form</h1>
          <div className="formRow">
            <span className="label">Room</span>
            <span className="separator">:</span>
            <span className="value">{roomDetails.roomName} Room</span>
            <span className="extra">Rp. {roomDetails.pricePerHour.toLocaleString("id-ID")}</span>
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
            <span className="value">{durationInHours ? `${durationInHours} hour(s)` : "N/A"}</span>
            <span className="extra">{durationInHours ? `(x${durationInHours})` : ""}</span>
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
            <span className="extra">Rp. {discount.toLocaleString("id-ID")}</span>
          </div>
          <div className="formRow">
            <span className="labeltot">TOTAL</span>
            <span className="separatortot">:</span>
            <span className="valuetot">Rp. {total.toLocaleString("id-ID")}</span>
          </div>
          <div className="buttonGroup">
            <button className="customButton" onClick={async () => {
    try {
      const token = localStorage.getItem("token"); // Ambil token dari localStorage
      if (!token) {
        throw new Error("No access token found. Please log in.");
      }

      // Hapus reservasi di backend
      const response = await fetch(`https://joypadjourney-be-production.up.railway.app/api/reservations/reservations/${reservationID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete reservation");

      // Hapus data dari localStorage
      localStorage.removeItem("reservationID");
      localStorage.removeItem("subtotal");
      localStorage.removeItem("discount");
      localStorage.removeItem("total");
      localStorage.removeItem("date");
      localStorage.removeItem("time");
      localStorage.removeItem("duration");
      localStorage.removeItem("startDateTime");
      localStorage.removeItem("endDateTime");
      localStorage.removeItem("roomName");
      localStorage.removeItem("room");

      // Kembali ke halaman homepage
      window.location.href = "/customer/homepage";
    } catch (err) {
      console.error("Error deleting reservation:", err);
    }
  }}>BACK</button>
            <button className="customButton" onClick={() => {
                handleNext();
                // Simpan data ke localStorage
                localStorage.setItem("reservationID", reservationID); // Ganti dengan ID yang sesuai
                localStorage.setItem("room", roomDetails.roomName);
                localStorage.setItem("date", date);
                localStorage.setItem("time", time);
                localStorage.setItem("duration", durationInHours);
                localStorage.setItem("subtotal", subtotal);
                localStorage.setItem("discount", discount);
                localStorage.setItem("total", total);
                localStorage.setItem("pricePerHour", roomDetails.pricePerHour);

                // Arahkan ke halaman pembayaran
                
            }}>NEXT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
