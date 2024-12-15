const express = require('express');
const router = express.Router();
const Middleware = require('../libs/middleware');
const affinitaController = require('../database/controllers/affinitaController'); 

router.use(express.json()); // Middleware per il parsing JSON

// Rotte protette dal middleware Middleware
router
    // POST crea una nuova affinità
    .post('/creaAffinita', Middleware(100, 0), affinitaController.createAffinita)

    // PATCH aggiorna il rating e il commento di un'affinità
    .patch('/updateRatingAndComment', Middleware(100, 0), affinitaController.updateRatingAndComment)

    // DELETE elimina un'affinità
    .delete('/delete', Middleware(100, 0), affinitaController.deleteAffinita)

    // GET trova tutte le affinità fatte da un utente
    .get('/user/:userId', Middleware(100, 0), affinitaController.getAffinitaByUser);

module.exports = router; // Esporta le rotte altrimenti non possono essere viste