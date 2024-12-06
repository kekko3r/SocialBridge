const gestioneAssistenzaUtenteDAO = require('../database/models/GestioneAssistenzaUtenteDAO');

const GestioneAssistenzaUtenteController = {
    async create(req, res) {
        try {
            const assistenza = await gestioneAssistenzaUtenteDAO.submitSupportRequest(req.body);
            res.status(201).json(assistenza);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    async getById(req, res) {
        try {
            const assistenza = await gestioneAssistenzaUtenteDAO.getSupportRequests(req.params.id);
            if (!assistenza) {
                return res.status(404).json({ message: 'Assistenza utente non disponibile' });
            }
            res.json(assistenza);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async update(req, res) {
        try {
            const assistenza = await gestioneAssistenzaUtenteDAO.resolveSupportRequest(req.params.id, req.body.status);
            if (!assistenza) {
                return res.status(404).json({ message: 'Richiesta di assistenza non trovata' });
            }
            res.json(assistenza);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    async delete(req, res) {
        try {
            const assistenza = await gestioneAssistenzaUtenteDAO.deleteSupportRequest(req.params.id);
            if (!assistenza) {
                return res.status(404).json({ message: 'Richiesta di assistenza non trovata' });
            }
            res.json({ message: 'Richiesta di assistenza eliminata' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = GestioneAssistenzaUtenteController;