import React, { useState } from 'react';
import './ReviewForm.css';

const ReviewForm = ({ doctorData }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [submittedReviews, setSubmittedReviews] = useState(new Set());
  const [showWarning, setShowWarning] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    review: '',
    rating: 0
  });

  // Sample doctor data - replace with props or API data
  const doctors = doctorData || [
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
    }
  ];

  // Function to handle feedback button click
  const handleFeedbackClick = (doctor) => {
    // Check if review already submitted for this doctor
    if (submittedReviews.has(doctor.id)) {
      return; // Button should be disabled, but this is extra safety
    }
    
    setSelectedDoctor(doctor);
    setShowFeedbackForm(true);
    setShowWarning(false);
    setFormData({
      name: '',
      review: '',
      rating: 0
    });
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to handle star rating selection
  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating: rating
    }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    if (!formData.name || !formData.review || formData.rating === 0) {
      setShowWarning(true);
      return;
    }

    // Process the review submission
    console.log('Review submitted:', {
      doctor: selectedDoctor,
      reviewData: formData
    });

    // Add doctor to submitted reviews set
    setSubmittedReviews(prev => new Set([...prev, selectedDoctor.id]));
    
    // Reset form and close modal
    setShowFeedbackForm(false);
    setSelectedDoctor(null);
    setFormData({
      name: '',
      review: '',
      rating: 0
    });
    setShowWarning(false);
    
    alert('Thank you for your feedback!');
  };

  // Function to close feedback form
  const handleCloseFeedbackForm = () => {
    setShowFeedbackForm(false);
    setSelectedDoctor(null);
    setFormData({
      name: '',
      review: '',
      rating: 0
    });
    setShowWarning(false);
  };

  return (
    <div className="review-form-container">
      <div className="reviews-header">
        <h1>Reviews</h1>
        <p>Click here to view the sample <a href="#" className="sample-link">Reviews page</a></p>
      </div>

      <div className="reviews-table">
        <table>
          <thead>
            <tr>
              <th>Serial Number</th>
              <th>Doctor Name</th>
              <th>Doctor Specialty</th>
              <th>Provide feedback</th>
              <th>Review Given</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => {
              const hasReview = submittedReviews.has(doctor.id);
              return (
                <tr key={doctor.id}>
                  <td>{doctor.serialNumber}</td>
                  <td>{doctor.name}</td>
                  <td>{doctor.specialty}</td>
                  <td>
                    <button 
                      className={`feedback-btn ${hasReview ? 'disabled' : ''}`}
                      onClick={() => handleFeedbackClick(doctor)}
                      disabled={hasReview}
                    >
                      Click Here
                    </button>
                  </td>
                  <td>
                    <div className={`review-status-box ${hasReview ? 'reviewed' : 'pending'}`}>
                      {hasReview ? '✓' : ''}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Feedback Modal */}
      {showFeedbackForm && selectedDoctor && (
        <div className="feedback-modal-overlay">
          <div className="feedback-modal">
            <div className="modal-header">
              <h2>Give Your Review</h2>
              <button 
                className="close-btn"
                onClick={handleCloseFeedbackForm}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="feedback-form">
              {/* Display warning message if not all fields are filled */}
              {showWarning && (
                <div className="warning-message">
                  Please fill out all fields and provide a rating.
                </div>
              )}

              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="review">Review:</label>
                <textarea
                  id="review"
                  name="review"
                  value={formData.review}
                  onChange={handleChange}
                  placeholder="Share your experience with the doctor..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Rating:</label>
                <div className="rating-container">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${formData.rating >= star ? 'active' : ''}`}
                      onClick={() => handleRatingChange(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-buttons">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;