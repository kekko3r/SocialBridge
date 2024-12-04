const express = require('express');
const router = express.Router();
const Middleware = require('../libs/middleware');
const Logicabusiness1 =  require('../libs/logicabusiness1');

router.use(express.json()); //SERVE PER CONVERTIRE IN AUTOMATICO I DATI CHE MI MANDATE IN JSON DAL FRONTEND IN OGGETTI JAVASCRIPT

router
    //I METODI POSSONO ESSERE DI TIPO POST GET PUT DELETE SAPETE GIA COSA SIGNIFICANO
    .post('/continuoRotta/:id',Middleware(100,0),(req,res) => { //Se nell'index iniziava per /rotta1, quando entra qua dentro diventa /rotta1/continuoRotta/idchemettetedalfrontend quindi lo user dovra accedere a http://dominio:porta/rotta1/continuoRotta/idchemettetedalfrontend e potra entrare qua dentro; altro esempio piu concreto  http://dominio:porta/rotta1/continuoRotta/127642810/
    //RICORDATEVI CHE PRIMA DI ENTRARE QUI DENTRO ED AVETE MESSO IL MIDDLEWARE PRIMA, ESEGUIRA PRIMA IL MIDDLEWARE
    //UNA VOLTA DENTRO FATE I CONTROLLI (NON DI AUTENTICAZIONE PERCHE GIA LI HA FATTI IL MIDDLEWARE) E RITORNATE UNA RISPOSTA
    //PER USARE I DATI CHE MI INVIATE IN FORMATO JSON DAL FRONTEND SI TROVERANNO DENTRO req.body e ci posso accedere come req.body.parametrochemihaiinviato
    Logicabusiness1.getPerId(req.params.id).then((risposta) => {
        if(!risposta)
            return res.status(404).json({message: "Risposta not founded!"}); //RITORNO AL FRONTENT UNA RISPOSTA DI ERRORE CON CODICE 404
        return res.status(200).json(risposta); //INVIO I DATI CON CODICE 200 (ovvero tutt ok)
        //RISPOSTA SARA CONVERTITO DA OGGETTO JAVASCRIPT A JSON PER IL FRONTEND
        //IL FRONTEND DOVRA RICONVERTIRE DA JSON IN JS
    }).catch((err) => {
        console.log(err); //STAMPO SULLA CONSOLE
        return res.status(500).json({message: "Internal Server Error!"}); //RITORNO AL FRONTENT UNA RISPOSTA DI ERRORE CON CODICE 500
    });
    })
    .get('/continuoRottaDue/:id',Middleware(199,0),async (req,res) => { //STESSO ESEMPIO DI SOPRA NEL CASO NON VOGLIO USARE UNA THEN MA UN AWAIT/ASYNC, FANNO LA STESSA E IDENTICA COSA
        try{
        let risposta = await Logicabusiness1.getPerId(req.params.id);
        if(!risposta)
            return res.status(404).json({message: "Risposta not founded!"}); //RITORNO AL FRONTENT UNA RISPOSTA DI ERRORE CON CODICE 404
        return res.status(200).json(risposta); //INVIO I DATI CON CODICE 200 (ovvero tutt ok)
        //RISPOSTA SARA CONVERTITO DA OGGETTO JAVASCRIPT A JSON PER IL FRONTEND
        //IL FRONTEND DOVRA RICONVERTIRE DA JSON IN JS
        }catch(err)
        {
            console.log(err); //STAMPO SULLA CONSOLE
            return res.status(500).json({message: "Internal Server Error!"}); //RITORNO AL FRONTENT UNA RISPOSTA DI ERRORE CON CODICE 500
        }
    });

    //SE NON METTO LE AWAIT O LE THEN SIGNIFICA CHE VIENE ESEGUITO IN MANIERA ASINCRONA

module.exports = router; //ESPORTO LE ROTTE ALTRIMENTI NON LA POSSONO VEDERE