// src/components/ProfileForm.js
import React, { useState } from 'react';
import { updateUserProfile } from '../services/api';

const ProfileForm = ({ user }) => {
  const [carAvailability, setCarAvailability] = useState(user.car_availability || false);
  const [commuteTime, setCommuteTime] = useState(user.commute_time || '');
  const [commuteDays, setCommuteDays] = useState(user.commute_days || []);

  // List of predefined commute times
  const commuteTimes = [
    '7:00 AM - 9:00 AM',
    '8:00 AM - 10:00 AM',
    '9:00 AM - 11:00 AM',
    '10:00 AM - 12:00 PM',
    '11:00 AM - 1:00 PM'
  ];

  // List of commute days (checkboxes)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // Toggle day selection for checkboxes
  const handleDayChange = (day) => {
    if (commuteDays.includes(day)) {
      setCommuteDays(commuteDays.filter(d => d !== day));  // Unselect day
    } else {
      setCommuteDays([...commuteDays, day]);  // Select day
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const profileData = {
      car_availability: carAvailability,
      commute_time: commuteTime,
      commute_days: commuteDays,  // This will now be an array
    };

    try {
      await updateUserProfile(user.email, profileData);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <label>
        Car Available:
        <input
          type="checkbox"
          checked={carAvailability}
          onChange={(e) => setCarAvailability(e.target.checked)}
        />
      </label>

      <label>
        Commute Time:
        <select
          value={commuteTime}
          onChange={(e) => setCommuteTime(e.target.value)}
        >
          <option value="">Select commute time</option>
          {commuteTimes.map((time, index) => (
            <option key={index} value={time}>
              {time}
            </option>
          ))}
        </select>
      </label>

      <label>Commute Days:</label>
      <div className="checkbox-group">
        {daysOfWeek.map((day, index) => (
          <label key={index}>
            <input
              type="checkbox"
              value={day}
              checked={commuteDays.includes(day)}
              onChange={() => handleDayChange(day)}
            />
            {day}
          </label>
        ))}
      </div>

      <button type="submit">Update Profile</button>
    </form>
  );
};

export default ProfileForm;
