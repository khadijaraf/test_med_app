import React, { useEffect, useState } from 'react';
import './InstantConsultation.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FindDoctorSearchIC from './FindDoctorSearchIC/FindDoctorSearchIC';
import DoctorCardIC from './DoctorCardIC/DoctorCardIC';

const InstantConsultation = () => {
    const [searchParams] = useSearchParams();
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const getDoctorsDetails = () => {
        setLoading(true);
        setError('');
        
        fetch('https://api.npoint.io/9a5543d36f1460da2f63')
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch doctors data');
            }
            return res.json();
        })
        .then(data => {
            console.log('Doctors data loaded:', data);
            setDoctors(data);
            
            // Check if there's a speciality in search params
            const speciality = searchParams.get('speciality');
            if (speciality) {
                const filtered = data.filter(doctor => 
                    doctor.speciality.toLowerCase() === speciality.toLowerCase()
                );
                setFilteredDoctors(filtered);
                setIsSearched(true);
            } else {
                setFilteredDoctors([]);
                setIsSearched(false);
            }
        })
        .catch(err => {
            console.error('Error fetching doctors:', err);
            setError('Failed to load doctors. Please try again.');
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const handleSearch = (searchText) => {
        if (searchText === '') {
            setFilteredDoctors([]);
            setIsSearched(false);
        } else {
            const filtered = doctors.filter(
                (doctor) =>
                    doctor.speciality.toLowerCase().includes(searchText.toLowerCase()) ||
                    doctor.name.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredDoctors(filtered);
            setIsSearched(true);
        }
    };

    useEffect(() => {
        getDoctorsDetails();
        
        // Optional: Check authentication
        // const authtoken = sessionStorage.getItem("auth-token") || localStorage.getItem("auth-token");
        // if (!authtoken) {
        //     navigate("/login");
        // }
    }, [searchParams]);

    if (loading) {
        return (
            <div className="searchpage-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading doctors...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="searchpage-container">
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button onClick={getDoctorsDetails} className="retry-btn">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="searchpage-container">
            <div className="search-header">
                <h1>Find Doctors</h1>
                <p>Search for doctors by speciality and book instant consultations</p>
            </div>
            
            <FindDoctorSearchIC onSearch={handleSearch} />
            
            <div className="search-results-container">
                {isSearched ? (
                    <div className="results-section">
                        <div className="results-header">
                            <h2>
                                {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} 
                                {filteredDoctors.length > 0 ? ' available' : ' found'}
                                {searchParams.get('location') && ` in ${searchParams.get('location')}`}
                            </h2>
                            {filteredDoctors.length > 0 && (
                                <p>Book appointments with minimum wait-time & verified doctor details</p>
                            )}
                        </div>
                        
                        <div className="doctors-grid">
                            {filteredDoctors.length > 0 ? (
                                filteredDoctors.map(doctor => (
                                    <DoctorCardIC 
                                        className="doctorcard" 
                                        {...doctor} 
                                        key={doctor.name} 
                                    />
                                ))
                            ) : (
                                <div className="no-results">
                                    <p>No doctors found for your search.</p>
                                    <p>Try searching for a different speciality or check spelling.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="no-search-state">
                        <div className="popular-specialities">
                            <h3>Popular Specialities</h3>
                            <div className="speciality-buttons">
                                <button onClick={() => handleSearch('General Physician')} className="speciality-btn">
                                    General Physician
                                </button>
                                <button onClick={() => handleSearch('Cardiologist')} className="speciality-btn">
                                    Cardiologist
                                </button>
                                <button onClick={() => handleSearch('Dermatologist')} className="speciality-btn">
                                    Dermatologist
                                </button>
                                <button onClick={() => handleSearch('Pediatrician')} className="speciality-btn">
                                    Pediatrician
                                </button>
                                <button onClick={() => handleSearch('Gynecologist')} className="speciality-btn">
                                    Gynecologist
                                </button>
                                <button onClick={() => handleSearch('Orthopedic')} className="speciality-btn">
                                    Orthopedic
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstantConsultation;