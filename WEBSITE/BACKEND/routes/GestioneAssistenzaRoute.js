const express = require('express');
const router = express.Router();
const Middleware = require('../libs/middleware'); // Assicurati che il percorso sia corretto
const assistenzaController = require('../controllers/GestioneAssistenzaUtenteController'); // Controller per le richieste di assistenza

router.use(express.json()); // Serve per convertire automaticamente i dati JSON inviati dal frontend in oggetti JavaScript

router
    // GET tutte le richieste di assistenza per l'utente autenticato
    .get('/', Middleware(100, 0), async (req, res) => {
        try {
            const richieste = await assistenzaController.getSupportRequests(req.user._id);
            res.status(200).json(richieste);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error!" });
        }
    })

    // GET richiesta di assistenza per ID
    .get('/:id', Middleware(100, 0), async (req, res) => {
        try {
            const richiesta = await assistenzaController.getRequestById(req.params.id);
            if (!richiesta) {
                return res.status(404).json({ message: "Richiesta non trovata!" });
            }
            res.status(200).json(richiesta);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error!" });
        }
    })

    // POST crea una nuova richiesta di assistenza
    .post('/', Middleware(100, 0), async (req, res) => {
        try {
            const { issueDetails, attachments } = req.body;
            const userID = req.user._id;
            const newRichiesta = await assistenzaController.submitSupportRequest(userID, issueDetails, attachments);
            res.status(201).json(newRichiesta);
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: "Errore nella creazione della richiesta di supporto!" });
        }
    })

    // PATCH aggiorna lo stato di una richiesta di assistenza
    .patch('/:id', Middleware(0, 0), async (req, res) => {         //controllare se è (1000, 1000) o (0,0)
        try {
            const { status } = req.body;
            const updatedRichiesta = await assistenzaController.resolveSupportRequest(req.params.id, status);
            if (!updatedRichiesta) {
                return res.status(404).json({ message: "Richiesta non trovata!" });
            }
            res.status(200).json(updatedRichiesta);
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: "Errore nell'aggiornamento della richiesta!" });
        }
    })

    // DELETE elimina una richiesta di assistenza
    .delete('/:id', Middleware(0,0), async (req, res) => {  //controllare se è (1000,1000) o (0,0)
        try {
            const deletedRichiesta = await assistenzaController.deleteSupportRequest(req.params.id);
            if (!deletedRichiesta) {
            }
            res.status(200).json({ message: "Richiesta eliminata con successo!" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Internal Server Error!" });
        }
    });

module.exports = router; // Esporta le rotte
