import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../Config/axiosConfig';
import './partecipantiEvento.css'; // File CSS per lo stile (opzionale)

const PartecipantiEvento = () => {
    const { eventID } = useParams(); // Ottieni eventID dall'URL
    const [partecipanti, setPartecipanti] = useState([]);
    const [messaggioErrore, setMessaggioErrore] = useState('');

    useEffect(() => {
        const fetchPartecipanti = async () => {
            try {
                console.log(`Fetching participants for event ID: ${eventID}`); // Debug log
                const response = await axios.get(`/api/events/participants/${eventID}`);

                //esclude l utente loggato dalla lista dei partecipanti
                const user = localStorage.getItem('user');
                const filteredPartecipanti = response.data.filter(partecipante => partecipante._id !== user);
                setPartecipanti(filteredPartecipanti);
            } catch (error) {
                setMessaggioErrore('Errore nel caricamento dei partecipanti.');
            }
        };

        fetchPartecipanti();
    }, [eventID]);

    return (
        <div className="participants-container">
            <h1>Partecipanti all'Evento</h1>
            {messaggioErrore && <p className="error-message">{messaggioErrore}</p>}
            {partecipanti.length === 0 ? (
                <p>Nessun partecipante registrato.</p>
            ) : (
                <div className="participants-list">
                    {partecipanti.map((partecipante) => (
                        <div className="participant-card" key={partecipante._id}>
                            <h3>{partecipante.nome} {partecipante.cognome}</h3>
                            <p>Email: {partecipante.email}</p>
                            <a href={`/evaluateAffinities/${partecipante._id}`} className="evaluate-link">
                                Valuta Affinità
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PartecipantiEvento;