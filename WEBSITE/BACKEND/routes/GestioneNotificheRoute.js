const express = require('express');
const router = express.Router();
const Middleware = require('../libs/middleware');
const notificheController = require('../database/controllers/GestioneNotificheController'); 

router.use(express.json()); // Middleware per il parsing JSON

// Rotte protette dal middleware `Middleware`
router
    // POST invia una notifica a un utente
    .post('/send', Middleware(100, 0), notificheController.sendNotification)

    // GET recupera tutte le notifiche di un utente
    .get('/notifications/:userID', Middleware(100, 0), notificheController.getNotifications)

    // PATCH segna una notifica come letta
    .patch('/mark-as-read', Middleware(100, 0), notificheController.markNotificationAsRead)

    // DELETE elimina una notifica
    .delete('/delete/:notificationID', Middleware(100, 0), notificheController.deleteNotification)

    // GET recupera tutte le notifiche
    .get('/all', Middleware(100, 0), notificheController.findAll);

module.exports = router; // Esporta le rotte altrimenti non possono essere viste