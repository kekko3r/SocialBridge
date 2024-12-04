const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const labelSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    descrizione: {
        type: String
    }
});

const Label = mongoose.model('Label', labelSchema);
module.exports = Label;