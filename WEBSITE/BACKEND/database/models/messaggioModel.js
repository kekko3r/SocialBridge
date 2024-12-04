const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messaggioSchema = new Schema({
    testo: { 
        type: String, 
        required: true 
    },
    timestamp: {
        type: Date, 
        default: Date.now 
    },
    mittenteID: { 
        type: Schema.Types.ObjectId, 
        ref: 'Utente', required: true 
    },
    destinatarioID: { 
        type: Schema.Types.ObjectId, 
        ref: 'Utente',
        required: true 
    }
});

const Messaggio = mongoose.model('Messaggio', messaggioSchema);
module.exports = Messaggio;