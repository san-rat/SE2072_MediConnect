import React from 'react';

function ProfilePage({ user }) {
  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      <img src={user.avatar || '/default-profile.svg'} alt="Profile" className="profile-icon" />
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      {/* Add more user details as needed */}
    </div>
  );
}

export default ProfilePage;