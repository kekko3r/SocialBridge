require('dotenv').config();
const Evento = require('../models/GestioneEventiModel');

const GestioneEventiDAO = {

    // Crea un nuovo evento nel database con validazione interna
    async createEvent({
        titolo,
        descrizione,
        data,
        ora,
        luogo,
        accessibilita,
        partecipantiMAX,
        labels = [],
        organizzatoreID,
    }) {
        try {
            // Controllo che tutti i campi richiesti siano forniti
            if (!titolo) throw new Error("Il titolo è obbligatorio");
            if (!descrizione) throw new Error("La descrizione è obbligatoria");
            if (!data) throw new Error("La data è obbligatoria");
            if (!ora) throw new Error("L'ora è obbligatoria");
            if (!luogo) throw new Error("Il luogo è obbligatorio");
            if (!accessibilita) throw new Error("Il campo accessibilità è obbligatorio");
            if (!partecipantiMAX || partecipantiMAX <= 0) throw new Error("Numero massimo partecipanti non valido");
            if (!organizzatoreID) throw new Error("L'organizzatore è obbligatorio");

            // Creazione dell'oggetto Evento
            const evento = new Evento({
                titolo,
                descrizione,
                data,
                ora,
                luogo,
                accessibilita,
                partecipantiMAX,
                labels,
                organizzatoreID,
            });

            return await evento.save();
        } catch (error) {
            console.error("Errore durante la creazione dell'evento:", error);
            throw error;
        }
    },

    // Registra un utente all'evento
    async registerToEvent(eventID, userID) {
        try {
            const event = await Evento.findById(eventID);
            if (!event || event.pieno) {
                throw new Error("L'evento è pieno o non esiste.");
            }

            if (!event.partecipanti) event.partecipanti = [];
            event.partecipanti.push(userID);

            if (event.partecipanti.length >= event.partecipantiMAX) {
                event.pieno = true;
            }

            return await event.save();
        } catch (error) {
            console.error("Errore durante la registrazione all'evento:", error);
            throw error;
        }
    },

    // Aggiorna i campi dell'evento
    async updateEvent(eventID, { titolo, descrizione, data, ora, luogo, accessibilita, partecipantiMAX, pieno, labels }) {
        try {
            const updateData = {};

            if (titolo) updateData.titolo = titolo;
            if (descrizione) updateData.descrizione = descrizione;
            if (data) updateData.data = data;
            if (ora) updateData.ora = ora;
            if (luogo) updateData.luogo = luogo;
            if (accessibilita) updateData.accessibilita = accessibilita;
            if (partecipantiMAX) updateData.partecipantiMAX = partecipantiMAX;
            if (pieno !== undefined) updateData.pieno = pieno;
            if (labels) updateData.labels = labels;

            return await Evento.findByIdAndUpdate(eventID, updateData, { new: true });
        } catch (error) {
            console.error("Errore durante l'aggiornamento dell'evento:", error);
            throw error;
        }
    },

    // Cerca eventi con filtri multipli
    async searchEvents({ titolo, descrizione, data, ora, luogo, accessibilita, labels }) {
        try {
            const filters = {};

            if (titolo) filters.titolo = { $regex: new RegExp(titolo, 'i') };
            if (descrizione) filters.descrizione = { $regex: new RegExp(descrizione, 'i') };
            if (data) filters.data = data;
            if (ora) filters.ora = ora;
            if (luogo) filters.luogo = { $regex: new RegExp(luogo, 'i') };
            if (accessibilita) filters.accessibilita = accessibilita;
            if (labels && labels.length > 0) filters.labels = { $all: labels };

            return await Evento.find(filters).populate('organizzatoreID', 'nome email');
        } catch (error) {
            console.error("Errore durante la ricerca degli eventi:", error);
            throw error;
        }
    },

    // Fornisce i dettagli di un evento cercato dall'ID
    async getEventDetails(eventID) {
        try {
            if (!eventID) {
                throw new Error("L'ID dell'evento è obbligatorio");
            }
            const event = await Evento.findById(eventID);

            if (!event) {
                throw new Error("Evento non trovato con l'ID specificato");
            }
            return event;
        } catch (error) {
            console.error("Errore durante il recupero dei dettagli dell'evento:", error.message);
            throw new Error("Errore nel recupero dei dettagli dell'evento");
        }
    },

    // Elimina un evento dal database
    async deleteEvent(eventID) {
        try {
            return await Evento.findByIdAndDelete(eventID);
        } catch (error) {
            console.error("Errore durante l'eliminazione dell'evento:", error);
            throw error;
        }
    }

}

module.exports = GestioneEventiDAO;