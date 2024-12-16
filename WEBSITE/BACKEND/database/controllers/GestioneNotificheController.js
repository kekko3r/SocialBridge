const notificheDAO = require('../../libs/GestioneNotificheDAO');
const Utente = require('../models/GestioneUtenteModel');
const nodemailer = require('nodemailer');

// Configurazione del trasportatore per nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const notificheController = {
    // Recupera tutte le notifiche di un utente
    async getNotifications(req, res) {
        try {
            const { userID } = req.params;

            if (!userID) {
                return res.status(400).json({ message: "L'ID utente è obbligatorio." });
            }

            const notifiche = await notificheDAO.getNotifications(userID);

            if (!notifiche || notifiche.length === 0) {
                return res.status(404).json({ message: 'Nessuna notifica trovata.' });
            }

            res.status(200).json(notifiche);
        } catch (err) {
            console.error('Errore in getNotifications:', err);
            res.status(500).json({ message: 'Errore durante il recupero delle notifiche.' });
        }
    },

    // Invia una nuova notifica
    async sendNotification(req, res) {
        const { userID, messaggio } = req.body;

        if (!userID || !messaggio) {
            return res.status(400).json({ message: "L'ID utente e il messaggio sono obbligatori." });
        }

        try {
            const notifica = await notificheDAO.sendNotification(userID, messaggio);

            // Prova a inviare una notifica email (non blocca il flusso principale)
            notificheController.sendNotificationEmail(notifica).catch((err) =>
                console.error('Errore durante l\'invio della notifica email:', err)
            );

            res.status(201).json(notifica);
        } catch (err) {
            console.error('Errore in sendNotification:', err);
            res.status(500).json({ message: "Errore durante la creazione della notifica." });
        }
    },

    // Segna una notifica come letta
    async markNotificationAsRead(req, res) {
        const { notificationID } = req.body;

        if (!notificationID) {
            return res.status(400).json({ message: "L'ID della notifica è obbligatorio." });
        }

        try {
            const notificaAggiornata = await notificheDAO.markNotificationAsRead(notificationID);

            if (!notificaAggiornata) {
                return res.status(404).json({ message: 'Notifica non trovata.' });
            }

            res.status(200).json(notificaAggiornata);
        } catch (err) {
            console.error('Errore in markNotificationAsRead:', err);
            res.status(500).json({ message: "Errore durante l'aggiornamento della notifica." });
        }
    },

    // Elimina una notifica
    async deleteNotification(req, res) {
        const { notificationID } = req.params;

        if (!notificationID) {
            return res.status(400).json({ message: "L'ID della notifica è obbligatorio." });
        }

        try {
            const notificaEliminata = await notificheDAO.deleteNotification(notificationID);

            if (!notificaEliminata) {
                return res.status(404).json({ message: 'Notifica non trovata.' });
            }

            res.status(200).json({ message: 'Notifica eliminata con successo.', notificaEliminata });
        } catch (err) {
            console.error('Errore in deleteNotification:', err);
            res.status(500).json({ message: "Errore durante l'eliminazione della notifica." });
        }
    },

    // Recupera tutte le notifiche
    async findAll(req, res) {
        try {
            const notifiche = await notificheDAO.findAll();

            if (!notifiche || notifiche.length === 0) {
                return res.status(404).json({ message: 'Nessuna notifica trovata.' });
            }

            res.status(200).json(notifiche);
        } catch (err) {
            console.error('Errore in findAll:', err);
            res.status(500).json({ message: 'Errore durante il recupero delle notifiche.' });
        }
    },

    // Invia una notifica via email
    async sendNotificationEmail(notifica) {
        try {
            // Recupera l'utente associato alla notifica
            const utente = await Utente.findById(notifica.userID);
            if (!utente) {
                throw new Error('Utente non trovato.');
            }

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: utente.email, // Usa l'email dell'utente
                subject: 'Notifica SocialBridge',
                text: notifica.messaggio
            };

            await transporter.sendMail(mailOptions);
            console.log('Email inviata con successo a:', utente.email);
        } catch (err) {
            console.error('Errore nell\'invio dell\'email:', err);
        }
    }
};

module.exports = notificheController;