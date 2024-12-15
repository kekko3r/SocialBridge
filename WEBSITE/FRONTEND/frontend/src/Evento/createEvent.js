import React, { useState, useEffect } from "react";
import axiosInstance from "../Config/axiosConfig"; // Importa l'istanza configurata
import { jwtDecode } from "jwt-decode"; // Importa jwtDecode
import './createEvent.css'; // Importa il CSS di stile

function CreateEvent() {
  const [data, setData] = useState({
    titolo: "",
    descrizione: "",
    data: "",
    ora: "",
    luogo: "",
    accessibilita: "",
    partecipantiMAX: "",
    labels: "",
    organizzatoreID: "", // Aggiungi il campo organizzatoreID
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizzatoreID = () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (token) {
          const decoded = jwtDecode(token); // Usa jwtDecode
          console.log(decoded); // Stampa il contenuto del token decodificato
          const userId = decoded.userId; // Assumi che l'ID utente sia memorizzato come userId nel token
          setData((prevData) => ({ ...prevData, organizzatoreID: userId }));
        }
      } catch (error) {
        console.error("Errore nel recupero dell'ID dell'organizzatore", error);
      }
    };

    fetchOrganizzatoreID();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Validazione dei campi
    if (!data.titolo.trim()) {
      setError("Il titolo è obbligatorio.");
      return;
    }
    if (!data.descrizione.trim()) {
      setError("La descrizione è obbligatoria.");
      return;
    }
    if (!data.data || new Date(data.data) < new Date()) {
      setError("Inserisci una data valida (non nel passato).");
      return;
    }
    if (!data.ora) {
      setError("L'ora è obbligatoria.");
      return;
    }
    if (!data.luogo.trim()) {
      setError("Il luogo è obbligatorio.");
      return;
    }
    if (!data.accessibilita.trim()) {
      setError("Specificare l'accessibilità è obbligatorio.");
      return;
    }
    if (
      !data.partecipantiMAX ||
      isNaN(data.partecipantiMAX) ||
      Number(data.partecipantiMAX) <= 0
    ) {
      setError("Inserisci un numero valido per i partecipanti massimi.");
      return;
    }

    try {
      console.log("Invio dei dati al backend:", data); // Log per il debug
      const response = await axiosInstance.post("api/events/create", data);
      setMessage("Evento creato con successo!");
      console.log("Risposta dal backend:", response); // Log per il debug
    } catch (error) {
      console.error("Errore nella creazione dell'evento", error);
      setError("Errore nella creazione dell'evento. Riprova.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="create-event-container">
      <form onSubmit={handleCreateEvent} className="create-event-form">
        <h2>Crea Evento</h2>
        <input
          type="text"
          name="titolo"
          placeholder="Titolo"
          value={data.titolo}
          onChange={handleChange}
          required
        />
        <textarea
          name="descrizione"
          placeholder="Descrizione"
          value={data.descrizione}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="data"
          placeholder="Data"
          value={data.data}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="ora"
          placeholder="Ora"
          value={data.ora}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="luogo"
          placeholder="Luogo"
          value={data.luogo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="accessibilita"
          placeholder="Accessibilità"
          value={data.accessibilita}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="partecipantiMAX"
          placeholder="Partecipanti Massimi"
          value={data.partecipantiMAX}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="labels"
          placeholder="Etichette"
          value={data.labels}
          onChange={handleChange}
          required
        />
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <button type="submit">Crea Evento</button>
      </form>
    </div>
  );
}

export default CreateEvent;
