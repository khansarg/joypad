'use client';

import React, { useState, useEffect } from 'react';
import "../../../styles/review.css";
import Header_admin from '@/app/header_admin';

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token);
            const response = await fetch('https://joypadjourney-be-production.up.railway.app/api/admin/viewReviews', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error text:', errorText);
                throw new Error('Failed to fetch reviews');
            }

            const data = await response.json();
            console.log('Reviews:', data);
            setReviews(data);
            setRatings(calculateRatings(data));
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    fetchReviews();
}, []);


  const calculateRatings = (reviews) => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      distribution[review.rating - 1] += 1;
    });

    return distribution.reverse().map((count, index) => ({
      stars: 5 - index,
      count,
    }));
  };

  const calculateAverageRating = () => {
    const totalStars = ratings.reduce((acc, curr) => acc + curr.stars * curr.count, 0);
    const totalReviews = ratings.reduce((acc, curr) => acc + curr.count, 0);
    return totalReviews > 0 ? (totalStars / totalReviews).toFixed(1) : '0';
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen font-['Poppins'] w-full">
      <Header_admin />
      <div className="max-w-4xl mx-auto p-6 my-14 mt-[150px]">
        {/* Rating Summary Card */}
        <div className="bg-[#EBDFEF] rounded-[24px] p-8 mb-6">
          <h2 className="text-gray-600 text-2xl font-medium mb-6">Rating Summary</h2>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-[3.5rem] font-medium text-gray-600">
              {calculateAverageRating()}
            </span>
            <span className="text-yellow-400 text-2xl">★</span>
          </div>
          <p className="text-gray-500 text-sm mb-8">Based on {reviews.length} reviews</p>

          <div className="flex flex-col gap-4">
            {ratings.map((rating) => (
              <div key={rating.stars} className="flex items-center gap-3">
                <div className="flex-none w-[120px]">
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={`text-lg ${index < rating.stars ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="flex-grow h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-300 rounded-full transition-all duration-300"
                    style={{ width: `${(rating.count / reviews.length) * 100}%` }}
                  />
                </div>
                <span className="flex-none w-8 text-right text-gray-500 text-sm">
                  {rating.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Cards */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.reviewid} className="bg-[#EBDFEF] rounded-[24px] p-8">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/image/user.png"
                    alt={review.user?.username || "Anonymous"}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-[500] text-[#374151]">{review.user?.username || "Anonymous"}</h3>
                    <div className="text-[#fbbf24] text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[#6b7280] text-sm">{new Date(review.tanggal).toLocaleDateString()}</span>
              </div>
              <p className="text-[#4b5563] leading-[1.625]">{review.comment || "No Content Available"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReview;