require('dotenv').config();
const Messaggio = require('../models/GestioneMessagisticaModel');

const GestioneMessagisticaDAO = {
    // Invia un messaggio testuale
    async sendMessage(senderID, receiverID, text) {
        try {
            if (!senderID || !receiverID || !text) {
                throw new Error("Tutti i campi obbligatori devono essere forniti (mittenteID, destinatarioID, testo).");
            }

            const newMessaggio = new Messaggio({ mittenteID: senderID, destinatarioID: receiverID, testo: text });
            const result = await newMessaggio.save();

            if (!result) {
                throw new Error("Errore nel salvataggio del nuovo messaggio.");
            }

            return result;
        } catch (err) {
            console.error(`Errore nell'invio del messaggio: ${err.message}`);
            throw new Error(`Errore nell'invio del messaggio: ${err.message}`);
        }
    },

    // Recupera la cronologia dei messaggi tra due utenti
    async getMessagesBetweenUsers(user1ID, user2ID) {
        try {
            if (!user1ID || !user2ID) {
                throw new Error("Gli ID degli utenti non possono essere nulli.");
            }

            const messages = await Messaggio.find({
                $or: [
                    { mittenteID: user1ID, destinatarioID: user2ID },
                    { mittenteID: user2ID, destinatarioID: user1ID }
                ]
            }).exec();

            return messages;
        } catch (err) {
            console.error(`Errore nel recupero dei messaggi tra gli utenti: ${err.message}`);
            throw new Error(`Errore nel recupero dei messaggi tra gli utenti: ${err.message}`);
        }
    },

    // Notifica la ricezione di un messaggio
    async notifyMessage(receiverID, messageID) {
        try {
            if (!receiverID || !messageID) {
                throw new Error("L'ID del destinatario e del messaggio non possono essere nulli.");
            }

            const result = await Messaggio.findByIdAndUpdate(
                messageID,
                { notificato: true },
                { new: true }
            ).exec();

            if (!result) {
                throw new Error("Impossibile notificare il messaggio, ID non trovato.");
            }

            return result;
        } catch (err) {
            console.error(`Errore nella notifica del messaggio: ${err.message}`);
            throw new Error(`Errore nella notifica del messaggio: ${err.message}`);
        }
    },

    // Invia un messaggio multimediale
    async sendMultimediaMessage(senderID, receiverID, media) {
        try {
            if (!senderID || !receiverID || !media) {
                throw new Error("Tutti i campi obbligatori devono essere forniti (mittenteID, destinatarioID, media).");
            }

            const newMessaggio = new Messaggio({
                mittenteID: senderID,
                destinatarioID: receiverID,
                media
            });

            const result = await newMessaggio.save();

            if (!result) {
                throw new Error("Errore nel salvataggio del messaggio multimediale.");
            }

            return result;
        } catch (err) {
            console.error(`Errore nell'invio del messaggio multimediale: ${err.message}`);
            throw new Error(`Errore nell'invio del messaggio multimediale: ${err.message}`);
        }
    },

    // Elimina un messaggio specifico
    async deleteMessage(messageID) {
        try {
            if (!messageID) {
                throw new Error("L'ID del messaggio non può essere nullo.");
            }

            const deletedMessaggio = await Messaggio.findByIdAndDelete(messageID).exec();

            if (!deletedMessaggio) {
                throw new Error("Impossibile eliminare il messaggio, ID non trovato.");
            }

            return deletedMessaggio;
        } catch (err) {
            console.error(`Errore nell'eliminazione del messaggio: ${err.message}`);
            throw new Error(`Errore nell'eliminazione del messaggio: ${err.message}`);
        }
    },

    // Segna un messaggio come letto
    async markMessageAsRead(messageID, stato) {
        try {
            if (!messageID || stato !== "letto") {
                throw new Error("L'ID del messaggio non può essere nullo e lo stato deve essere 'letto'.");
            }

            const updatedMessaggio = await Messaggio.findByIdAndUpdate(
                messageID,
                { stato },
                { new: true }
            ).exec();

            if (!updatedMessaggio) {
                throw new Error("Impossibile aggiornare lo stato del messaggio, ID non trovato.");
            }

            return updatedMessaggio;
        } catch (err) {
            console.error(`Errore nel marcare il messaggio come letto: ${err.message}`);
            throw new Error(`Errore nel marcare il messaggio come letto: ${err.message}`);
        }
    }
};

module.exports = GestioneMessagisticaDAO;