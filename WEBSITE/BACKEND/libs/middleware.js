require('dotenv').config();
const jwt = require('jsonwebtoken');
const Utente = require('../database/models/GestioneUtenteModel');

function checkJwt(max = 1000, min = 0) {
    return async (req, res, next) => {
        // Ottieni il token JWT dagli header della richiesta
        let token = req.headers.authorization;
        // Verifica se il token esiste
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        // Dividi il token dal prefisso "Bearer"
        const tokenArray = token.split(' ');
        token = tokenArray[1];
        try {
            // Verifica il token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.otp) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            // Usa il token decodificato per ottenere le informazioni dell'utente e allegarle alla richiesta
            const user = await Utente.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.deleted || user.suspended) {
                return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
            }

            req.user = user;
            req.user.iat = decoded.iat;
            req.user.exp = decoded.exp;

            // Verifica i permessi dell'utente
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