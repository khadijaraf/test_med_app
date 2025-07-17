import React, { useState } from 'react';
import './FindDoctorSearchIC.css';

const FindDoctorSearchIC = ({ onSearch }) => {
    const [searchText, setSearchText] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        // Call onSearch as user types for real-time search
        onSearch(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchText);
    };

    const handleClear = () => {
        setSearchText('');
        onSearch('');
    };

    return (
        <div className="find-doctor-search-container">
            <div className="search-wrapper">
                <form onSubmit={handleSubmit} className="search-form">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Search doctors by speciality (e.g., Cardiologist, Dentist, Pediatrician...)"
                            value={searchText}
                            onChange={handleInputChange}
                            className="search-input"
                        />
                        {searchText && (
                            <button 
                                type="button" 
                                onClick={handleClear}
                                className="clear-button"
                                aria-label="Clear search"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <button type="submit" className="search-button">
                        🔍 Search
                    </button>
                </form>
            </div>
            
            <div className="search-suggestions">
                <p>Popular searches:</p>
                <div className="suggestion-tags">
                    <span onClick={() => { setSearchText('General Physician'); onSearch('General Physician'); }}>
                        General Physician
                    </span>
                    <span onClick={() => { setSearchText('Cardiologist'); onSearch('Cardiologist'); }}>
                        Cardiologist
                    </span>
                    <span onClick={() => { setSearchText('Dermatologist'); onSearch('Dermatologist'); }}>
                        Dermatologist
                    </span>
                    <span onClick={() => { setSearchText('Pediatrician'); onSearch('Pediatrician'); }}>
                        Pediatrician
                    </span>
                </div>
            </div>
        </div>
    );
};

export default FindDoctorSearchIC;