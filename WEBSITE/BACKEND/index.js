require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.SERVER_PORT || 3000;
const mongoURL = process.env.MONGODB_URI;

// Connessione a MongoDB
mongoose.connect(mongoURL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => console.error('Errore di connessione a MongoDB:', err));

// Middleware globale per logging delle richieste
app.use((req, res, next) => {
    console.log(req.method + " " + req.originalUrl);
    next();
});

// Debug: mostra l'URL del servizio
console.log("Service URL is " + process.env.SERVICE_URL);

// Middleware per il parsing del body (opzionale, se necessario)
app.use(express.json());

// Rotte principali organizzate per modulo
const routes = {
    user: require('./routes/GestioneUtenteRoute'), // Gestione degli utenti
    event: require('./routes/GestioneEventiRoute'), // Gestione degli eventi
    message: require('./routes/GestioneMessaggisticaRoute'), // Gestione dei messaggi
    label: require('./routes/labelRoute'), // Gestione delle etichette
    affinity: require('./routes/affinitaRoute'), // Gestione delle affinità
    review: require('./routes/recensioneRoute'), // Gestione delle recensioni
    notification: require('./routes/GestioneNotificheRoute'), // Gestione delle notifiche
    assistance: require('./routes/GestioneAssistenzaUtenteRoute') //Gestione assisstenza utente
};

// Montaggio dei router (da commentare o attivare a seconda delle esigenze)
app.use('/users', routes.user);
app.use('/events', routes.event);
app.use('/messages', routes.message);
app.use('/labels', routes.label);
app.use('/affinities', routes.affinity);
app.use('/reviews', routes.review);
app.use('/notifications', routes.notification);
app.use('/assistances', routes.assistance);

// Rotta base per test
app.get('/', (req, res) => {
    res.json({ message: 'Testo per testare il test del test che fa il test di test!' });
});

// Avvio del server
app.listen(port, () => {
    console.log("App listening on port " + port);
});
