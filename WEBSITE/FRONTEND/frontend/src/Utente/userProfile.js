import React, { useState, useEffect } from "react";
import axiosInstance from "../Config/axiosConfig"; // Importa l'istanza configurata
import { jwtDecode } from "jwt-decode"; // Importa jwtDecode
import { useNavigate } from "react-router-dom"; // Importa useNavigate per la navigazione
import './userProfile.css'; // Importa il CSS di stile

function UserProfile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook per la navigazione

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem("jwtToken"); // Rimuove il token dal localStorage ed eseguo il vero logout
    window.location.href = "/login"; // Reindirizza alla login
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (token) {
          const decoded = jwtDecode(token); // Decodifica il token JWT
          const userId = decoded.userId; // Assumi che l'ID utente sia memorizzato come userId nel token

          const response = await axiosInstance.get(`/api/users/${userId}`);
          setUser(response.data); // Imposta i dati dell'utente nello stato
        }
      } catch (error) {
        console.error("Errore nel recupero del profilo utente", error);
        setError("Errore nel recupero del profilo utente. Riprova.");
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!user) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className="user-profile-container">
      <h2>Profilo Utente</h2>
      <div className="user-profile-details">
        <p><strong>Nome:</strong> {user.nome}</p>
        <p><strong>Cognome:</strong> {user.cognome}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <button 
          className="edit-profile-button" 
          onClick={() =>  window.location.href = `/updateUser/${user._id}`} //errore path di destinazione
        >
          Modifica Profilo
        </button>
        <form onSubmit={handleLogout} style={{ marginTop: "10px" }}>
          <button type="submit" className="logout-button">Logout</button>
        </form>
        {/* Aggiungi altre informazioni dell'utente qui */}
      </div>
    </div>
  );
}

export default UserProfile;