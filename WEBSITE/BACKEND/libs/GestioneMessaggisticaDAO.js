require('dotenv').config();
const mongoose = require('mongoose');
const Messaggio = require('../database/models/GestioneMessaggisticaModel');

const GestioneMessaggisticaDAO = {
    // Invia un messaggio testuale
    async sendMessage(mittenteID, destinatarioID, testo) {
        try {
            if (!mittenteID || !destinatarioID || !testo) {
                throw new Error("Tutti i campi obbligatori devono essere forniti (mittenteID, destinatarioID, testo).");
            }

            const newMessaggio = new Messaggio({ mittenteID, destinatarioID, testo });
            return await newMessaggio.save();
        } catch (err) {
            console.error(`Errore nell'invio del messaggio: ${err.message}`);
            throw new Error(`Errore nell'invio del messaggio: ${err.message}`);
        }
    },

    // Recupera la cronologia dei messaggi tra due utenti
    async getMessagesBetweenUsers(user1ID, user2ID) {
        try {
            if (!mongoose.Types.ObjectId.isValid(user1ID) || !mongoose.Types.ObjectId.isValid(user2ID)) {
                throw new Error("Gli ID degli utenti non sono validi.");
            }
    
            return await Messaggio.find({
                $or: [
                    { mittenteID: user1ID, destinatarioID: user2ID },
                    { mittenteID: user2ID, destinatarioID: user1ID }
                ]
            }).sort({ dataInvio: 1 }).exec();
        } catch (err) {
            console.error(`Errore nel recupero dei messaggi tra gli utenti: ${err.message}`);
            throw new Error(`Errore nel recupero dei messaggi tra gli utenti: ${err.message}`);
        }
    },

    // Notifica la ricezione di un messaggio
    async notifyMessage(destinatarioID, messaggioID) {
        try {
            if (!mongoose.Types.ObjectId.isValid(messaggioID) || !mongoose.Types.ObjectId.isValid(destinatarioID)) {
                throw new Error("L'ID del destinatario o del messaggio non è valido.");
            }
    
            const result = await Messaggio.findByIdAndUpdate(
                messaggioID,
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
    async sendMultimediaMessage(mittenteID, destinatarioID, media) {
        try {
            if (!mittenteID || !destinatarioID || !media) {
                throw new Error("Tutti i campi obbligatori devono essere forniti (mittenteID, destinatarioID, media).");
            }

            const newMessaggio = new Messaggio({
                mittenteID,
                destinatarioID,
                media
            });

            return await newMessaggio.save();
        } catch (err) {
            console.error(`Errore nell'invio del messaggio multimediale: ${err.message}`);
            throw new Error(`Errore nell'invio del messaggio multimediale: ${err.message}`);
        }
    },

    // Elimina un messaggio specifico
    async deleteMessage(messaggioID) {
        try {
            if (!mongoose.Types.ObjectId.isValid(messaggioID)) {
                throw new Error("L'ID del messaggio non è valido.");
            }
    
            const deletedMessaggio = await Messaggio.findByIdAndDelete(messaggioID).exec();
    
            if (!deletedMessaggio) {
                return null; // Restituisci null se il messaggio non viene trovato
            }
    
            return deletedMessaggio;
        } catch (err) {
            console.error(`Errore nell'eliminazione del messaggio: ${err.message}`);
            throw new Error(`Errore nell'eliminazione del messaggio: ${err.message}`);
        }
    },

    // Segna un messaggio come letto
    async markMessageAsRead(messaggioID, stato) { 
        try {
            if (!mongoose.Types.ObjectId.isValid(messaggioID) || stato !== "letto") {
                throw new Error("L'ID del messaggio non è valido o lo stato non è 'letto'.");
            }
    
            const updatedMessaggio = await Messaggio.findByIdAndUpdate(
                messaggioID,
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

module.exports = GestioneMessaggisticaDAO;