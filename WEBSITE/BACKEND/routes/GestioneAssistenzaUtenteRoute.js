const express = require('express');
const router = express.Router();
const checkJwt = require('../libs/middleware');
const GestioneAssistenzaUtenteController = require('../database/controllers/GestioneAssistenzaUtenteController'); 

router.use(express.json()); // Serve per convertire automaticamente i dati JSON inviati dal frontend in oggetti JavaScript

// Rotte protette dal middleware `checkJwt`
router
    // POST crea una nuova richiesta di assistenza
    .post('/', checkJwt(100, 0), gestioneAssistenzaUtenteController.create)

    // GET richiesta di assistenza per ID
    .get('/:id', checkJwt(100, 0), gestioneAssistenzaUtenteController.getById)

    // PATCH aggiorna una richiesta di assistenza
    .patch('/:id', checkJwt(100, 0), gestioneAssistenzaUtenteController.update)

    // DELETE elimina una richiesta di assistenza
    .delete('/:id', checkJwt(100, 0), gestioneAssistenzaUtenteController.delete);

module.exports = router; // Esporta le rotte altrimenti non possono essere viste
