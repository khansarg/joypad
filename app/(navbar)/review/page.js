'use client';

import React, { useState, useEffect, useRef } from 'react';
import "../../../styles/review.css";
import Header from "../../header.js";
import Footer from "../../footer.js";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReservationID, setSelectedReservationID] = useState("");
  const [modalRating, setModalRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const modalReviewRef = useRef(""); // Gunakan useRef untuk textarea

  useEffect(() => {
    const fetchReviewsAndReservations = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User is not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const reviewsResponse = await fetch("https://joypadjourney-be-production.up.railway.app/customer/reviews/viewReviews", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);

        const reservationsResponse = await fetch("https://joypadjourney-be-production.up.railway.app/api/customer/reservations/completedAndNotReviewed", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!reservationsResponse.ok) {
          throw new Error("Failed to fetch reservations");
        }

        const reservationsData = await reservationsResponse.json();
        setReservations(reservationsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsAndReservations();
  }, []);

  const handleAddReview = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://joypadjourney-be-production.up.railway.app/customer/reviews/${selectedReservationID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: modalRating,
          comment: modalReviewRef.current, // Ambil nilai langsung dari useRef
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const createdReview = await response.json();
      setReviews((prevReviews) => [...prevReviews, createdReview]);
      setReservations((prevReservations) =>
        prevReservations.filter((r) => r.reservationID !== selectedReservationID)
      );
      setShowReviewModal(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalStars = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalStars / reviews.length).toFixed(1);
  };

  const calculateRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      distribution[review.rating - 1] += 1;
    });
    return distribution.reverse();
  };

  const ReviewModal = () => {
    return (
      showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[500px] max-w-[90%]">
            <h2 className="text-xl font-semibold mb-4">Write a review</h2>

            {errorMessage && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {errorMessage}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Select Reservation
              </label>
              <select
                value={selectedReservationID}
                onChange={(e) => setSelectedReservationID(e.target.value)}
                className="w-full p-2 border rounded-[10px] mb-4"
              >
                <option value="">Select a reservation</option>
                {reservations.map((reservation) => (
                  <option
                    key={reservation.reservationID}
                    value={reservation.reservationID}
                  >
                    {reservation.roomName} - {" "}
                    {new Date(reservation.endDateTime).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setModalRating(star)}
                    className="text-2xl text-yellow-400"
                  >
                    {star <= modalRating ? "★" : "☆"}
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Tell us about your experience..."
                defaultValue="" // Gunakan defaultValue agar tidak memicu re-render
                onChange={(e) => (modalReviewRef.current = e.target.value)} // Simpan nilai langsung di useRef
                className="w-full p-2 border rounded-[10px] h-32"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-[20px] bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReview}
                disabled={!selectedReservationID || modalRating === 0}
                className={`px-4 py-2 rounded-[20px] text-white ${
                  !selectedReservationID || modalRating === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-pink-400"
                }`}
              >
                Submit review
              </button>
            </div>
          </div>
        </div>
      )
    );
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen font-['Poppins'] w-full">
      <Header />
      <div className="max-w-4xl mx-auto p-6 my-14 mt-[150px]">
        <div className="bg-[#EBDFEF] rounded-[24px] p-8 mb-6">
          <h2 className="text-gray-600 text-2xl font-medium mb-6">Rating</h2>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-[3.5rem] font-medium text-gray-600">
              {calculateAverageRating()}
            </span>
            <span className="text-yellow-400 text-2xl">★</span>
          </div>
          <p className="text-gray-500 text-sm mb-8">
            Based on {reviews.length} reviews
          </p>
          <div className="flex flex-col gap-4">
            {calculateRatingDistribution().map((count, index) => (
              <div key={5 - index} className="flex items-center gap-3">
                <div className="flex-none w-[120px]">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < 5 - index ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div
                  className={`flex-grow h-2.5 rounded-full overflow-hidden ${
                    count > 0 ? "bg-gray-300" : "bg-gray-400"
                  }`}
                >
                  <div
                    className={`h-full ${
                      count > 0 ? "bg-pink-300" : ""
                    } rounded-full`}
                    style={{
                      width: `${(count / reviews.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="flex-none w-8 text-right text-gray-500 text-sm">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.reviewid}
              className="bg-[#EBDFEF] rounded-[24px] p-8"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src="image/user.png"
                    alt={review.user?.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-[500] text-[#374151]">
                      {review.user?.username}
                    </h3>
                    <div className="text-[#fbbf24] text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < review.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[#6b7280] text-sm">
                  {new Date(review.tanggal).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-[500] text-[#374151] mb-2">
                {review.comment}
              </h4>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowReviewModal(true)}
          className="fixed bottom-5 right-5 bg-[#F472B6] text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] z-[1000]"
        >
          <span>✎</span>
          Write a review
        </button>

        {showReviewModal && <ReviewModal />}
      </div>
      <Footer />
    </div>
  );
};

export default Review;
