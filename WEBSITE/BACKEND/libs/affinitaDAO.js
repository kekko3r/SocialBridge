require('dotenv').config();
const mongoose = require('mongoose');
const Affinita = require('../database/models/affinitaModel');
const { loginUser } = require('./GestioneUtenteDAO');

const affinitaDAO = {
    // Crea una nuova affinità (valutazione) nel database
    async createAffinita(affinitaData) {
        console.log("dentro dao AFFINIAà");
        try {
            const newAffinita = new Affinita(affinitaData);
            const savedAffinita = await newAffinita.save();
            return savedAffinita;
        } catch (err) {
            throw new Error(`Errore nella creazione dell'affinità: ${err.message}`);
        }
    },

    // Aggiorna il rating e il commento di un'affinità esistente
    async updateRatingAndComment(user, participantID, rating, comment) {
        console.log("dentro dao");
        try {
            console.log("dentro dao try");
            const updatedAffinita = await Affinita.findOneAndUpdate(
                { user, participantID },
                { rating, comment },
                { new: true }
            ).exec();

            if (!updatedAffinita) {
                throw new Error("Impossibile aggiornare il rating e il commento dell'affinità.");
            }
            console.log("dopo if dao");
            return updatedAffinita;
        } catch (err) {
            throw new Error(`Errore nell'aggiornamento del rating e del commento: ${err.message}`);
        }
    },

    // Recupera tutte le affinità (valutazioni) per un determinato evento
    async getAffinitaByEvent(eventId) {
        try {
            const affinita = await Affinita.find({ eventId }).exec();
            return affinita;
        } catch (err) {
            throw new Error(`Errore nel recupero delle affinità: ${err.message}`);
        }
    },

    // Elimina un'affinità
    async deleteAffinita(userId, ratedUserId) {
        try {
            const deletedAffinita = await Affinita.findOneAndDelete({ user: userId, participantID: ratedUserId }).exec();

            if (!deletedAffinita) {
                throw new Error("Impossibile eliminare l'affinità.");
            }

            return deletedAffinita;
        } catch (err) {
            throw new Error(`Errore nell'eliminazione dell'affinità: ${err.message}`);
        }
    },

    // Recupera tutte le affinità fatte da un utente
    async getAffinitaByUser(userId) {
        try {
            const affinita = await Affinita.find({ user: userId }).exec();

            if (!affinita || affinita.length === 0) {
                throw new Error("Nessuna affinità trovata per l'utente.");
            }

            return affinita;
        } catch (err) {
            throw new Error(`Errore nella ricerca delle affinità dell'utente: ${err.message}`);
        }
    }
};

module.exports = affinitaDAO;