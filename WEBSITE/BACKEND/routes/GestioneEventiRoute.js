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

    // PATCH aggiorna un evento
    .patch('/update/:id', checkJwt(100, 0), eventController.updateEvent)

    // DELETE elimina un evento
    .delete('/delete/:id', checkJwt(100, 0), eventController.deleteEvent)

    // POST registra un utente a un evento
    .post('/register/:eventID/:userID', checkJwt(100, 0), eventController.registerToEvent)

    // GET cerca eventi con filtri
    .get('/search', checkJwt(100, 0), eventController.searchEvents);

module.exports = router; // Esporta le rotte altrimenti non possono essere viste