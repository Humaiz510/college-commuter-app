// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users', error);
  }
};

export const addUser = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  } catch (error) {
    console.error('Error adding user', error);
  }
};

export const updateUserProfile = async (email, profileData) => {
    try {
      const response = await axios.put(`${API_URL}/users/${email}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

export const fetchMatches = async (email) => {
    try {
      const response = await axios.get(`${API_URL}/match/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching matches', error);
    }
  };