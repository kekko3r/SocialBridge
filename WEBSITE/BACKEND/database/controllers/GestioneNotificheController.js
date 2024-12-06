const notificheDAO = require('../libs/GestioneNotificheDAO');
const Utente = require('../database/models/GestioneUtenteModel'); // Importa il modello Utente
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const notificheController = {

    // Recupera una notifica per ID
    async getById(req, res) {
        try {
            const notifica = await notificheDAO.getNotifications(req.params.id);
            if (!notifica) {
                return res.status(404).json({ message: 'Notifica non trovata' });
            }
            res.json(notifica);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Crea una nuova notifica
    async create(req, res) {
        const { userID, messaggio } = req.body;

        if (!userID || !messaggio) {
            return res.status(400).json({ message: "L'ID utente e il messaggio sono obbligatori." });
        }

        try {
            const notifica = await notificheDAO.sendNotification(userID, messaggio);
            res.status(201).json(notifica);
        } catch (err) {

            res.status(500).json({ message: "Errore durante l'invio della notifica." });
        }
    },

    // Aggiorna una notifica (segna come letta)
    async update(req, res) {
        const { notificationID } = req.body;

        if (!notificationID) {
            return res.status(400).json({ message: "L'ID della notifica è obbligatorio." });
        }

        try {
            const notifica = await notificheDAO.markNotificationAsRead(notificationID);
            if (!notifica) {
                return res.status(404).json({ message: 'Nessuna notifica trovata' });
            }
            res.json(notifica);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Invia una notifica via email
    async sendNotificationEmail(notifica) {
        try {
            // Recupera l'utente associato alla notifica
            const utente = await Utente.findById(notifica.userID);
            if (!utente) {
                throw new Error('Utente non trovato');
            }

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: utente.email, // Usa l'email dell'utente
                subject: 'Notifica SocialBridge',
                text: notifica.messaggio
            };

            await transporter.sendMail(mailOptions);
        } catch (err) {
            console.error('Errore nell\'invio dell\'email:', err);
        }
    }
};

module.exports = notificheController;