const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messaggioSchema = new Schema({
    mittenteID: {
        type: Schema.Types.ObjectId, // Assumiamo che sia un riferimento a un utente
        required: true,
        ref: 'Utente' // Nome del modello di riferimento (se esiste)
    },
    destinatarioID: {
        type: Schema.Types.ObjectId, // Anche questo un riferimento a un utente
        required: true,
        ref: 'Utente'
    },
    testo: {
        type: String,
        required: false, // Non obbligatorio, può essere null per i messaggi multimediali
        default: ''
    },
    media: {
        type: String, // Percorso del file multimediale o URL
        required: false // Non obbligatorio, solo per messaggi multimediali
    },
    stato: {
        type: String,
        enum: ['inviato', 'letto'], // Stati possibili
        default: 'inviato'
    },
    notificato: {
        type: Boolean,
        default: false // True se l'utente è stato notificato del messaggio
    },
    dataInvio: {
        type: Date,
        default: Date.now // Timestamp del momento dell'invio
    }
});

// Aggiunta di un indice combinato per migliorare le prestazioni nelle query
messaggioSchema.index({ mittenteID: 1, destinatarioID: 1, dataInvio: -1 });

const Messaggio = mongoose.model('Messaggio', messaggioSchema);

module.exports = Messaggio;