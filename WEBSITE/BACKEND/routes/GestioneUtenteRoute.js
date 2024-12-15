const express = require('express');
const router = express.Router();
const checkJwt = require('../libs/middleware');
const userController = require('../database/controllers/GestioneUtenteController'); 

router.use(express.json()); // Serve per convertire automaticamente i dati JSON inviati dal frontend in oggetti JavaScript

// Rotte protette dal middleware `checkJwt`
router
    // GET tutti gli utenti
    .get('/', checkJwt(100, 0), userController.getAll)

    // GET ricerca utente per nome e cognome
    .get('/search', checkJwt(100, 0), userController.search)

    // POST crea un nuovo utente
    .post('/signup', userController.create)

    // POST login utente
    .post('/login', userController.login)
    
    .put('/updateUser/:id', checkJwt(100, 0), userController.update)

    // DELETE elimina un utente
    .delete('/:id', checkJwt(100, 0), userController.delete)
    
    // GET utente per ID
    .get('/:id', checkJwt(100, 0), userController.getById);

module.exports = router; // Esporta le rotte altrimenti non possono essere viste