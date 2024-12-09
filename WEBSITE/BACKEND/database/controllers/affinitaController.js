const affinitaDAO = require('../database/libs/affinitaDAO');

const GestioneAffinitaController = {
    // Crea una nuova affinità
    async createAffinita(req, res) {
        const { utente1ID, utente2ID, punteggio } = req.body;

        if (!utente1ID || !utente2ID || punteggio === undefined) {
            return res.status(400).json({ message: "Tutti i campi obbligatori devono essere forniti (utente1ID, utente2ID, punteggio)." });
        }

        try {
            const result = await affinitaDAO.createAffinita({ utente1ID, utente2ID, punteggio });
            res.status(201).json(result);
        } catch (err) {
            console.error(`Errore durante la creazione dell'affinità: ${err.message}`);
            res.status(500).json({ message: "Errore durante la creazione dell'affinità." });
        }
    },

    // Trova un'affinità tra due utenti
    async findAffinita(req, res) {
        const { utente1ID, utente2ID } = req.query;

        if (!utente1ID || !utente2ID) {
            return res.status(400).json({ message: "Gli ID degli utenti non possono essere nulli." });
        }

        try {
            const result = await affinitaDAO.findAffinita(utente1ID, utente2ID);
            res.status(200).json(result);
        } catch (err) {
            console.error(`Errore durante la ricerca dell'affinità: ${err.message}`);
            res.status(500).json({ message: "Errore durante la ricerca dell'affinità." });
        }
    },

    // Trova tutte le affinità di un utente
    async findAffinitaByUtente(req, res) {
        const { utenteID } = req.query;

        if (!utenteID) {
            return res.status(400).json({ message: "L'ID dell'utente non può essere nullo." });
        }

        try {
            const result = await affinitaDAO.findAffinitaByUtente(utenteID);
            res.status(200).json(result);
        } catch (err) {
            console.error(`Errore durante la ricerca delle affinità: ${err.message}`);
            res.status(500).json({ message: "Errore durante la ricerca delle affinità." });
        }
    },

    // Aggiorna il punteggio di un'affinità
    async updatePunteggio(req, res) {
        const { utente1ID, utente2ID, nuovoPunteggio } = req.body;

        if (!utente1ID || !utente2ID || nuovoPunteggio === undefined) {
            return res.status(400).json({ message: "Tutti i campi obbligatori devono essere forniti (utente1ID, utente2ID, nuovoPunteggio)." });
        }

        try {
            const result = await affinitaDAO.updatePunteggio(utente1ID, utente2ID, nuovoPunteggio);
            res.status(200).json(result);
        } catch (err) {
            console.error(`Errore durante l'aggiornamento del punteggio: ${err.message}`);
            res.status(500).json({ message: "Errore durante l'aggiornamento del punteggio." });
        }
    },

    // Elimina un'affinità
    async deleteAffinita(req, res) {
        const { utente1ID, utente2ID } = req.body;

        if (!utente1ID || !utente2ID) {
            return res.status(400).json({ message: "Gli ID degli utenti non possono essere nulli." });
        }

        try {
            const result = await affinitaDAO.deleteAffinita(utente1ID, utente2ID);
            res.status(200).json({ message: "Affinità eliminata con successo.", result });
        } catch (err) {
            console.error(`Errore durante l'eliminazione dell'affinità: ${err.message}`);
            res.status(500).json({ message: "Errore durante l'eliminazione dell'affinità." });
        }
    }
};

module.exports = GestioneAffinitaController;