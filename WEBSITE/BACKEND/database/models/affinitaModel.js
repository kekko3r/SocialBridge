const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const affinitaSchema = new Schema({
    utente1ID: {
        type: Schema.Types.ObjectId,
        ref: 'Utente',
        required: true
    },
    utente2ID: {
        type: Schema.Types.ObjectId,
        ref: 'Utente',
        required: true
    },
    punteggio: {
        type: Number,
        required: true
    },
    dataCreazione: {
        type: Date,
        default: Date.now
    }
});

// Aggiunta di un indice combinato per migliorare le prestazioni nelle query
affinitaSchema.index({ utente1ID: 1, utente2ID: 1 }, { unique: true });

const Affinita = mongoose.model('Affinita', affinitaSchema);
module.exports = Affinita;