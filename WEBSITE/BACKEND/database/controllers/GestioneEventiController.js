const eventDAO = require('../../libs/GestioneEventiDAO');

const GestioneEventiController = {
    async getEventDetails(req, res) {
        try {
            const event = await eventDAO.getEventDetails(req.params.id);
            if (!event) {
                return res.status(404).json({ message: 'Evento non trovato' });
            }
            res.json(event);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async createEvent(req, res) {
        try {
            const event = await eventDAO.createEvent(req.body);
            res.status(201).json(event);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    async updateEvent(req, res) {
        try {
            const event = await eventDAO.updateEvent(req.params.id, req.body);
            if (!event) {
                return res.status(404).json({ message: 'Evento non trovato' });
            }
            res.json(event);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    async deleteEvent(req, res) {
        try {
            const event = await eventDAO.deleteEvent(req.params.id);
            if (!event) {
                return res.status(404).json({ message: 'Evento non trovato' });
            }
            res.json({ message: 'Evento eliminato' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async removeParticipant(req, res) {
        const { eventID, userID } = req.params;
        try {
            const updatedEvent = await eventDAO.removeParticipant(eventID, userID);
            res.status(200).json(updatedEvent);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    async getEventParticipants(req, res) {
        try {
            console.log(`Verifica dell'ID evento: ${req.params.eventID}`); // Debug log
            const partecipanti = await eventDAO.getEventParticipants(req.params.eventID);
            res.json(partecipanti);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    
    async registerToEvent(req, res) {
        try {
            const event = await eventDAO.registerToEvent(req.params.eventID, req.params.userID);
            res.json(event);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    async searchEvents(req, res) {
        try {
            const events = await eventDAO.searchEvents(req.query);
            res.json(events);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    async getAllEvents(req, res) {
        try {
            const events = await eventDAO.getAllEvents();
            res.json(events);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = GestioneEventiController;