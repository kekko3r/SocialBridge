const express = require('express');
const router = express.Router();
const checkJwt = require('../libs/middleware');
const eventController = require('../database/controllers/GestioneEventiController'); 

router.use(express.json()); // Serve per convertire automaticamente i dati JSON inviati dal frontend in oggetti JavaScript

// Rotte protette dal middleware `checkJwt`
router
    // GET evento per ID
    .get('/details/:id', checkJwt(100, 0), eventController.getEventDetails)

    // POST crea un nuovo evento
    .post('/create', checkJwt(100, 0), eventController.createEvent)

    // PATCH rimuove un partecipante da un evento
    .patch('/removeParticipant/:eventID/:userID', checkJwt(100, 0), eventController.removeParticipant)

    // PATCH aggiorna un evento
    .patch('/update/:id', checkJwt(100, 0), eventController.updateEvent)

    // DELETE elimina un evento
    .delete('/delete/:id', checkJwt(100, 0), eventController.deleteEvent)

    // POST registra un utente a un evento
    .post('/register/:eventID/:userID', checkJwt(100, 0), eventController.registerToEvent)

    // GET ottiene partecipanti di un evento
    .get('/participants/:eventID', eventController.getEventParticipants)

    // GET cerca eventi con filtri
    .get('/search', eventController.searchEvents)

    // GET ottiene tutti gli eventi
    .get('/events', eventController.getAllEvents);

module.exports = router; // Esporta le rotte altrimenti non possono essere viste