const express = require('express');
const router = express.Router();
const Middleware = require('../libs/middleware');
const affinitaController = require('../database/controllers/GestioneAffinitaController'); 

router.use(express.json()); // Middleware per il parsing JSON

// Rotte protette dal middleware `Middleware`
router
    // POST crea una nuova affinità
    .post('/', Middleware(100, 0), affinitaController.createAffinita)

    // GET trova un'affinità tra due utenti
    .get('/find', Middleware(100, 0), affinitaController.findAffinita)

    // GET trova tutte le affinità di un utente
    .get('/findByUtente', Middleware(100, 0), affinitaController.findAffinitaByUtente)

    // PATCH aggiorna il punteggio di un'affinità
    .patch('/updatePunteggio', Middleware(100, 0), affinitaController.updatePunteggio)

    // DELETE elimina un'affinità
    .delete('/delete', Middleware(100, 0), affinitaController.deleteAffinita);

module.exports = router; // Esporta le rotte altrimenti non possono essere viste