const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assistenzaUtenteSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'Utente', // Collega la richiesta di assistenza a un utente specifico
        required: true
    },
    issueDetails: {
        type: String,   // Descrizione del problema riportato dall'utente
        required: true 
    },
    attachments: {
        type: [String],   // Lista di percorsi o URL per file allegati (opzionale)
        default: [] 
    },
    status: {
        type: String,
        enum: ['open', 'in progress', 'resolved', 'closed'], // Stato della richiesta
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const AssistenzaUtente = mongoose.model('AssistenzaUtente', assistenzaUtenteSchema);
module.exports = AssistenzaUtente;