require('dotenv').config();
const jwt = require('jsonwebtoken');
const Utente = require('../database/models/utenteModel');

//IL MIDDLEWARE E UNA FUNZIONE CHE SI FRAPPONE TRA LA CHIAMATA DELLA ROTTA E IL CONTROLLE.
//QUINDI VIENE ESEGUITO PRIMA IL MIDDLEWARE E POI IL CONTROLLER
//E UTILE QUANDO SI DEVE VERIFICARE L'AUTENTICAZIONE
//COSI SI SCRIVE UN SOLO CODICE E VALE PER TUTTI
//SENZA SCRVERE PER OGNI CONTROLLER SE SI E FATTI l'AUTENTICAZIONEù
//OVVIAMENTE QUESTA FUNZIONE VA ALLEGATA AD OGNI CONTROLLER
//SI FA USO DEL TOKEN JWT, IN POCHE PAROLE POSSIAMO CREARE UN TOKEN CHE DIAMO IN FRONTEND
//IL FRONTEND SI METTERA IN SESSIONE QUESTO TOKEN E OGNI VOLTA CHE HA BISOGNO DI QUALCOSA DAL BACKEND
//GLIE LO INVIA NELL HEADER HTTP CON AUTENTICAZIONE BARER (SARA SEMPLICE)
//IL BACKEND COME VEDETE DA QUESTA FUNZIONE PRENDE IL TOKEN DALL HEADER E TRAMITE LA LIBRERIA JWT 
//OTTIENE UN OGGETTO. IN QUEST OGGETTO CI SONO TUTTE LE INFO DELL UTENTE
//DI UN UTENTE CI POSSIAMO SALVARE UN NUMERO AD ESEMPIO 0 SE ADMIN 100 SE UTENTE REGISTRATO
//IN BASE AL NUMERETTO UNO VERIFICA SE HA I PERMESSI O NO
//PRENDETELO COME ESEMPIO PER INIZIARE POI VI SPIEGHERO, ANZI MOLTO PROB VI DARO IL CODICE GIA FATTO

function checkJwt(max = 1000, min = 0) {
    return async (req, res, next) => {
        // Get the JWT token from the request headers
        let token = req.headers.authorization;
        // Check if the token exists
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        //split from BEARER
        const tokenArray = token.split(' ');
        token = tokenArray[1];
        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.otp) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            // Use the decoded token to get user info and attach it in the request object

            req.user = await Esempio1.findOne({_id: decoded.id});

            if(req.user.deleted || req.user.suspended){
                return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
            }

            req.user.iat = decoded.iat;
            req.user.exp = decoded.exp;

            // Call the next middleware
            if ((req.user.group < min || req.user.group > max) && req.user.group !== 0) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
}

module.exports = checkJwt;