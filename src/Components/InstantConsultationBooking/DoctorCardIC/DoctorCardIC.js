import React, { useState } from 'react';
import './DoctorCardIC.css';

const DoctorCardIC = ({ 
    name, 
    speciality, 
    experience, 
    ratings, 
    profilePic,
    location,
    consultationFee,
    availableToday 
}) => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [appointmentBooked, setAppointmentBooked] = useState(false);
    const [formData, setFormData] = useState({
        patientName: '',
        phoneNumber: ''
    });

    // Generate star rating
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(<span key={i} className="star filled">★</span>);
        }
        
        if (hasHalfStar) {
            stars.push(<span key="half" className="star half">★</span>);
        }
        
        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
        }
        
        return stars;
    };

    const handleBooking = () => {
        // Check if user is logged in
        const authToken = sessionStorage.getItem('auth-token') || localStorage.getItem('auth-token');
        
        if (!authToken) {
            alert('Please login to book an appointment');
            return;
        }
        
        setIsBookingModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.patientName.trim() || !formData.phoneNumber.trim()) {
            alert('Please fill in all fields');
            return;
        }
        
        if (formData.phoneNumber.length < 10) {
            alert('Please enter a valid phone number');
            return;
        }
        
        // Simulate booking
        setAppointmentBooked(true);
        setIsBookingModalOpen(false);
    };

    const handleCancelAppointment = () => {
        setAppointmentBooked(false);
        setFormData({ patientName: '', phoneNumber: '' });
    };

    const closeModal = () => {
        setIsBookingModalOpen(false);
    };

    return (
        <>
            <div className="doctor-card">
                <div className="doctor-image">
                    <img 
                        src={profilePic || '/api/placeholder/120/120'} 
                        alt={`Dr. ${name}`}
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=120`;
                        }}
                    />
                </div>
                
                <div className="doctor-info">
                    <h3 className="doctor-name">Dr. {name}</h3>
                    <p className="doctor-speciality">{speciality}</p>
                    <p className="doctor-experience">{experience} years experience</p>
                    
                    <div className="doctor-rating">
                        <span className="rating-label">Ratings: </span>
                        <div className="stars">
                            {renderStars(ratings || 4.5)}
                        </div>
                        <span className="rating-number">({ratings || 4.5})</span>
                    </div>
                    
                    {location && (
                        <p className="doctor-location">📍 {location}</p>
                    )}
                    
                    {consultationFee && (
                        <p className="consultation-fee">💰 ₹{consultationFee} consultation fee</p>
                    )}
                    
                    {availableToday && (
                        <p className="availability">🟢 Available Today</p>
                    )}
                </div>
                
                <div className="doctor-actions">
                    {!appointmentBooked ? (
                        <button 
                            className="book-now-btn"
                            onClick={handleBooking}
                        >
                            Book Now
                        </button>
                    ) : (
                        <div className="appointment-booked">
                            <p className="booking-status">Appointment Booked!</p>
                            <p className="patient-name">Name: {formData.patientName}</p>
                            <p className="patient-phone">Phone Number: {formData.phoneNumber}</p>
                            <button 
                                className="cancel-appointment-btn"
                                onClick={handleCancelAppointment}
                            >
                                Cancel Appointment
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            {isBookingModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Book Appointment</h3>
                            <button className="close-modal" onClick={closeModal}>✕</button>
                        </div>
                        
                        <div className="modal-doctor-info">
                            <img 
                                src={profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=80`} 
                                alt={`Dr. ${name}`}
                                className="modal-doctor-image"
                            />
                            <div>
                                <h4>Dr. {name}</h4>
                                <p>{speciality}</p>
                                <p>{experience} years experience</p>
                                <div className="modal-rating">
                                    {renderStars(ratings || 4.5)}
                                </div>
                            </div>
                        </div>
                        
                        <form onSubmit={handleFormSubmit} className="booking-form">
                            <div className="form-group">
                                <label htmlFor="patientName">Name:</label>
                                <input
                                    type="text"
                                    id="patientName"
                                    name="patientName"
                                    value={formData.patientName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone Number:</label>
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                    required
                                    minLength="10"
                                />
                            </div>
                            
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="confirm-booking-btn">
                                    Book Now
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default DoctorCardIC;