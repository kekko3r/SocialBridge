const messaggioDAO = require('../libs/GestioneMessagisticaDAO');

const GestioneMessagisticaController = {
    async sendMessage(req, res) {
        const { senderID, receiverID, text } = req.body;
        try {
            const result = await messaggioDAO.sendMessage(senderID, receiverID, text);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getMessagesBetweenUsers(req, res) {
        const { user1ID, user2ID } = req.query;
        try {
            const messages = await messaggioDAO.getMessagesBetweenUsers(user1ID, user2ID);
            res.status(200).json(messages);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async notifyMessage(req, res) {
        const { receiverID, messageID } = req.body;
        try {
            const result = await messaggioDAO.notifyMessage(receiverID, messageID);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async sendMultimediaMessage(req, res) {
        const { senderID, receiverID, media } = req.body;
        try {
            const result = await messaggioDAO.sendMultimediaMessage(senderID, receiverID, media);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async deleteMessage(req, res) {
        const { messageID } = req.body;
        try {
            const result = await messaggioDAO.deleteMessage(messageID);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async markMessageAsRead(req, res) {
        const { messageID, stato } = req.body;
        try {
            const result = await messaggioDAO.markMessageAsRead(messageID, stato);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = GestioneMessagisticaController;