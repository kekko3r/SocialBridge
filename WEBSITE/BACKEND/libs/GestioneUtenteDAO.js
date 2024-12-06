require('dotenv').config();
const Utente = require('../models/GestioneUtenteModel'); // Modello per Utente

const GestioneUtenteDAO = {
    async registerUser({ email, password, nome, cognome, ruolo }) { // Registra un nuovo utente
        try {
            const nuovoUtente = new Utente({ email, password, nome, cognome, ruolo });
            return await nuovoUtente.save();
        } catch (error) {
            console.error('Errore durante la registrazione dell\'utente:', error);
            throw error;
        }
    },

    async loginUser({ email, password }) { // Esegui login dell'utente
        try {
            const utente = await Utente.findOne({ email, password });
            if (!utente) {
                throw new Error('Email o password errati.');
            }
            return utente;
        } catch (error) {
            console.error('Errore durante il login:', error);
            throw error;
        }
    },

    async updateProfile(userID, { email, password, nome, cognome, ruolo, interessi }) { // Aggiorna il profilo di un utente
        try {
            const updateData = {};
            if (email) updateData.email = email;
            if (password) updateData.password = password;
            if (nome) updateData.nome = nome;
            if (cognome) updateData.cognome = cognome;
            if (ruolo) updateData.ruolo = ruolo;
            if (interessi) updateData.interessi = interessi;

            return await Utente.findByIdAndUpdate(userID, updateData, { new: true });
        } catch (error) {
            console.error('Errore durante l\'aggiornamento del profilo:', error);
            throw error;
        }
    },

    async deleteUser(userID) { // Elimina un utente dal sistema
        try {
            return await Utente.findByIdAndDelete(userID);
        } catch (error) {
            console.error('Errore durante l\'eliminazione dell\'utente:', error);
            throw error;
        }
    },

    async getUserById(userID) { // Recupera un utente tramite ID
        try {
            if (!userID) {
                throw new Error('L\'ID dell\'utente è obbligatorio.');
            }
            const utente = await Utente.findById(userID);
            if (!utente) {
                throw new Error('Utente non trovato con l\'ID specificato.');
            }
            return utente;
        } catch (error) {
            console.error('Errore durante il recupero dell\'utente:', error);
            throw error;
        }
    }
};

module.exports = GestioneUtenteDAO;
