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
    }
});

const Affinita = mongoose.model('Affinita', affinitaSchema);
module.exports = Affinita;