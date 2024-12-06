const express = require('express');
const router = express.Router();
const checkJwt = require('../libs/middleware');
const labelController = require('../controllers/labelController'); // Assicurati che il percorso sia corretto

router.use(express.json()); // Serve per convertire automaticamente i dati JSON inviati dal frontend in oggetti JavaScript

// Rotte protette dal middleware `checkJwt`
router
    // GET tutte le labels
    .get('/', checkJwt(100, 0), labelController.getAll)

    // GET label per ID
    .get('/:id', checkJwt(100, 0), labelController.getById)

    // POST crea una nuova label
    .post('/', checkJwt(100, 0), labelController.create)

    // PATCH aggiorna una label
    .patch('/:id', checkJwt(100, 0), labelController.update)

    // DELETE elimina una label
    .delete('/:id', checkJwt(100, 0), labelController.delete);

module.exports = router; // Esporta le rotte altrimenti non possono essere viste