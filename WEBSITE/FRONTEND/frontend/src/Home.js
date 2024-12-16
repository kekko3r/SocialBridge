import React, { useEffect, useState } from "react";
import axios from './Config/axiosConfig'; // Importa l'istanza configurata
import './Home.css';

const Home = () => {
  const [eventi, setEventi] = useState([]);
  const [messaggioErrore, setMessaggioErrore] = useState('');

  useEffect(() => {
    const fetchEventi = async () => {
      try {
        const response = await axios.get(`/api/events/search`);
      const eventiFiltrati = response.data.filter(evento => {
          const dataEvento = new Date(evento.data);
          const oggi = new Date();
          return dataEvento > oggi; // Include solo eventi futuri
      });
      eventiFiltrati.sort((a, b) => new Date(a.data) - new Date(b.data));
      const eventiPiùVicini = eventiFiltrati.slice(0, 3);
      setEventi(eventiPiùVicini);
      } catch (error) {
        setMessaggioErrore('Errore nel caricamento degli eventi.');
      }
    };

    fetchEventi();
  }, []);

  return (
    <div className="home-container">
      <section className="welcome-section">
        <h1>Benvenuto su SocialBridge</h1>
        <p>Connettiti con gli eventi e le persone intorno a te.</p>
      </section>
      <section className="events-section">
        <h2>Eventi in evidenza</h2>
        {messaggioErrore && <p className="error-message">{messaggioErrore}</p>}
        <div className="events">
          {eventi.length === 0 ? (
            <p>Non ci sono eventi in evidenza.</p>
          ) : (
            eventi.map((evento) => (
              <div className="event-card" key={evento._id}>
                <h3>{evento.titolo}</h3>
                <p>{evento.descrizione}</p>
                <p>Data: {new Date(evento.data).toLocaleDateString()}</p>
                <p>Luogo: {evento.luogo}</p>
              </div>
            ))
          )}
        </div>
      </section>
      <section className="contact-section">
        <h2>Contattaci</h2>
        <p>Per qualsiasi domanda, non esitare a contattarci.</p>
        <p>Email: <a href="mailto:socialbridgenotification@gmail.com">socialbridgenotification@gmail.com</a></p>
      </section>
    </div>
  );
};

export default Home;