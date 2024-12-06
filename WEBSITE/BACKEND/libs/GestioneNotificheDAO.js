require('dotenv').config();
const Notifiche = require('../models/GestioneNotificheModel');

const GestioneNotificheDAO = {
    // Invia una notifica a un utente
    async sendNotification(userID, messaggio) {
        try {
            // Validazione dei parametri
            if (!userID || !messaggio) {
                throw new Error('L\'ID utente e il messaggio sono obbligatori');
            }

            // Creazione della notifica
            const notifica = new Notifiche({
                userID,
                messaggio
            });

            // Salvataggio nel database
            return await notifica.save();
        } catch (error) {
            console.error('Errore durante l\'invio della notifica:', error.message);
            throw new Error('Errore nell\'invio della notifica');
        }
    },

    // Recupera tutte le notifiche di un utente
    async getNotifications(userID) {
        try {
            // Validazione input
            if (!userID) {
                throw new Error('L\'ID utente è obbligatorio');
            }

            // Recupero delle notifiche per l'utente specifico
            const notifiche = await Notifiche.find({ userID })
                .select('messaggio letto dataInvio') // Seleziona campi necessari
                .sort({ dataInvio: -1 }); // Ordina per data di invio decrescente

            return notifiche;
        } catch (error) {
            console.error('Errore durante il recupero delle notifiche:', error.message);
            throw new Error('Errore nel recupero delle notifiche');
        }
    },

    // Segna una notifica come letta
    async markNotificationAsRead(notificationID) {
        try {
            // Validazione input
            if (!notificationID) {
                throw new Error('L\'ID della notifica è obbligatorio');
            }

            // Recupera la notifica per verificare se è già letta
            const notifica = await Notifiche.findById(notificationID);

            if (!notifica) {
                throw new Error('Notifica non trovata');
            }

            // Se la notifica è già letta, restituisci un messaggio
            if (notifica.letto) {
                return { message: 'La notifica è già stata letta' };
            }

            // Aggiorna la notifica per segnalarla come letta
            const notificaAggiornata = await Notifiche.findByIdAndUpdate(
                notificationID,
                { letto: true }, // Imposta lo stato "letto"
                { new: true } // Restituisce la notifica aggiornata
            );

            return notificaAggiornata;
        } catch (error) {
            console.error('Errore durante l\'aggiornamento della notifica:', error.message);
            throw new Error('Errore nell\'aggiornamento della notifica');
        }
    },

    // Elimina una notifica
    async deleteNotification(notificationID) {
        try {
            if (!notificationID) {
                throw new Error('L\'ID della notifica è obbligatorio');
            }

            const notificaEliminata = await Notifiche.findByIdAndDelete(notificationID);

            if (!notificaEliminata) {
                throw new Error('Notifica non trovata');
            }

            return notificaEliminata;
        } catch (error) {
            console.error('Errore durante l\'eliminazione della notifica:', error.message);
            throw new Error('Errore nell\'eliminazione della notifica');
        }
    },

    // Recupera tutte le notifiche
    async findAll() {
        try {
            return await Notifiche.find().lean();
        } catch (error) {
            console.error('Errore durante il recupero delle notifiche:', error.message);
            throw new Error('Errore nel recupero delle notifiche');
        }
    }
};

module.exports = GestioneNotificheDAO;