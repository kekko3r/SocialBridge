require('dotenv').config();
const mongoose = require('mongoose');
const Recensione = require('../database/models/recensioneModel'); // Modello per Recensione

const recensioneDAO = {

    async createRecensione({ eventoID, autoreID, voto, commento }) { // Crea una nuova recensione
        try {
            // Controlla se tutti i campi obbligatori sono forniti
            if (!eventoID || !autoreID) {
                throw new Error('Tutti i campi obbligatori devono essere forniti.');
            }
            // Controlla se il voto è valido
            if (typeof voto !== 'number' || voto < 1 || voto > 5) {
                throw new Error('Voto non valido');
            }
    
            const nuovaRecensione = new Recensione({ eventoID, autoreID, voto, commento });
            return await nuovaRecensione.save();
        } catch (error) {
            console.error('Errore durante la creazione della recensione:', error.message);
            throw error;
        }
    },

    async getRecensioniByEvento(eventoID) { // Recupera tutte le recensioni per un evento
        try {
            if (!mongoose.Types.ObjectId.isValid(eventoID)) {
                throw new Error('L\'ID dell\'evento non è valido.');
            }
            return await Recensione.find({ eventoID }).lean();
        } catch (error) {
            console.error('Errore durante il recupero delle recensioni per l\'evento:', error.message);
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
            console.error('Errore durante il recupero delle recensioni dell\'utente:', error.message);
            throw error;
        }
    },

    async updateRecensione(recensioneID, { voto, commento }) { // Aggiorna una recensione
        try {
            if (!mongoose.Types.ObjectId.isValid(recensioneID)) {
                throw new Error('L\'ID della recensione non è valido.');
            }
            if (voto && (typeof voto !== 'number' || voto < 1 || voto > 5)) {
                throw new Error('Voto non valido');
            }
            const updateData = {};
            if (voto) updateData.voto = voto;
            if (commento) updateData.commento = commento;
    
            return await Recensione.findByIdAndUpdate(recensioneID, updateData, { new: true });
        } catch (error) {
            console.error('Errore durante l\'aggiornamento della recensione:', error.message);
            throw error;
        }
    },

    async deleteRecensione(recensioneID) { // Elimina una recensione
        try {
            if (!mongoose.Types.ObjectId.isValid(recensioneID)) {
                throw new Error('L\'ID della recensione non è valido.');
            }
            return await Recensione.findByIdAndDelete(recensioneID);
        } catch (error) {
            console.error('Errore durante l\'eliminazione della recensione:', error.message);
            throw error;
        }
    },

    async findById(recensioneID) { // Recupera una recensione tramite ID
        try {
            if (!mongoose.Types.ObjectId.isValid(recensioneID)) {
                throw new Error('L\'ID della recensione non è valido.');
            }
            return await Recensione.findById(recensioneID);
        } catch (error) {
            console.error('Errore durante il recupero della recensione:', error.message);
            throw error;
        }
    },

    async findAll(filters = {}) { // Recupera tutte le recensioni con filtri opzionali
        try {
            return await Recensione.find(filters).lean();
        } catch (error) {
            console.error('Errore durante il recupero delle recensioni:', error.message);
            throw error;
        }
    }
};

module.exports = recensioneDAO;