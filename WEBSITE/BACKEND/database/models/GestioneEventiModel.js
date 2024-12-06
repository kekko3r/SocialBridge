const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventoSchema = new Schema({
    titolo: {
        type: String,
        required: true
    },
    descrizione: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    ora: {
        type: String, // Può essere rappresentato come stringa o Date in base al formato
        required: true
    },
    luogo: {
        type: String,
        required: true
    },
    accessibilita: {
        type: String,
        required: true // Es.: "Accessibile per disabilità motoria"
    },
    partecipantiMAX: {
        type: Number,
        required: true
    },
    pieno: {
        type: Boolean,
        default: false
    },
    labels: {
        type: [String], // Array di etichette es.: ["Musica", "Outdoor"]
        default: []
    },
    organizzatoreID: {
        type: Schema.Types.ObjectId,
        ref: 'Utente', // Riferimento al modello Utente
        required: true
    },
    partecipanti: {
        type: [Schema.Types.ObjectId], // Array di ID di utenti registrati
        ref: 'Utente',
        default: []
    }
}, {
    timestamps: true // Aggiunge campi createdAt e updatedAt automaticamente
});

const Evento = mongoose.model('Evento', eventoSchema); // Crea la collezione nel DB se non esiste
module.exports = Evento;