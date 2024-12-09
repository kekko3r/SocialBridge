const mongoose = require('mongoose');
const Schema = mongoose.Schema;

if (process.env.NODE_ENV !== 'test')
{
    const db=require('../conn');
}

const utenteSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    cognome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    ruolo: {
        type: String,
        required: true
    }
});

const Utente = mongoose.model('Utente', utenteSchema);
module.exports = Utente;