require('dotenv').config(); //LE CREDENZIALI SE LE PRENDE DAL FILE .env
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Errore di connessione a MongoDB:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = db;

/* VECCHIA CONNESSIONE
// Connessione a MongoDB
mongoose.connect(mongoURL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => console.error('Errore di connessione a MongoDB:', err));
*/