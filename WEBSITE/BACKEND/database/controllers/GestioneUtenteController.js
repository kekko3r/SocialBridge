const userDAO = require('../../libs/GestioneUtenteDAO');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

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

    async login(req, res) {
        try {
            const utente = await userDAO.loginUser(req.body); // Usa il metodo loginUser() del DAO
            const token = jwt.sign({ userId: utente._id }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, idutente: utente._id });
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
    },

    async search(req, res) {
        console.log("Metodo search chiamato");
        console.log("Query ricevuta:", req.query);

        try {
            const { nome, cognome } = req.query;

            // Debug query parameters
            if (!nome && !cognome) {
                console.log("Parametri mancanti");
                return res.status(400).json({ message: "Nome e/o cognome richiesti." });
            }

            console.log(`Ricerca utenti con nome: ${nome}, cognome: ${cognome}`);
            const utenti = await userDAO.searchByName(nome, cognome);

            if (!utenti.length) {
                console.log("Nessun utente trovato");
                return res.status(404).json({ message: "Nessun utente trovato." });
            }

            console.log("Utenti trovati:", utenti);
            res.json(utenti);
        } catch (err) {
            console.error("Errore durante la ricerca degli utenti:", err);
            res.status(500).json({ message: "Errore interno del server." });
        }
    }
};

module.exports = GestioneUtenteController;