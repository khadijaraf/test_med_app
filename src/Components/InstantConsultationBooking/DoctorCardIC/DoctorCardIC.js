import React, { useState } from 'react';
import AppointmentForm from '../../AppointmentForm/AppointmentForm';
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
    const [appointmentDetails, setAppointmentDetails] = useState(null);

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
        const authToken = sessionStorage.getItem('auth-token');
        
        if (!authToken) {
            alert('Please login to book an appointment');
            return;
        }
        
        setIsBookingModalOpen(true);
    };

    const handleAppointmentSubmit = (formData) => {
        // Store appointment details
        setAppointmentDetails(formData);
        setAppointmentBooked(true);
        setIsBookingModalOpen(false);
        
        // You can add API call here to save appointment to backend
        console.log('Appointment booked:', formData);
    };

    const handleCancelAppointment = () => {
        setAppointmentBooked(false);
        setAppointmentDetails(null);
    };

    const closeModal = () => {
        setIsBookingModalOpen(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                            <p className="booking-status">✅ Appointment Booked!</p>
                            <div className="appointment-details">
                                <p><strong>Patient:</strong> {appointmentDetails.name}</p>
                                <p><strong>Phone:</strong> {appointmentDetails.phoneNumber}</p>
                                <p><strong>Date:</strong> {formatDate(appointmentDetails.appointmentDate)}</p>
                                <p><strong>Time:</strong> {appointmentDetails.timeSlot}</p>
                            </div>
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

            {/* Booking Modal with AppointmentForm */}
            {isBookingModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <button className="close-modal" onClick={closeModal}>✕</button>
                        </div>
                        
                        <AppointmentForm
                            doctorName={name}
                            doctorSpeciality={speciality}
                            doctorExperience={experience}
                            doctorRating={ratings}
                            onSubmit={handleAppointmentSubmit}
                            onCancel={closeModal}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default DoctorCardIC;