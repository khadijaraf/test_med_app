import React, { useState } from 'react';
import ReviewForm from '../ReviewForm/ReviewForm';
import './Reviews.css';

const Reviews = () => {
  const [activeTab, setActiveTab] = useState('give-review');

  // Sample doctor data - this would come from your API/backend
  const doctorData = [
    {
      id: 1,
      serialNumber: 1,
      name: 'Dr. John Doe',
      specialty: 'Cardiology'
    },
    {
      id: 2,
      serialNumber: 2,
      name: 'Dr. Jane Smith',
      specialty: 'Dermatology'
    },
    {
      id: 3,
      serialNumber: 3,
      name: 'Dr. Michael Johnson',
      specialty: 'Orthopedics'
    }
  ];

  // Sample existing reviews - this would come from your API/backend
  const existingReviews = [
    {
      id: 1,
      doctorName: 'Dr. Sarah Wilson',
      specialty: 'Pediatrics',
      patientName: 'John M.',
      rating: 5,
      review: 'Excellent doctor! Very caring and professional. Highly recommend.',
      date: '2024-01-15'
    },
    {
      id: 2,
      doctorName: 'Dr. Robert Brown',
      specialty: 'Neurology',
      patientName: 'Mary K.',
      rating: 4,
      review: 'Great experience. Doctor was very knowledgeable and explained everything clearly.',
      date: '2024-01-10'
    }
  ];

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="reviews-page">
      <div className="reviews-container">
        <h1>Reviews & Feedback</h1>
        
        <div className="reviews-tabs">
          <button 
            className={`tab-btn ${activeTab === 'give-review' ? 'active' : ''}`}
            onClick={() => setActiveTab('give-review')}
          >
            Give Review
          </button>
          <button 
            className={`tab-btn ${activeTab === 'view-reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('view-reviews')}
          >
            View Reviews
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'give-review' && (
            <div className="give-review-section">
              <p className="section-description">
                Share your experience with the doctors you've consulted. Your feedback helps other patients and improves our services.
              </p>
              <ReviewForm doctorData={doctorData} />
            </div>
          )}

          {activeTab === 'view-reviews' && (
            <div className="view-reviews-section">
              <p className="section-description">
                Read what other patients have to say about our doctors and services.
              </p>
              
              <div className="reviews-grid">
                {existingReviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="doctor-info">
                        <h3>{review.doctorName}</h3>
                        <p className="specialty">{review.specialty}</p>
                      </div>
                      <div className="rating">
                        <span className="stars">{renderStars(review.rating)}</span>
                        <span className="rating-number">({review.rating}/5)</span>
                      </div>
                    </div>
                    <div className="review-content">
                      <p>"{review.review}"</p>
                    </div>
                    <div className="review-footer">
                      <span className="patient-name">- {review.patientName}</span>
                      <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;