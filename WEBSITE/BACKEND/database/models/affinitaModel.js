const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const affinitaSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'Utente', 
        required: true 
    },
    participantID: {
        type: Schema.Types.ObjectId,
        ref: 'Utente', 
        required: true 
    },
    rating: {
        type: Number,
        min: 0.5,
        max: 5 
    },
    comment: {
        type: String 
    },
    dataCreazione: {
        type: Date,
        default: Date.now 
    }
});

// Aggiunta di un indice combinato per migliorare le prestazioni nelle query
affinitaSchema.index({ user: 1, participantID: 1 }, { unique: true });

const Affinita = mongoose.model('Affinita', affinitaSchema);
module.exports = Affinita;