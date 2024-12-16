import React, { useEffect, useState } from 'react';
import axios from '../Config/axiosConfig';
import { jwtDecode } from 'jwt-decode'; // Importa jwt-decode
import './ViewEventsPartecipate.css'; // Assumendo che lo stile sia incluso qui

const EventiPrenotati = () => {
    const [eventi, setEventi] = useState([]);
    const [messaggioErrore, setMessaggioErrore] = useState('');

    useEffect(() => {
        const fetchEventiPrenotati = async () => {
            try {
                const token = localStorage.getItem('jwtToken'); // Ottieni il token JWT dal localStorage
                if (!token) {
                    setMessaggioErrore('Token non trovato. Effettua il login.');
                    return;
                }

                const decodedToken = jwtDecode(token); // Decodifica il token JWT
                const userId = decodedToken.userId; // Assumi che l'ID utente sia memorizzato come userId nel token
                console.log("userId:", userId);

                const response = await axios.get(`/api/events/search`);
                const eventiFiltrati = response.data.filter(evento => {
                    const dataEvento = new Date(evento.data);
                    const oggi = new Date();
                    const isOrganizzatore = evento.organizzatoreID._id === userId;
                    const isPartecipante = evento.partecipanti.includes(userId);
                    return dataEvento > oggi && (isOrganizzatore || isPartecipante); // Include solo eventi futuri in cui l'utente è organizzatore o partecipante
                });
                setEventi(eventiFiltrati);
            } catch (error) {
                setMessaggioErrore('Errore nel caricamento degli eventi prenotati.');
            }
        };

        fetchEventiPrenotati();
    }, []);

    const eliminaPrenotazione = async (id) => {
        const conferma = window.confirm("Sicuro di voler eliminare la prenotazione?");
        if (!conferma) return;
    
        try {
            const token = localStorage.getItem('jwtToken'); // Ottieni il token JWT dal localStorage
            const decodedToken = jwtDecode(token); // Decodifica il token JWT
            const userId = decodedToken.userId; // Assumi che l'ID utente sia memorizzato come userId nel token
    
            await axios.patch(`/api/events/removeParticipant/${id}/${userId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            // Aggiorna lo stato locale rimuovendo l'evento eliminato
            setEventi(eventi.filter(e => e._id !== id));
            alert('Prenotazione eliminata con successo.');
        } catch (error) {
            console.error('Errore durante l\'eliminazione della prenotazione:', error);
            alert('Errore durante l\'eliminazione della prenotazione.');
        }
    };

    const vaiAllaPaginaEventiCreati = () => {
        window.location.href = '/viewEventsCreate'; // Reindirizza alla pagina degli eventi creati
    };

    return (
        <div className="home-container">
            <div className="welcome-section">
                <h1>Eventi Prenotati</h1>
            </div>
            {messaggioErrore && <p className="error-message">{messaggioErrore}</p>}
            <div className="events-section">
                {eventi.length === 0 ? (
                    <p>Non hai ancora prenotato eventi futuri.</p>
                ) : (
                    <div className="events">
                        {eventi.map((evento) => (
                            <div className="event-card" key={evento._id}>
                                <h3>{evento.titolo}</h3>
                                <p>{evento.descrizione}</p>
                                <p>Data: {new Date(evento.data).toLocaleDateString()}</p>
                                <p>Luogo: {evento.luogo}</p>
                                {evento.organizzatoreID._id === jwtDecode(localStorage.getItem('jwtToken')).userId ? (
                                    <div>
                                        <p><b>Sei l'organizzatore di questo evento.</b></p>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={vaiAllaPaginaEventiCreati}
                                            >
                                            Vai alla pagina eventi creati
                                        </button>
                                        <button
                                            style={{ backgroundColor: "#1e90ff", color: 'white' }}
                                            onClick={() => window.location.href = `/participants/${evento._id}`}
                                        >
                                            Lista Partecipanti
                                        </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            style={{ backgroundColor: "#dc3545", color: 'white' }}
                                            onClick={() => eliminaPrenotazione(evento._id)}
                                        >
                                            Elimina Prenotazione
                                        </button>
                                        <button
                                            style={{ backgroundColor: "#1e90ff", color: 'white' }}
                                            onClick={() => window.location.href = `/participants/${evento._id}`}
                                        >
                                            Lista Partecipanti
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventiPrenotati;