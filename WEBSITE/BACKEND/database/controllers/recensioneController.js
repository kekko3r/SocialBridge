const recensioneDAO = require('../../libs/recensioneDAO');

const recensioneController = {
    async getAll(req, res) {
        try {
            const recensioni = await recensioneDAO.findAll();
            res.json(recensioni);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getById(req, res) {
        try {
            const recensione = await recensioneDAO.findById(req.params.id);
            if (!recensione) {
                return res.status(404).json({ message: 'Recensione non trovata' });
            }
            res.json(recensione);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async create(req, res) {
        try {
            const recensione = await recensioneDAO.createRecensione(req.body);
            res.status(201).json(recensione);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    async update(req, res) {
        try {
            const recensione = await recensioneDAO.updateRecensione(req.params.id, req.body);
            if (!recensione) {
                return res.status(404).json({ message: 'Recensione non trovata' });
            }
            res.json(recensione);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    async delete(req, res) {
        try {
            const recensione = await recensioneDAO.deleteRecensione(req.params.id);
            if (!recensione) {
                return res.status(404).json({ message: 'Recensione non trovata' });
            }
            res.json({ message: 'Recensione eliminata' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getByEvento(req, res) {
        try {
            const recensioni = await recensioneDAO.getRecensioniByEvento(req.params.eventoID);
            res.json(recensioni);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getByUtente(req, res) {
        try {
            const recensioni = await recensioneDAO.getRecensioniByUtente(req.params.utenteID);
            res.json(recensioni);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = recensioneController;