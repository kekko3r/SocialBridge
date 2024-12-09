require('dotenv').config();
const mongoose = require('mongoose');
const AssistenzaUtente = require('../database/models/GestioneAssistenzaUtenteModel'); // Modello per Assistenza Utente

const GestioneAssistenzaUtenteDAO = {
    // Invia una richiesta di supporto
    async submitSupportRequest({ userID, issueDetails, attachments = [] }) {
        try {
            if (!userID) {
                throw new Error('L\'ID dell\'utente è obbligatorio');
            }
            if (!issueDetails || issueDetails.trim() === '') {
                throw new Error('I dettagli del problema sono obbligatori');
            }

            const richiesta = new AssistenzaUtente({
                userID,
                issueDetails,
                attachments
            });

            return await richiesta.save();
        } catch (error) {
            console.error('Errore durante la creazione della richiesta di supporto:', error.message);
            throw error; // Rilancia l'errore originale
        }
    },

    // Recupera tutte le richieste di supporto di un utente
    async getSupportRequests(userID) {
        try {
            if (!userID) {
                throw new Error('L\'ID dell\'utente è obbligatorio');
            }

            const richieste = await AssistenzaUtente.find({ userID });

            return richieste;
        } catch (error) {
            console.error('Errore durante il recupero delle richieste di supporto:', error.message);
            throw error; // Rilancia l'errore originale
        }
    },

    // Risolve una richiesta di supporto
    async resolveSupportRequest(requestID, status) {
        try {
            if (!mongoose.Types.ObjectId.isValid(requestID)) {
                throw new Error('ID della richiesta non valido');
            }
            if (!['resolved', 'closed'].includes(status)) {
                throw new Error('Stato non valido per la risoluzione della richiesta');
            }

            const richiestaAggiornata = await AssistenzaUtente.findByIdAndUpdate(
                requestID,
                { status, updatedAt: new Date() },
                { new: true }
            );

            if (!richiestaAggiornata) {
                throw new Error('Richiesta di supporto non trovata');
            }

            return richiestaAggiornata;
        } catch (error) {
            console.error('Errore durante la risoluzione della richiesta di supporto:', error.message);
            throw error; // Rilancia l'errore originale
        }
    },

    // Elimina una richiesta di supporto
    async deleteSupportRequest(requestID) {
        try {
            if (!mongoose.Types.ObjectId.isValid(requestID)) {
                throw new Error('ID della richiesta non valido');
            }

            const richiestaEliminata = await AssistenzaUtente.findByIdAndDelete(requestID);

            if (!richiestaEliminata) {
                return null; // Restituisci null se la richiesta non viene trovata
            }

            return richiestaEliminata;
        } catch (error) {
            console.error('Errore durante l\'eliminazione della richiesta di supporto:', error.message);
            throw error; // Rilancia l'errore originale
        }
    }
};

module.exports = GestioneAssistenzaUtenteDAO;