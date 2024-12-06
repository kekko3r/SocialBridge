require('dotenv').config();
const mongoose = require('mongoose');
const Affinita = require('../database/models/affinitaModel');

const affinitaDAO = {
    async createAffinita(affinita) { //crea una nuova affinità nel database
        try {
            if (!affinita.utente1ID || !affinita.utente2ID || !affinita.punteggio) {
                throw new Error("Tutti i campi obbligatori devono essere forniti.");
            }

            const newAffinita = new Affinita(affinita);
            const result = await newAffinita.save();

            if (!result) {
                throw new Error("Impossibile salvare l'affinità.");
            }

            return result;
        } catch (err) {
            throw new Error(`Errore nella creazione dell'affinità: ${err.message}`);
        }
    },

    async findAffinita(utente1ID, utente2ID) { //cerca una affinità tra due utenti
        try {
            if (!utente1ID || !utente2ID) {
                throw new Error("Gli ID degli utenti non possono essere nulli.");
            }

            const affinita = await Affinita.findOne({
                $or: [
                    { utente1ID, utente2ID },
                    { utente1ID: utente2ID, utente2ID: utente1ID }
                ]
            }).exec();

            if (!affinita) {
                throw new Error("Affinità non trovata.");
            }

            return affinita;
        } catch (err) {
            throw new Error(`Errore nella ricerca dell'affinità: ${err.message}`);
        }
    },

    async findAffinitaByUtente(utenteID) { //cerca tutte le affinità di un determinato utente
        try {
            if (!utenteID) {
                throw new Error("L'ID dell'utente non può essere nullo.");
            }

            const affinità = await Affinita.find({
                $or: [{ utente1ID: utenteID }, { utente2ID: utenteID }]
            }).exec();

            if (!affinità || affinità.length === 0) {
                throw new Error("Nessuna affinità trovata per l'utente.");
            }

            return affinità;
        } catch (err) {
            throw new Error(`Errore nella ricerca delle affinità dell'utente: ${err.message}`);
        }
    },

    async updatePunteggio(utente1ID, utente2ID, nuovoPunteggio) { //aggiorna il punteggio di un'affinità tra due utenti specificati 
        try {
            if (!utente1ID || !utente2ID || !nuovoPunteggio) {
                throw new Error("Tutti i campi obbligatori devono essere forniti.");
            }

            const updatedAffinita = await Affinita.findOneAndUpdate(
                { utente1ID, utente2ID },
                { punteggio: nuovoPunteggio },
                { new: true }
            ).exec();

            if (!updatedAffinita) {
                throw new Error("Impossibile aggiornare il punteggio dell'affinità.");
            }

            return updatedAffinita;
        } catch (err) {
            throw new Error(`Errore nell'aggiornamento del punteggio: ${err.message}`);
        }
    },

    async deleteAffinita(utente1ID, utente2ID) { //elimina le affinità tra due utenti
        try {
            if (!utente1ID || !utente2ID) {
                throw new Error("Gli ID degli utenti non possono essere nulli.");
            }

            const deletedAffinita = await Affinita.findOneAndDelete({ utente1ID, utente2ID }).exec();

            if (!deletedAffinita) {
                throw new Error("Impossibile eliminare l'affinità.");
            }

            return deletedAffinita;
        } catch (err) {
            throw new Error(`Errore nell'eliminazione dell'affinità: ${err.message}`);
        }
    }
};

module.exports = affinitaDAO;