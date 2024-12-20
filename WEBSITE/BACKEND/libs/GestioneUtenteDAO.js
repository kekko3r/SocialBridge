require('dotenv').config();
const Utente = require('../database/models/GestioneUtenteModel'); // Modello per Utente
const bcrypt = require('bcrypt');

const GestioneUtenteDAO = {
    async registerUser({ email, password, nome, cognome }) {
        try {
            // Controlla se tutti i campi obbligatori sono forniti
            if (!email || !password || !nome || !cognome) {
                throw new Error('Tutti i campi obbligatori devono essere forniti.');
            }

            // Controlla se l'email esiste già
            const existingUser = await Utente.findOne({ email });
            if (existingUser) {
                throw new Error('Errore durante la registrazione dell\'utente: email già esistente');
            }

            // Crea un nuovo utente
            const hashedPassword = await bcrypt.hash(password, 10);
            const nuovoUtente = new Utente({ email, password: hashedPassword, nome, cognome });
            return await nuovoUtente.save();
        } catch (error) {
            console.error('Errore durante la registrazione dell\'utente:', error.message);
            throw new Error(error.message);
        }
    },

    async loginUser({ email, password }) { // Esegui login dell'utente
        try {
            const utente = await Utente.findOne({ email });
            if (!utente) {
                throw new Error('Email o password errati.');
            }

            const isPasswordValid = await bcrypt.compare(password, utente.password);
            if (!isPasswordValid) {
                throw new Error('Email o password errati.');
            }

            return utente;
        } catch (error) {
            console.error('Errore durante il login:', error.message);
            throw new Error(error.message);
        }
    },

    async updateProfile(userID, { email, password, nome, cognome }) {
        try {
            const updateData = {};
            if (email) updateData.email = email;
            if (password) updateData.password = await bcrypt.hash(password, 10);
            if (nome) updateData.nome = nome;
            if (cognome) updateData.cognome = cognome;

            return await Utente.findByIdAndUpdate(userID, updateData, { new: true });
        } catch (error) {
            console.error('Errore durante l\'aggiornamento del profilo:', error.message);
            throw new Error('Errore durante l\'aggiornamento del profilo');
        }
    },

    async deleteUser(userID) { // Elimina un utente dal sistema
        try {
            return await Utente.findByIdAndDelete(userID);
        } catch (error) {
            console.error('Errore durante l\'eliminazione dell\'utente:', error.message);
            throw new Error('Errore durante l\'eliminazione dell\'utente');
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
            console.error('Errore durante il recupero dell\'utente:', error.message);
            throw new Error('Errore durante il recupero dell\'utente');
        }
    },

    async searchByName(nome, cognome) {
        try {
            const query = {};
            if (nome) {
                query.nome = { $regex: `^${nome}`, $options: 'i' }; // Case-insensitive regex per nome
            }
            if (cognome) {
                query.cognome = { $regex: `^${cognome}`, $options: 'i' }; // Case-insensitive regex per cognome
            }
            const utenti = await Utente.find(query);
            return utenti;
        } catch (error) {
            console.error('Errore durante la ricerca di un utente:', error.message);
            throw new Error('Errore durante la ricerca dell\'utente');
        }
    }
};

module.exports = GestioneUtenteDAO;