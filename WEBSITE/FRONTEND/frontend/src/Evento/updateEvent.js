import React, { useState, useEffect } from "react";
import axiosInstance from "../Config/axiosConfig"; // Importa l'istanza configurata
import './updateEvent.css'; // Importa il CSS di stile
import { useParams, useNavigate } from "react-router-dom"; // Per gestire parametri URL e navigazione

function UpdateEvent() {
  const parametri = useParams(); // Ottieni l'ID dell'veno dai parametri URL
  const eventId = parametri.id; //Ci prendiamo solo l'id
  const navigate = useNavigate(); // Per navigare tra le pagine

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
    const fetchEventDetails = async () => {
      try {
        console.log("Event ID:", eventId); // Log per il debug
        const response = await axiosInstance.get(`/api/events/details/${eventId}`);
        const eventData = response.data;
        eventData.data = new Date(eventData.data).toISOString().split('T')[0];
        setData(eventData); // Popola i dati con quelli dell'evento esistente

      } catch (error) {
        console.error("Errore nel recupero dei dettagli dell'evento", error);
        setError("Errore nel caricamento dell'evento.");
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleUpdateEvent = async (e) => {
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
      console.log("Invio dei dati aggiornati al backend:", data); // Log per il debug
      const response = await axiosInstance.patch(`/api/events/update/${eventId}`, data);
      setMessage("Evento aggiornato con successo!");
      console.log("Risposta dal backend:", response); // Log per il debug
      setTimeout(() => navigate("/viewEventsCreate"), 2000); // Reindirizza alla pagina degli eventi dopo 2 secondi
    } catch (error) {
      console.error("Errore nell'aggiornamento dell'evento", error);
      setError("Errore nell'aggiornamento dell'evento. Riprova.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="update-event-container">
      <form onSubmit={handleUpdateEvent} className="update-event-form">
        <h2>Modifica Evento</h2>
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
        <button type="submit">Aggiorna Evento</button>
      </form>
    </div>
  );
}

export default UpdateEvent;