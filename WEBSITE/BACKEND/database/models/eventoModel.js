const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventoSchema = new Schema({
    titolo:
    {
        type: String,
        required: true
    },
    descrizione:
    {
        type: String,
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    organizzatoreID: {
        type: Schema.Types.ObjectId,
        ref: 'Utente',
        required: true
    }
});

const Evento = mongoose.model('Evento', eventoSchema); //crea la collezione nel DB se non esiste
module.exports = Evento;
