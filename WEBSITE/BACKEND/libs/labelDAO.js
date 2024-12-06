require('dotenv').config();
const Label = require('../models/labelModel');

const labelDAO = {
    // Crea una nuova label nel database con i dati forniti
    async createLabel(label) {
        try {
            if (!label || !label.nome) {
                throw new Error("Il campo 'nome' è obbligatorio.");
            }

            const newLabel = new Label(label);
            return await newLabel.save();
        } catch (err) {
            throw new Error(`Errore nella creazione della label: ${err.message}`);
        }
    },

    // Cerca una label nel database
    async findLabelById(labelId) {
        try {
            if (!labelId) {
                throw new Error("L'ID della label non può essere nullo.");
            }

            const label = await Label.findById(labelId).exec();
            if (!label) {
                throw new Error("Label non trovata.");
            }

            return label;
        } catch (err) {
            throw new Error(`Errore nella ricerca della label: ${err.message}`);
        }
    },

    // Recupera tutte le labels nel database
    async findAllLabels() {
        try {
            const labels = await Label.find().exec();
            if (!labels || labels.length === 0) {
                throw new Error("Non sono presenti labels nel database.");
            }

            return labels;
        } catch (err) {
            throw new Error(`Errore nella ricerca di tutte le labels: ${err.message}`);
        }
    },

    // Aggiorna una label specifica
    async updateLabel(labelId, aggiornamenti) {
        try {
            if (!labelId || !aggiornamenti) {
                throw new Error("ID della label e aggiornamenti devono essere forniti.");
            }

            const updatedLabel = await Label.findByIdAndUpdate(labelId, aggiornamenti, { new: true }).exec();
            if (!updatedLabel) {
                throw new Error("Impossibile aggiornare la label, ID non trovato.");
            }

            return updatedLabel;
        } catch (err) {
            throw new Error(`Errore nell'aggiornamento della label: ${err.message}`);
        }
    },

    // Elimina una label
    async deleteLabel(labelId) {
        try {
            if (!labelId) {
                throw new Error("L'ID della label non può essere nullo.");
            }

            const deletedLabel = await Label.findByIdAndDelete(labelId).exec();
            if (!deletedLabel) {
                throw new Error("Impossibile eliminare la label, ID non trovato.");
            }

            return deletedLabel;
        } catch (err) {
            throw new Error(`Errore nell'eliminazione della label: ${err.message}`);
        }
    }
};

module.exports = labelDAO;