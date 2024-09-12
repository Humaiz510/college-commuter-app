// src/components/MatchResults.js
import React, { useState, useEffect } from 'react';
import { fetchMatches } from '../services/api';
import Chat from './chat';  // Import Chat component

const MatchResults = ({ user }) => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);  // Store selected match information

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchMatches(user.email);  // Fetch matches for the current user
        setMatches(data || []);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    if (user) {
      loadMatches();
    }
  }, [user]);

  const handleSelectMatch = (match) => {
    setSelectedMatch(match);  // Set the selected match's full information
  };

  return (
    <div className="match-results">
      {matches.length > 0 ? (
        <>
          <ul>
            {matches.map((match) => (
              <li key={match.id}>
                <div onClick={() => handleSelectMatch(match)} style={{ cursor: 'pointer' }}>
                  {match.name} - {match.email}
                </div>
                <br />
                Commute Time: {match.commute_time}
                <br />
                Commute Days: {match.commute_days.join(', ')}
                <br />
                Car Available: {match.car_availability ? 'Yes' : 'No'}
                <br />
                <button onClick={() => handleSelectMatch(match)}>
                  Chat with {match.name}
                </button>
              </li>
            ))}
          </ul>

          {/* Ensure Chat is rendered with correct match information */}
          {selectedMatch && (
            <div className="chat-section">
              <h3>Chat with {selectedMatch.name}</h3>  {/* Correctly show selected match's name */}
              <Chat matchId={selectedMatch.id} user={user} />
            </div>
          )}
        </>
      ) : (
        <p>No matches found.</p>
      )}
    </div>
  );
};

export default MatchResults;
