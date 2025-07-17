import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileCard.css";

const ProfileCard = () => {
  // State variables for user details and edit mode
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    email: ""
  });
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  // Fetch user profile data when component mounts
  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token") || localStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/login");
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  // Function to fetch user profile data from session/local storage or API
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError("");
      
      // First try to get data from storage
      const name = sessionStorage.getItem("name") || localStorage.getItem("name");
      const email = sessionStorage.getItem("email") || localStorage.getItem("email");
      const phone = sessionStorage.getItem("phone") || localStorage.getItem("phone");
      
      if (name && email) {
        const userData = {
          name: name,
          email: email,
          phone: phone || ""
        };
        setUserDetails(userData);
        setUpdatedDetails(userData);
        setLoading(false);
      } else {
       
        await fetchFromAPI();
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile data");
      setLoading(false);
    }
  };


  const fetchFromAPI = async () => {
    try {
      const authtoken = sessionStorage.getItem("auth-token") || localStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email") || localStorage.getItem("email");

      if (!authtoken) {
        navigate("/login");
        return;
      }

      // Uncomment and modify this section if you have an API endpoint
      /*
      const response = await fetch(`${API_URL}/api/auth/user`, {
        headers: {
          "Authorization": `Bearer ${authtoken}`,
          "Email": email,
        },
      });
      
      if (response.ok) {
        const user = await response.json();
        setUserDetails(user);
        setUpdatedDetails(user);
      } else {
        throw new Error("Failed to fetch user profile");
      }
      */
      
      // For now, create default user data if no API
      const defaultUser = {
        name: email ? email.split('@')[0] : "User",
        email: email || "",
        phone: ""
      };
      setUserDetails(defaultUser);
      setUpdatedDetails(defaultUser);
      
    } catch (error) {
      console.error("API fetch error:", error);
      setError("Failed to fetch profile from server");
    } finally {
      setLoading(false);
    }
  };

  // Function to enable edit mode
  const handleEdit = () => {
    setEditMode(true);
    setError("");
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    setUpdatedDetails({
      ...updatedDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const authtoken = sessionStorage.getItem("auth-token") || localStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email") || localStorage.getItem("email");

      if (!authtoken || !email) {
        navigate("/login");
        return;
      }

      // Validate required fields
      if (!updatedDetails.name || !updatedDetails.email) {
        setError("Name and email are required");
        return;
      }

      // Update session and local storage
      sessionStorage.setItem("name", updatedDetails.name);
      sessionStorage.setItem("phone", updatedDetails.phone || "");
      localStorage.setItem("name", updatedDetails.name);
      localStorage.setItem("phone", updatedDetails.phone || "");

      // Uncomment this section if you have an API endpoint for updating
      /*
      const payload = { ...updatedDetails };
      const response = await fetch(`${API_URL}/api/auth/user`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${authtoken}`,
          "Content-Type": "application/json",
          "Email": email,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      */

      setUserDetails(updatedDetails);
      setEditMode(false);
      alert("Profile updated successfully!");
      
      // Refresh the page to update navbar
      window.location.reload();
      
    } catch (error) {
      console.error("Update error:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  // Function to cancel edit mode
  const handleCancel = () => {
    setUpdatedDetails(userDetails);
    setEditMode(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="profile-card">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-card">
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
      
      {editMode ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-header">
            <h2>Edit Profile</h2>
            <p>Update your personal information</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="name">
              <span className="label-text">Full Name</span>
              <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={updatedDetails.name || ""}
              onChange={handleInputChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">
              <span className="label-text">Phone Number</span>
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={updatedDetails.phone || ""}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <span className="label-text">Email Address</span>
              <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={userDetails.email}
              disabled
              className="disabled-input"
            />
            <small className="field-note">Email cannot be changed</small>
          </div>

          <div className="button-group">
            <button type="submit" className="save-btn">
              <span className="btn-icon">💾</span>
              Save Changes
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              <span className="btn-icon">❌</span>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-details">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <span className="avatar-text">
                {userDetails.name ? userDetails.name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
          </div>
          
          <div className="profile-header">
            <h2>Profile Information</h2>
            <p>Your account details and personal information</p>
          </div>
          
          <div className="profile-info">
            <div className="info-item">
              <div className="info-label">
                <span className="info-icon">👤</span>
                <span>Full Name</span>
              </div>
              <span className="info-value">{userDetails.name || "Not provided"}</span>
            </div>
            
            <div className="info-item">
              <div className="info-label">
                <span className="info-icon">📞</span>
                <span>Phone Number</span>
              </div>
              <span className="info-value">{userDetails.phone || "Not provided"}</span>
            </div>
            
            <div className="info-item">
              <div className="info-label">
                <span className="info-icon">📧</span>
                <span>Email Address</span>
              </div>
              <span className="info-value">{userDetails.email}</span>
            </div>
          </div>
          
          <div className="action-buttons">
            <button onClick={handleEdit} className="edit-btn">
              <span className="btn-icon">✏️</span>
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;