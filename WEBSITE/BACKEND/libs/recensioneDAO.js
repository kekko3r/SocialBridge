require('dotenv').config();
const Recensione = require('../models/recensioneModel'); // Modello per Recensione

const recensioneDAO = {

    async createRecensione({ eventoID, autoreID, voto, commento }) { // Crea una nuova recensione
        try {
            const nuovaRecensione = new Recensione({ eventoID, autoreID, voto, commento });
            return await nuovaRecensione.save();
        } catch (error) {
            console.error('Errore durante la creazione della recensione:', error);
            throw error;
        }
    },

    async getRecensioniByEvento(eventoID) { // Recupera tutte le recensioni per un evento
        try {
            if (!eventoID) {
                throw new Error('L\'ID dell\'evento è obbligatorio.');
            }
            return await Recensione.find({ eventoID }).lean();
        } catch (error) {
            console.error('Errore durante il recupero delle recensioni per l\'evento:', error);
            throw error;
        }
    },

    async getRecensioniByUtente(autoreID) { // Recupera tutte le recensioni scritte da un utente
        try {
            if (!autoreID) {
                throw new Error('L\'ID dell\'utente è obbligatorio.');
            }
            return await Recensione.find({ autoreID }).lean();
        } catch (error) {
            console.error('Errore durante il recupero delle recensioni dell\'utente:', error);
            throw error;
        }
    },

    async updateRecensione(recensioneID, { voto, commento }) { // Aggiorna una recensione
        try {
            const updateData = {};
            if (voto) updateData.voto = voto;
            if (commento) updateData.commento = commento;

            return await Recensione.findByIdAndUpdate(recensioneID, updateData, { new: true });
        } catch (error) {
            console.error('Errore durante l\'aggiornamento della recensione:', error);
            throw error;
        }
    },

    async deleteRecensione(recensioneID) { // Elimina una recensione
        try {
            if (!recensioneID) {
                throw new Error('L\'ID della recensione è obbligatorio.');
            }
            return await Recensione.findByIdAndDelete(recensioneID);
        } catch (error) {
            console.error('Errore durante l\'eliminazione della recensione:', error);
            throw error;
        }
    },

    async findById(recensioneID) { // Recupera una recensione tramite ID
        try {
            if (!recensioneID) {
                throw new Error('L\'ID della recensione è obbligatorio.');
            }
            return await Recensione.findById(recensioneID);
        } catch (error) {
            console.error('Errore durante il recupero della recensione:', error);
            throw error;
        }
    },

    async findAll() { // Recupera tutte le recensioni
        try {
            return await Recensione.find().lean();
        } catch (error) {
            console.error('Errore durante il recupero delle recensioni:', error);
            throw error;
        }
    }
};

module.exports = recensioneDAO;