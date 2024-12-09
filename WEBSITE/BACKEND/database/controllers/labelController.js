const labelDAO = require('../database/models/labelDAO');

const labelController = {
    async getAll(req, res) {
        try {
            const labels = await labelDAO.findAllLabels();
            res.json(labels);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getById(req, res) {
        try {
            const label = await labelDAO.findLabelById(req.params.id);
            if (!label) {
                return res.status(404).json({ message: 'Label non trovata' });
            }
            res.json(label);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async create(req, res) {
        try {
            const label = await labelDAO.createLabel(req.body);
            res.status(201).json(label);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    async update(req, res) {
        try {
            const label = await labelDAO.updateLabel(req.params.id, req.body);
            if (!label) {
                return res.status(404).json({ message: 'Label non trovata' });
            }
            res.json(label);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    async delete(req, res) {
        try {
            const label = await labelDAO.deleteLabel(req.params.id);
            if (!label) {
                return res.status(404).json({ message: 'Label non trovata' });
            }
            res.json({ message: 'Label eliminata' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = labelController;