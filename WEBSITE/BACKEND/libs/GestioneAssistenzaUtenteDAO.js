require('dotenv').config();
const AssistenzaUtente = require('../models/GestioneAssistenzaUtenteModel'); 

const GestioneAssistenzaUtenteDAO = {
    // Invia una richiesta di supporto
    async submitSupportRequest({ userID, issueDetails, attachments = [] }) {
        try {
            // Validazione dei parametri
            if (!userID) {
                throw new Error('L\'ID dell\'utente è obbligatorio');
            }
            if (!issueDetails || issueDetails.trim() === '') {
                throw new Error('I dettagli del problema sono obbligatori');
            }

            // Creazione della richiesta
            const richiesta = new AssistenzaUtente({
                userID,
                issueDetails,
                attachments
            });

            // Salvataggio nel database
            return await richiesta.save();
        } catch (error) {
            console.error('Errore durante la creazione della richiesta di supporto:', error.message);
            throw new Error('Errore nella creazione della richiesta di supporto');
        }
    },

    // Recupera tutte le richieste di supporto di un utente
    async getSupportRequests(userID) {
        try {
            // Validazione input
            if (!userID) {
                throw new Error('L\'ID dell\'utente è obbligatorio');
            }

            // Recupera le richieste di supporto filtrate per userID
            const richieste = await AssistenzaUtente.find({ userID });

            // Restituisce la lista di richieste
            return richieste;
        } catch (error) {
            console.error('Errore durante il recupero delle richieste di supporto:', error.message);
            throw new Error('Errore nel recupero delle richieste di supporto');
        }
    },

    // Risolve una richiesta di supporto
    async resolveSupportRequest(requestID, status) {
        try {
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
            throw new Error('Errore nella risoluzione della richiesta di supporto');
        }
    },

    // Elimina una richiesta di supporto
    async deleteSupportRequest(requestID) {
        try {
            const richiestaEliminata = await AssistenzaUtente.findByIdAndDelete(requestID);

            if (!richiestaEliminata) {
                throw new Error('Richiesta di supporto non trovata');
            }

            return richiestaEliminata;
        } catch (error) {
            console.error('Errore durante l\'eliminazione della richiesta di supporto:', error.message);
            throw new Error('Errore nell\'eliminazione della richiesta di supporto');
        }
    }
};

module.exports = GestioneAssistenzaUtenteDAO;