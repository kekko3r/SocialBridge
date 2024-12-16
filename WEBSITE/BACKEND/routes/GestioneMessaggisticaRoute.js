const express = require('express');
const router = express.Router();
const Middleware = require('../libs/middleware');
const messaggioController = require('../database/controllers/GestioneMessaggisticaController');

router.use(express.json()); // Middleware per il parsing JSON

// Rotte protette dal middleware `Middleware`
router
    // POST invia un messaggio testuale
    .post('/send', Middleware(100, 0), messaggioController.sendMessage)

    // GET recupera tutti i messaggi tra due utenti
    .get('/conversation', Middleware(100, 0), messaggioController.getMessagesBetweenUsers)

    // POST notifica la ricezione di un messaggio
    .post('/notify', Middleware(100, 0), messaggioController.notifyMessage)

    // POST invia un messaggio multimediale
    .post('/multimedia', Middleware(100, 0), messaggioController.sendMultimediaMessage)

    // DELETE elimina un messaggio specifico
    .delete('/delete', Middleware(100, 0), messaggioController.deleteMessage)

    // PATCH segna un messaggio come letto
    .patch('/mark-as-read', Middleware(100, 0), messaggioController.markMessageAsRead);

module.exports = router; // Esporta le rotte altrimenti non possono essere viste