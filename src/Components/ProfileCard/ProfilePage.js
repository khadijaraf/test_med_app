import React from "react";
import ProfileCard from "./ProfileCard";
import "./ProfilePage.css";

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <div className="profile-page-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your personal information and account settings</p>
        </div>
        <ProfileCard />
      </div>
    </div>
  );
};

export default ProfilePage;