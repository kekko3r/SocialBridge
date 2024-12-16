import React, { useEffect, useState } from 'react';
import axios from '../Config/axiosConfig';
import './viewEvents.css'; // Assumendo che lo stile sia presente nel file CSS condiviso

const EventiUtente = () => {
    const [eventi, setEventi] = useState([]);
    const [messaggioErrore, setMessaggioErrore] = useState('');

    useEffect(() => {
        const fetchEventi = async () => {
            try {
                const response = await axios.get('/api/events/events'); // Modifica la richiesta per ottenere tutti gli eventi
                setEventi(response.data);
            } catch (error) {
                setMessaggioErrore('Errore nel caricamento degli eventi.');
            }
        };

        fetchEventi();
    }, []);

    const partecipaEvento = async (id) => {
        try {
            const user = localStorage.getItem('user'); // Ottieni l'oggetto utente salvato nel localStorage
            console.log('prima User ID:', user);
            const userId = user ? user : null; // Estrai l'ID utente dall'oggetto utente
            console.log('dopo User ID:', userId);
            if (!userId) {
                throw new Error('ID utente non trovato nel localStorage');
            }
            await axios.post(`/api/events/register/${id}/${userId}`); // Aggiungi la richiesta per partecipare all'evento
            alert('Partecipazione all\'evento avvenuta con successo!');
        } catch (error) {
            if (error.response && error.response.data.message === "L'utente è già registrato all'evento.") {
                alert('Sei già registrato a questo evento.');
            } else {
                setMessaggioErrore('Errore nella partecipazione all\'evento.');
            }
        }
    };

    return (
        <div>
            <h1>Tutti gli eventi</h1>
            {messaggioErrore && <p className="error-message">{messaggioErrore}</p>}
            {eventi.length === 0 ? (
                <p>Non ci sono eventi disponibili.</p>
            ) : (
                <div className="events">
                    {eventi.map((evento) => (
                        <div className="event-card" key={evento._id}>
                            <h3>{evento.titolo}</h3>
                            <p>{evento.descrizione}</p>
                            <p>Data: {new Date(evento.data).toLocaleDateString()}</p>
                            <p>Luogo: {evento.luogo}</p>
                            <button
                                onClick={() => partecipaEvento(evento._id)}
                            >
                                Partecipa
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventiUtente;