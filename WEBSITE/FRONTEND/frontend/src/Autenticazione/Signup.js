import React, { useState } from "react";
import axiosInstance from "../Config/axiosConfig"; // Importa l'istanza configurata
import './Login.css'; // Importa il CSS di stile

function Signup() {
  const [data, setData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (data.password !== data.confirmPassword) {
      setError("Le password non coincidono.");
      return;
    }

    try {
      const response = await axiosInstance.post("api/users/signup", { 
        nome: data.nome,
        cognome: data.cognome,
        email: data.email,
        password: data.password,
      });
      setMessage("Registrazione avvenuta con successo!");
      console.log("Risposta server:", response.data);
    } catch (error) {
      console.error("Errore durante la registrazione", error);
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message.includes("email già esistente")) {
          setError("L'email è già registrata. Utilizza un'altra email.");
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError("Errore durante la registrazione. Riprova.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSignup} className="login-form">
        <h2>Registrazione</h2>
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={data.nome}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cognome"
          placeholder="Cognome"
          value={data.cognome}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Conferma Password"
          value={data.confirmPassword}
          onChange={handleChange}
          required
        />
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <button type="submit">Registrati</button>
      </form>
    </div>
  );
}

export default Signup;