const affinitaDAO = require('../../libs/affinitaDAO');

const GestioneAffinitaController = {
    async createAffinita(req, res) {
        const { user, participantID, rating, comment } = req.body;

        console.log("dopo req.body");
        console.log("user:", user);
        console.log("PartecipantId:", participantID);
        console.log("rating:", rating);
        console.log("comment:", comment);

        if (!user || !participantID || rating === undefined) {
            return res.status(400).json({ message: "Tutti i campi obbligatori devono essere forniti (userId, ratedUserId, eventId, rating)." });
        }

        try {
            console.log("Mannaggia a shrek");
            const newAffinita = await affinitaDAO.createAffinita({ user, participantID, rating, comment });
            console.log("Bravo a shrek");
            res.status(201).json(newAffinita);
        } catch (err) {
            console.error(`Errore durante la creazione dell'affinità: ${err.message}`);
            res.status(500).json({ message: "Errore durante la creazione dell'affinità." });
        }
    },

    async updateRatingAndComment(req, res) {

        console.log(req.body);

        const { user, participantID, rating, comment } = req.body;

        console.log("dopo req.body");
        console.log("userId:", user);
        console.log("ratedUserId:", participantID);
        console.log("rating:", rating);
        console.log("comment:", comment);



       

        if (!user || !participantID || rating === undefined) {
            return res.status(400).json({ message: "Tutti i campi obbligatori devono essere forniti (userId, ratedUserId, rating)." });
        }

        console.log("dopo if");

        try {
            console.log("dentro try");
            const updatedAffinita = await affinitaDAO.updateRatingAndComment(user, participantID, rating, comment);
            res.status(200).json(updatedAffinita);
        } catch (err) {
            console.error(`Errore durante l'aggiornamento del rating e del commento: ${err.message}`);
            res.status(500).json({ message: "Errore durante l'aggiornamento del rating e del commento." });
        }
    },

    async deleteAffinita(req, res) {
        const { userId, ratedUserId, eventId } = req.body;

        if (!userId || !ratedUserId || !eventId) {
            return res.status(400).json({ message: "Tutti i campi obbligatori devono essere forniti (userId, ratedUserId, eventId)." });
        }

        try {
            const deletedAffinita = await affinitaDAO.deleteAffinita(userId, ratedUserId, eventId);
            res.status(200).json({ message: "Affinità eliminata con successo.", deletedAffinita });
        } catch (err) {
            console.error(`Errore durante l'eliminazione dell'affinità: ${err.message}`);
            res.status(500).json({ message: "Errore durante l'eliminazione dell'affinità." });
        }
    },

    async getAffinitaByUser(req, res) {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "L'ID dell'utente non può essere nullo." });
        }

        try {
            const affinita = await affinitaDAO.getAffinitaByUser(userId);
            res.status(200).json(affinita);
        } catch (err) {
            console.error(`Errore durante la ricerca delle affinità dell'utente: ${err.message}`);
            res.status(500).json({ message: "Errore durante la ricerca delle affinità dell'utente." });
        }
    }
};

module.exports = GestioneAffinitaController;
