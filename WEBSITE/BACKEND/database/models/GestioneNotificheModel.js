const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificaSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'Utente',      // Collega la notifica a un utente specifico
        required: true
    },
    messaggio: {
        type: String,
        required: true
    },
    letto: {
        type: Boolean,
        default: false    // Le notifiche sono non lette di default
    }, 
    dataInvio: {
        type: Date,
        default: Date.now // Data e ora di creazione
    }
});

const Notifiche = mongoose.model('Notifiche', notificaSchema);
module.exports = Notifiche;