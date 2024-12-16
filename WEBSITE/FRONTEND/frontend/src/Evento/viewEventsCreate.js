import React, { useEffect, useState } from 'react';
import axios from '../Config/axiosConfig';
import { jwtDecode } from 'jwt-decode'; // Importa jwt-decode
import './ViewEventsCreate.css'; // Assumendo che lo stile sia presente nel file CSS condiviso

const EventiUtente = () => {
    const [eventi, setEventi] = useState([]);
    const [messaggioErrore, setMessaggioErrore] = useState('');

    useEffect(() => {
        const fetchEventi = async () => {
            try {
                const token = localStorage.getItem('jwtToken'); // Ottieni il token JWT dal localStorage
                if (!token) {
                    setMessaggioErrore('Token non trovato. Effettua il login.');
                    return;
                }

                const decodedToken = jwtDecode(token); // Decodifica il token JWT
                const userId = decodedToken.userId; // Assumi che l'ID utente sia memorizzato come userId nel token

                const response = await axios.get(`/api/events/search`, {
                    params: {
                        organizzatoreID: userId
                    }
                });
                const eventiFiltrati = response.data.filter(evento => {
                    const dataEvento = new Date(evento.data);
                    const oggi = new Date();
                    const isOrganizzatore = evento.organizzatoreID._id === userId;
                    return dataEvento > oggi && isOrganizzatore; // Include solo eventi futuri
                });
                setEventi(eventiFiltrati);
            } catch (error) {
                setMessaggioErrore('Errore nel caricamento degli eventi.');
            }
        };

        fetchEventi();
    }, []);

    const eliminaEvento = async (id) => {
        const conferma = window.confirm("Sicuro di voler eliminare l'evento?");
        if (!conferma) return;

        try {
            const evento = eventi.find(e => e._id === id);
            if (new Date(evento.data) <= new Date()) {
                alert("Non è possibile eliminare un evento già iniziato o passato.");
                return;
            }

            await axios.delete(`/api/events/delete/${id}`);
            setEventi(eventi.filter(e => e._id !== id));
            alert('Evento eliminato con successo.');
        } catch (error) {
            alert('Errore durante l\'eliminazione dell\'evento.');
        }
    };

    const modificaEvento = (id) => {
        const evento = eventi.find(e => e._id === id);
        if (new Date(evento.data) <= new Date()) {
            alert("Non è possibile modificare un evento già iniziato o passato.");
            return;
        }

        // Redirigi l'utente a una pagina di modifica evento (deve essere implementata separatamente)
        window.location.href = `/updateEvent/${id}`;
    };

    return (
        <div className="home-container">
            <div className="welcome-section">
                <h1>I tuoi eventi</h1>
            </div>
            {messaggioErrore && <p className="error-message">{messaggioErrore}</p>}
            <div className="events-section">
                {eventi.length === 0 ? (
                    <p>Non hai ancora creato eventi.</p>
                ) : (
                    <div className="events">
                        {eventi.map((evento) => (
                            <div className="event-card" key={evento._id}>
                                <h3>{evento.titolo}</h3>
                                <p>{evento.descrizione}</p>
                                <p>Data: {new Date(evento.data).toLocaleDateString()}</p>
                                <p>Luogo: {evento.luogo}</p>
                                <button
                                    onClick={() => modificaEvento(evento._id)}
                                >
                                    Modifica
                                </button>
                                <button
                                    onClick={() => eliminaEvento(evento._id)}
                                >
                                    Elimina
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventiUtente;