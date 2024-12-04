require('dotenv').config();
const Evento = require('../database/models/eventoModel');

function getPerId(id) {
    return Evento.findOne({_id: id}).lean(); //LA FINDONE E LA LEAN ESISTONO GIA E FANNO PARTE DI MONGOOSE LA LIBRERIA CHE PERMETTE LA CONNESIONE CON MONDODB DA NODE.JS
}

//RICORDATEVI CHE TUTTE LE FUNZIONI DI MONGOOSE RITORNANO UNA PROMESSA (QUINDI SONO ASINCRONE), CHI SE LE RICHIAMA DOVRA GESTIRLE O CON AWAIT/ASYNC O CON THEN

function faccioCose(id,dati)
{
    //FACCIO COSE CON I DATI, FACCIO QUINDI LOGICA DI BUSINESS E POI LO RITORNO
    return; //RITORNO QUALCOSA. QUESTE CLASSI SONO LE UNICHE CHE POSSONO COMUNICARE CON I MODEL
    //ALTRIMENTO NON USO l'MVC BENE.
}

module.exports = { //COn questo importiamo le funzioni. Una funzione non scritta nell exports sarà privata
    getPerId,
    faccioCose
}