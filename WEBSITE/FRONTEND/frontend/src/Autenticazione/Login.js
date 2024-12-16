import React, { useState } from "react";
import axiosInstance from "../Config/axiosConfig"; // Importa l'istanza configurata
import './Login.css'; // Importa il CSS del login

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Resetta gli errori

    try {
      const response = await axiosInstance.post("api/users/login", {
        email,
        password,
      });

      const token = response.data.token;
      const userid = response.data.idutente;
      localStorage.setItem("jwtToken", token); // Salva il token nel localStorage
      localStorage.setItem("user", userid); // Salva i dettagli dell'utente nel localStorage
      window.location.href = "/user/:id"; // Reindirizza alla dashboard
    } catch (error) {
      console.error("Errore di autenticazione", error);
      setError("Credenziali non valide. Riprova."); // Mostra un messaggio di errore
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;