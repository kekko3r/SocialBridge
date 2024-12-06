const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const GestioneEventiDAO = require('../../libs/GestioneEventiDAO');
const Evento = require('../../database/models/GestioneEventiModel');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Evento.deleteMany(); // Pulisce il database tra i test
});

describe('GestioneEventiDAO', () => {
    describe('createEvent', () => {
        test('should create a new event with valid input', async () => {
            const newEvent = {
                titolo: 'Evento Test',
                descrizione: 'Descrizione di prova',
                data: new Date('2024-12-31'),
                ora: '18:00',
                luogo: 'Roma',
                accessibilita: 'Accessibile',
                partecipantiMAX: 100,
                organizzatoreID: new mongoose.Types.ObjectId(),
            };

            const eventoCreato = await GestioneEventiDAO.createEvent(newEvent);

            expect(eventoCreato).toBeDefined();
            expect(eventoCreato.titolo).toBe(newEvent.titolo);
            expect(eventoCreato.descrizione).toBe(newEvent.descrizione);
        });

        test('should throw an error if required fields are missing', async () => {
            const newEvent = {
                descrizione: 'Descrizione di prova',
                data: new Date('2024-12-31'),
                ora: '18:00',
                luogo: 'Roma',
                accessibilita: 'Accessibile',
                partecipantiMAX: 100,
                organizzatoreID: new mongoose.Types.ObjectId(),
            };

            await expect(GestioneEventiDAO.createEvent(newEvent)).rejects.toThrow('Il titolo è obbligatorio');
        });

        test('should throw an error if partecipantiMAX is invalid', async () => {
            const newEvent = {
                titolo: 'Evento Test',
                descrizione: 'Descrizione di prova',
                data: new Date('2024-12-31'),
                ora: '18:00',
                luogo: 'Roma',
                accessibilita: 'Accessibile',
                partecipantiMAX: -1,
                organizzatoreID: new mongoose.Types.ObjectId(),
            };

            await expect(GestioneEventiDAO.createEvent(newEvent)).rejects.toThrow('Numero massimo partecipanti non valido');
        });
    });

    describe('registerToEvent', () => {
        test('should register a user to an event', async () => {
            const evento = await Evento.create({
                titolo: 'Evento Test',
                descrizione: 'Descrizione di prova',
                data: new Date('2024-12-31'),
                ora: '18:00',
                luogo: 'Roma',
                accessibilita: 'Accessibile',
                partecipantiMAX: 2,
                organizzatoreID: new mongoose.Types.ObjectId(),
            });

            const userID = new mongoose.Types.ObjectId();

            const eventoAggiornato = await GestioneEventiDAO.registerToEvent(evento._id, userID);

            expect(eventoAggiornato.partecipanti).toContainEqual(userID);
            expect(eventoAggiornato.pieno).toBe(false);

            // Registrazione di un secondo utente, evento diventa pieno
            const userID2 = new mongoose.Types.ObjectId();
            const eventoPieno = await GestioneEventiDAO.registerToEvent(evento._id, userID2);

            expect(eventoPieno.partecipanti).toContainEqual(userID2);
            expect(eventoPieno.pieno).toBe(true);
        });

        test('should throw an error if event is full', async () => {
            const evento = await Evento.create({
                titolo: 'Evento Test',
                descrizione: 'Descrizione di prova',
                data: new Date('2024-12-31'),
                ora: '18:00',
                luogo: 'Roma',
                accessibilita: 'Accessibile',
                partecipantiMAX: 1,
                organizzatoreID: new mongoose.Types.ObjectId(),
                partecipanti: [new mongoose.Types.ObjectId()],
                pieno: true,
            });

            const userID = new mongoose.Types.ObjectId();

            await expect(GestioneEventiDAO.registerToEvent(evento._id, userID)).rejects.toThrow("L'evento è pieno o non esiste.");
        });

        test('should throw an error if event does not exist', async () => {
            const nonExistingEventID = new mongoose.Types.ObjectId();
            const userID = new mongoose.Types.ObjectId();

            await expect(GestioneEventiDAO.registerToEvent(nonExistingEventID, userID)).rejects.toThrow("L'evento è pieno o non esiste.");
        });
    });

    describe('updateEvent', () => {
        test('should update event details', async () => {
            const evento = await Evento.create({
                titolo: 'Vecchio Titolo',
                descrizione: 'Vecchia Descrizione',
                data: new Date('2024-12-31'),
                ora: '18:00',
                luogo: 'Roma',
                accessibilita: 'Accessibile',
                partecipantiMAX: 100,
                organizzatoreID: new mongoose.Types.ObjectId(),
            });

            const aggiornamenti = { titolo: 'Nuovo Titolo', descrizione: 'Nuova Descrizione' };
            const eventoAggiornato = await GestioneEventiDAO.updateEvent(evento._id, aggiornamenti);

            expect(eventoAggiornato.titolo).toBe(aggiornamenti.titolo);
            expect(eventoAggiornato.descrizione).toBe(aggiornamenti.descrizione);
        });

        test('should throw an error if event ID is invalid', async () => {
            const invalidEventID = 'invalid-id';
            const aggiornamenti = { titolo: 'Nuovo Titolo', descrizione: 'Nuova Descrizione' };

            await expect(GestioneEventiDAO.updateEvent(invalidEventID, aggiornamenti)).rejects.toThrow();
        });

        test('should throw an error if event does not exist', async () => {
            const nonExistingEventID = new mongoose.Types.ObjectId();
            const aggiornamenti = { titolo: 'Nuovo Titolo', descrizione: 'Nuova Descrizione' };

            await expect(GestioneEventiDAO.updateEvent(nonExistingEventID, aggiornamenti)).rejects.toThrow('Evento non trovato');
        });
    });

    describe('searchEvents', () => {
        test('should return events with specific filters', async () => {
            await Evento.create([
                {
                    titolo: 'Musica Live',
                    descrizione: 'Concerto all’aperto',
                    data: new Date('2024-12-31'),
                    ora: '21:00',
                    luogo: 'Milano',
                    accessibilita: 'Accessibile',
                    partecipantiMAX: 200,
                    organizzatoreID: new mongoose.Types.ObjectId(),
                    labels: ['Musica', 'Outdoor'],
                },
                {
                    titolo: 'Teatro Comico',
                    descrizione: 'Serata di teatro',
                    data: new Date('2024-12-20'),
                    ora: '20:00',
                    luogo: 'Roma',
                    accessibilita: 'Accessibile',
                    partecipantiMAX: 150,
                    organizzatoreID: new mongoose.Types.ObjectId(),
                    labels: ['Teatro', 'Commedia'],
                },
            ]);

            const filtri = { labels: ['Musica'] };
            const risultati = await GestioneEventiDAO.searchEvents(filtri);

            expect(risultati).toHaveLength(1);
            expect(risultati[0].titolo).toBe('Musica Live');
            expect(risultati[0].labels).toContain('Musica');
        });

        test('should return an empty array if no events match the filters', async () => {
            const filtri = { labels: ['NonEsistente'] };
            const risultati = await GestioneEventiDAO.searchEvents(filtri);

            expect(risultati).toHaveLength(0);
        });

        test('should throw an error if filters are invalid', async () => {
            const filtri = { data: 'invalid-date' };

            await expect(GestioneEventiDAO.searchEvents(filtri)).rejects.toThrow();
        });
    });

    describe('deleteEvent', () => {
        test('should delete an existing event', async () => {
            const evento = await Evento.create({
                titolo: 'Evento Test',
                descrizione: 'Descrizione di prova',
                data: new Date('2024-12-31'),
                ora: '18:00',
                luogo: 'Roma',
                accessibilita: 'Accessibile',
                partecipantiMAX: 100,
                organizzatoreID: new mongoose.Types.ObjectId(),
            });

            const risultato = await GestioneEventiDAO.deleteEvent(evento._id);

            expect(risultato._id).toEqual(evento._id);

            const eventoCancellato = await Evento.findById(evento._id);
            expect(eventoCancellato).toBeNull();
        });

        test('should return null for a non-existing event', async () => {
            const nonExistingEventID = new mongoose.Types.ObjectId();

            const risultato = await GestioneEventiDAO.deleteEvent(nonExistingEventID);

            expect(risultato).toBeNull();
        });

        test('should throw an error for an invalid event ID', async () => {
            const invalidEventID = 'invalid-id';

            await expect(GestioneEventiDAO.deleteEvent(invalidEventID)).rejects.toThrow();
        });
    });
});