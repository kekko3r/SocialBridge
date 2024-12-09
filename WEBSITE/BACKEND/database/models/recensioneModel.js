const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recensioneSchema = new Schema({
    voto: {
        type: Number,
        required: true
    },
    commento: { 
        type: String,
        required: true 
    },
    autoreID: { 
        type: Schema.Types.ObjectId, 
        ref: 'Utente', 
        required: true 
    },
    eventoID: { 
        type: Schema.Types.ObjectId,
        ref: 'Evento', 
        required: true 
    }
});

const Recensione = mongoose.model('Recensione', recensioneSchema);
module.exports = Recensione;