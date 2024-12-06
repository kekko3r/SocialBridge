const express = require('express');
const router = express.Router();
const Middleware = require('../libs/middleware');
const notificheController = require('../controllers/GestioneNotificheController'); // Assicurati che il percorso sia corretto

router.use(express.json()); // Middleware per il parsing JSON

// Rotte protette dal middleware `Middleware`
router
    // POST invia una notifica a un utente
    .post('/send', Middleware(100, 0), notificheController.create)

    // GET recupera tutte le notifiche di un utente
    .get('/notifications', Middleware(100, 0), notificheController.getById)

    // PATCH segna una notifica come letta
    .patch('/mark-as-read', Middleware(100, 0), notificheController.update);

module.exports = router; // Esporta le rotte altrimenti non possono essere viste