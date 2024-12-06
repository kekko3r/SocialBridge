const express = require('express');
const router = express.Router();
const Middleware = require('../libs/middleware');
const userController = require('../database/controllers/GestioneUtenteController'); 

router.use(express.json()); // Serve per convertire automaticamente i dati JSON inviati dal frontend in oggetti JavaScript

// Rotte protette dal middleware `Middleware`
router
    // GET tutti gli utenti
    .get('/', checkJwt(100, 0), userController.getAll)

    // GET utente per ID
    .get('/:id', checkJwt(100, 0), userController.getById)

    // POST crea un nuovo utente
    .post('/', checkJwt(100, 0), userController.create)

    // PATCH aggiorna un utente
    .patch('/:id', checkJwt(100, 0), userController.update)

    // DELETE elimina un utente
    .delete('/:id', checkJwt(100, 0), userController.delete);

module.exports = router; // Esporta le rotte altrimenti non possono essere viste
