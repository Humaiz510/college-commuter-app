// src/App.js
import React from 'react';
import './App.css';
import Login from './components/Login';
import ProfileForm from './components/ProfileForm';
import MatchResults from './components/MatchResults';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from "firebase/messaging";


function App() {
  const [user, setUser] = React.useState(null);

  const auth = getAuth();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = () => {
    signOut(auth);
  };

  // Request permission for notifications
  const requestNotificationPermission = async () => {
    const messaging = getMessaging();
    try {
      const token = await getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY' });
      if (token) {
        console.log("FCM Token:", token);
      } else {
        console.error("No registration token available. Request permission to generate one.");
      }
    } catch (error) {
      console.error("An error occurred while retrieving token. ", error);
    }
  };

  React.useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="App">
      {user ? (
        <>
          <div className="navbar">
            <h1>College Carpool</h1>
            <button onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</button>
          </div>

          <h2>Welcome, {user.displayName}</h2>

          <div className="profile-section">
            <h3>Edit Your Profile</h3>
            <ProfileForm user={user} />
          </div>

          <div className="matches-section">
            <h3>Carpool Matches</h3>
            <MatchResults user={user} />
          </div>
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
