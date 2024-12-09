const userDAO = require('../libs/GestioneUtenteDAO');

const GestioneUtenteController = {
    async getAll(req, res) {
        try {
            const utenti = await userDAO.getAll(); // Usa il metodo getAll() del DAO
            res.json(utenti);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getById(req, res) {
        try {
            const utente = await userDAO.getUserById(req.params.id); // Corretto il nome del metodo
            if (!utente) {
                return res.status(404).json({ message: 'Utente non trovato' });
            }
            res.json(utente);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async create(req, res) {
        try {
            const utente = await userDAO.registerUser(req.body); // Usa il metodo registerUser() del DAO
            res.status(201).json(utente);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    async update(req, res) {
        try {
            const utente = await userDAO.updateProfile(req.params.id, req.body); // Usa updateProfile() per aggiornare
            if (!utente) {
                return res.status(404).json({ message: 'Utente non trovato' });
            }
            res.json(utente);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    async delete(req, res) {
        try {
            const utente = await userDAO.deleteUser(req.params.id); // Corretto il metodo
            if (!utente) {
                return res.status(404).json({ message: 'Utente non trovato' });
            }
            res.json({ message: 'Utente eliminato' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = GestioneUtenteController;
