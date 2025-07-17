import React, { useState } from 'react';
import './AppointmentForm.css';

const AppointmentForm = ({ doctorName, doctorSpeciality, doctorExperience, doctorRating, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        appointmentDate: '',
        timeSlot: ''
    });
    
    const [errors, setErrors] = useState({});

    // Available time slots
    const timeSlots = [
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
        '05:00 PM', '05:30 PM'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSlotSelection = (slot) => {
        setFormData(prev => ({
            ...prev,
            timeSlot: slot
        }));
        
        // Clear time slot error
        if (errors.timeSlot) {
            setErrors(prev => ({
                ...prev,
                timeSlot: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (formData.phoneNumber.length < 10) {
            newErrors.phoneNumber = 'Phone number must be at least 10 digits';
        }
        
        if (!formData.appointmentDate) {
            newErrors.appointmentDate = 'Appointment date is required';
        } else {
            const selectedDate = new Date(formData.appointmentDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                newErrors.appointmentDate = 'Please select a future date';
            }
        }
        
        if (!formData.timeSlot) {
            newErrors.timeSlot = 'Please select a time slot';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

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

    return (
        <div className="appointment-form-container">
            <div className="appointment-form-header">
                <h2>Book Appointment</h2>
                <div className="doctor-info-header">
                    <h3>Dr. {doctorName}</h3>
                    <p className="doctor-speciality">{doctorSpeciality}</p>
                    <p className="doctor-experience">{doctorExperience} years experience</p>
                    <div className="doctor-rating">
                        <span>Ratings: </span>
                        <div className="stars">
                            {renderStars(doctorRating || 4.5)}
                        </div>
                        <span className="rating-number">({doctorRating || 4.5})</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleFormSubmit} className="appointment-form">
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}
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
                        className={errors.phoneNumber ? 'error' : ''}
                    />
                    {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="appointmentDate">Date of Appointment:</label>
                    <input
                        type="date"
                        id="appointmentDate"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleInputChange}
                        min={getMinDate()}
                        className={errors.appointmentDate ? 'error' : ''}
                    />
                    {errors.appointmentDate && <span className="error-message">{errors.appointmentDate}</span>}
                </div>

                <div className="form-group">
                    <label>Book Time Slot:</label>
                    <div className="time-slots">
                        {timeSlots.map((slot, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`time-slot ${formData.timeSlot === slot ? 'selected' : ''}`}
                                onClick={() => handleSlotSelection(slot)}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                    {errors.timeSlot && <span className="error-message">{errors.timeSlot}</span>}
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="book-btn">
                        Book Now
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppointmentForm;