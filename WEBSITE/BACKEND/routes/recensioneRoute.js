const express = require('express');
const router = express.Router();
const checkJwt = require('../libs/middleware');
const recensioneController = require('../database/controllers/recensioneController'); 

router.use(express.json()); // Serve per convertire automaticamente i dati JSON inviati dal frontend in oggetti JavaScript

// Rotte protette dal middleware `checkJwt`
router
    // GET tutte le recensioni
    .get('/', checkJwt(100, 0), recensioneController.getAll)

    // GET recensione per ID
    .get('/:id', checkJwt(100, 0), recensioneController.getById)

    // POST crea una nuova recensione
    .post('/', checkJwt(100, 0), recensioneController.create)

    // PATCH aggiorna una recensione
    .patch('/:id', checkJwt(100, 0), recensioneController.update)

    // DELETE elimina una recensione
    .delete('/:id', checkJwt(100, 0), recensioneController.delete)

    // GET recensioni per evento
    .get('/evento/:eventoID', checkJwt(100, 0), recensioneController.getByEvento)

    // GET recensioni per utente
    .get('/utente/:utenteID', checkJwt(100, 0), recensioneController.getByUtente);

module.exports = router; // Esporta le rotte altrimenti non possono essere viste