// src/components/Login.js
import React from 'react';
import { signInWithGoogle } from '../firebase';
import { addUser } from '../services/api';  // Import the API function

const Login = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      
      // Call the backend to save the user in PostgreSQL
      const userData = {
        name: user.displayName,
        email: user.email
      };
      await addUser(userData);  // This will add the user to the database

      console.log("User logged in:", userData);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <h1>College Commuter App</h1>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
};

export default Login;
