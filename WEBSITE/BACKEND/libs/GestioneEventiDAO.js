require('dotenv').config();
const mongoose = require('mongoose');
const Evento = require('../database/models/GestioneEventiModel'); // Assicurati che il percorso sia corretto
const Utente = require('../database/models/GestioneUtenteModel'); // Modello per Utente

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
            console.error("Errore durante la creazione dell'evento:", error.message);
            throw error;
        }
    },

    // Registra un utente all'evento
    async registerToEvent(eventID, userID) {
        try {
            const event = await Evento.findById(eventID);
            if (!event) {
                throw new Error("L'evento non esiste.");
            }

            if (event.pieno) {
                throw new Error("L'evento è pieno.");
            }

            if (!event.partecipanti) event.partecipanti = [];

            // Controlla se l'utente è già registrato all'evento
            if (event.partecipanti.includes(userID)) {
                throw new Error("L'utente è già registrato all'evento.");
            }

            event.partecipanti.push(userID);

            if (event.partecipanti.length >= event.partecipantiMAX) {
                event.pieno = true;
            }

            return await event.save();
        } catch (error) {
            console.error("Errore durante la registrazione all'evento:", error.message);
            throw error;
        }
    },

    // Rimuove un partecipante dall'evento
    async removeParticipant(eventID, userID) {
        try {
            if (!mongoose.Types.ObjectId.isValid(eventID)) {
                throw new Error("L'ID dell'evento non è valido.");
            }
            if (!mongoose.Types.ObjectId.isValid(userID)) {
                throw new Error("L'ID dell'utente non è valido.");
            }

            const event = await Evento.findById(eventID);
            if (!event) {
                throw new Error("Evento non trovato.");
            }

            // Rimuovi l'utente dai partecipanti
            event.partecipanti = event.partecipanti.filter(participant => participant.toString() !== userID.toString());

            // Aggiorna lo stato di "pieno" se necessario
            if (event.partecipanti.length < event.partecipantiMAX) {
                event.pieno = false;
            }

            return await event.save();
        } catch (error) {
            console.error("Errore durante la rimozione del partecipante:", error.message);
            throw error;
        }
    },

    // Aggiorna i campi dell'evento
    async updateEvent(eventID, { titolo, descrizione, data, ora, luogo, accessibilita, partecipantiMAX, pieno, labels }) {
        try {
            if (!mongoose.Types.ObjectId.isValid(eventID)) {
                throw new Error("L'ID dell'evento non è valido.");
            }
    
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
    
            const eventoAggiornato = await Evento.findByIdAndUpdate(eventID, updateData, { new: true });
    
            if (!eventoAggiornato) {
                throw new Error('Evento non trovato');
            }
    
            return eventoAggiornato;
        } catch (error) {
            console.error("Errore durante l'aggiornamento dell'evento:", error.message);
            throw error;
        }
    },

    // Cerca eventi con filtri multipli
    async searchEvents({ titolo, descrizione, data, ora, luogo, accessibilita, labels, organizzatoreID, partecipanti }) {
        try {
            const filters = {};
    
            // Aggiunta filtri dinamici se i parametri sono forniti
            if (titolo) filters.titolo = { $regex: new RegExp(titolo, 'i') }; // Ricerca case-insensitive
            if (descrizione) filters.descrizione = { $regex: new RegExp(descrizione, 'i') };
            if (data) {
                const parsedDate = new Date(data);
                if (isNaN(parsedDate)) {
                    throw new Error("La data fornita non è valida.");
                }
                filters.data = parsedDate; // Assicura che sia un oggetto Date
            }
            if (ora) filters.ora = ora;
            if (luogo) filters.luogo = { $regex: new RegExp(luogo, 'i') };
            if (accessibilita) filters.accessibilita = accessibilita;
    
            // Gestione array di labels con $all
            if (labels && Array.isArray(labels) && labels.length > 0) {
                filters.labels = { $all: labels }; // Tutte le etichette devono essere presenti
            }

            // Filtra per organizzatoreID
            if (organizzatoreID) {
                filters.organizzatoreID = organizzatoreID;
            }

            // Filtra per partecipanti
            if (partecipanti) {
                filters.partecipanti = partecipanti;
            }
    
            console.log("Filtri applicati:", filters); // Log per debug
    
            // Esegue la query con i filtri
            const eventi = await Evento.find(filters)
                .populate('organizzatoreID', 'nome email') // Popola campi dell'organizzatore
                .lean(); // Restituisce oggetti JS normali, non documenti Mongoose
    
            console.log("Eventi trovati:", eventi);
            return eventi;
        } catch (error) {
            console.error("Errore durante la ricerca degli eventi:", error.message);
            throw new Error("Errore nel recupero degli eventi");
        }
    },
    
    // Recupera tutti gli eventi
    async getAllEvents() {
        try {
            const events = await Evento.find({});
            return events;
        } catch (error) {
            console.error("Errore durante il recupero di tutti gli eventi:", error.message);
            throw new Error("Errore nel recupero di tutti gli eventi");
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

    // Recupera i partecipanti di un evento
    async getEventParticipants(eventID) {
        try {
            console.log(`Verifica dell'ID evento: ${eventID}`); // Debug log

            const event = await Evento.findById(eventID).populate('partecipanti');
            if (!event) {
                throw new Error("Evento non trovato con l'ID specificato");
            }
            return event.partecipanti;
        } catch (error) {
            console.error("Errore durante il recupero dei partecipanti dell'evento:", error.message);
            throw new Error("Errore nel recupero dei partecipanti dell'evento");
        }
    },

    // Elimina un evento dal database
    async deleteEvent(eventID) {
        try {
            if (!mongoose.Types.ObjectId.isValid(eventID)) {
                throw new Error("L'ID dell'evento non è valido.");
            }
    
            const evento = await Evento.findById(eventID);
    
            if (!evento) {
                return null; // Restituisci null se l'evento non viene trovato
            }
    
            // Controlla se la data dell'evento è nel passato
            const now = new Date();
            if (new Date(evento.data) < now) {
                throw new Error("Non è possibile eliminare un evento passato.");
            }
    
            const eventoEliminato = await Evento.findByIdAndDelete(eventID);
    
            return eventoEliminato;
        } catch (error) {
            console.error("Errore durante l'eliminazione dell'evento:", error.message);
            throw error;
        }
    }
};

module.exports = GestioneEventiDAO;