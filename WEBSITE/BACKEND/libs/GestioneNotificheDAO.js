require('dotenv').config();
const nodemailer = require('nodemailer');
const Notifiche = require('../database/models/GestioneNotificheModel');
const Utente = require('../database/models/GestioneUtenteModel'); // Modello per Utente
const senderEmail = 'socialbridgenotification@gmail.com';
const transporterData = {
    host: 'smtp.gmail.com',
    port: '465',
    secure: true,
    auth: {
        user: senderEmail,
        pass: process.env.NOTIFICATION_SERVICE_PASSWORD
    }
};


const GestioneNotificheDAO = {
    // Invia una notifica a un utente per davvero
    async sendNotificationReal(userID, messaggio) {
        try {
            
            // Validazione dei parametri
            if (!userID || !messaggio) {
                throw new Error('L\'ID utente e il messaggio sono obbligatori');
            }
            const utente = await Utente.findById(userID);
            if (!utente) {
                throw new Error('Utente non trovato con l\'ID specificato.');
            }
            const transporter = nodemailer.createTransport(transporterData);
            const mailOptions = {
                from: senderEmail,
                to: utente.email,
                subject: 'Notifica SocialBridge',
                html: '<p>'+messaggio+'</p>'
            }
            transporter.sendMail(mailOptions, (error, info) => {
                if(error){

                }else{
                    console.log('Email sent: '+info.response);
                }
            });
        } catch (error) {
            console.error('Errore durante l\'invio della notifica:', error.message);
            throw error;
        }
    },
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
            throw error;
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
                .select('userID messaggio letto dataInvio') // Seleziona campi necessari
                .sort({ dataInvio: -1 }); // Ordina per data di invio decrescente

            return notifiche;
        } catch (error) {
            console.error('Errore durante il recupero delle notifiche:', error.message);
            throw error;
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
            throw error;
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
            throw error;
        }
    },
};

module.exports = GestioneNotificheDAO;