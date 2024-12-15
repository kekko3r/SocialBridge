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

//------------------------------------------createEvent-------------------------------------------------------------------------

describe('createEvent', () => {
    test('should create a new event with valid input (case 1)', async () => {
        const newEvent = {
            titolo: 'Evento Test 1',
            descrizione: 'Descrizione di prova 1',
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

    test('should create a new event with valid input (case 2)', async () => {
        const newEvent = {
            titolo: 'Evento Test 2',
            descrizione: 'Descrizione di prova 2',
            data: new Date('2024-11-30'),
            ora: '19:00',
            luogo: 'Milano',
            accessibilita: 'Non accessibile',
            partecipantiMAX: 50,
            organizzatoreID: new mongoose.Types.ObjectId(),
        };

        const eventoCreato = await GestioneEventiDAO.createEvent(newEvent);

        expect(eventoCreato).toBeDefined();
        expect(eventoCreato.titolo).toBe(newEvent.titolo);
        expect(eventoCreato.descrizione).toBe(newEvent.descrizione);
    });

    test('should create a new event with valid input (case 3)', async () => {
        const newEvent = {
            titolo: 'Evento Test 3',
            descrizione: 'Descrizione di prova 3',
            data: new Date('2024-10-15'),
            ora: '20:00',
            luogo: 'Napoli',
            accessibilita: 'Accessibile',
            partecipantiMAX: 200,
            organizzatoreID: new mongoose.Types.ObjectId(),
        };

        const eventoCreato = await GestioneEventiDAO.createEvent(newEvent);

        expect(eventoCreato).toBeDefined();
        expect(eventoCreato.titolo).toBe(newEvent.titolo);
        expect(eventoCreato.descrizione).toBe(newEvent.descrizione);
    });

    test('should throw an error if required fields are missing (case 1)', async () => {
        const newEvent = {
            descrizione: 'Descrizione di prova 1',
            data: new Date('2024-12-31'),
            ora: '18:00',
            luogo: 'Roma',
            accessibilita: 'Accessibile',
            partecipantiMAX: 100,
            organizzatoreID: new mongoose.Types.ObjectId(),
        };

        await expect(GestioneEventiDAO.createEvent(newEvent)).rejects.toThrow('Il titolo è obbligatorio');
    });

    test('should throw an error if required fields are missing (case 2)', async () => {
        const newEvent = {
            titolo: 'Evento Test 2',
            data: new Date('2024-11-30'),
            ora: '19:00',
            luogo: 'Milano',
            accessibilita: 'Non accessibile',
            partecipantiMAX: 50,
            organizzatoreID: new mongoose.Types.ObjectId(),
        };

        await expect(GestioneEventiDAO.createEvent(newEvent)).rejects.toThrow('La descrizione è obbligatoria');
    });

    test('should throw an error if required fields are missing (case 3)', async () => {
        const newEvent = {
            titolo: 'Evento Test 3',
            descrizione: 'Descrizione di prova 3',
            ora: '20:00',
            luogo: 'Napoli',
            accessibilita: 'Accessibile',
            partecipantiMAX: 200,
            organizzatoreID: new mongoose.Types.ObjectId(),
        };

        await expect(GestioneEventiDAO.createEvent(newEvent)).rejects.toThrow('La data è obbligatoria');
    });

    test('should throw an error if partecipantiMAX is invalid (case 1)', async () => {
        const newEvent = {
            titolo: 'Evento Test 1',
            descrizione: 'Descrizione di prova 1',
            data: new Date('2024-12-31'),
            ora: '18:00',
            luogo: 'Roma',
            accessibilita: 'Accessibile',
            partecipantiMAX: -1,
            organizzatoreID: new mongoose.Types.ObjectId(),
        };

        await expect(GestioneEventiDAO.createEvent(newEvent)).rejects.toThrow('Numero massimo partecipanti non valido');
    });

    test('should throw an error if partecipantiMAX is invalid (case 2)', async () => {
        const newEvent = {
            titolo: 'Evento Test 2',
            descrizione: 'Descrizione di prova 2',
            data: new Date('2024-11-30'),
            ora: '19:00',
            luogo: 'Milano',
            accessibilita: 'Non accessibile',
            partecipantiMAX: 0,
            organizzatoreID: new mongoose.Types.ObjectId(),
        };

        await expect(GestioneEventiDAO.createEvent(newEvent)).rejects.toThrow('Numero massimo partecipanti non valido');
    });

    test('should throw an error if partecipantiMAX is invalid (case 3)', async () => {
        const newEvent = {
            titolo: 'Evento Test 3',
            descrizione: 'Descrizione di prova 3',
            data: new Date('2024-10-15'),
            ora: '20:00',
            luogo: 'Napoli',
            accessibilita: 'Accessibile',
            partecipantiMAX: -5,
            organizzatoreID: new mongoose.Types.ObjectId(),
        };

        await expect(GestioneEventiDAO.createEvent(newEvent)).rejects.toThrow('Numero massimo partecipanti non valido');
    });
});

//------------------------------------------registerToEvent-------------------------------------------------------------------------

describe('registerToEvent', () => {
    test('should register a user to an event (case 1)', async () => {
        const evento = await Evento.create({
            titolo: 'Evento Test 1',
            descrizione: 'Descrizione di prova 1',
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

    test('should register a user to an event (case 2)', async () => {
        const evento = await Evento.create({
            titolo: 'Evento Test 2',
            descrizione: 'Descrizione di prova 2',
            data: new Date('2024-11-30'),
            ora: '19:00',
            luogo: 'Milano',
            accessibilita: 'Non accessibile',
            partecipantiMAX: 3,
            organizzatoreID: new mongoose.Types.ObjectId(),
        });

        const userID = new mongoose.Types.ObjectId();

        const eventoAggiornato = await GestioneEventiDAO.registerToEvent(evento._id, userID);

        expect(eventoAggiornato.partecipanti).toContainEqual(userID);
        expect(eventoAggiornato.pieno).toBe(false);

        // Registrazione di un secondo utente, evento non è ancora pieno
        const userID2 = new mongoose.Types.ObjectId();
        const eventoNonPieno = await GestioneEventiDAO.registerToEvent(evento._id, userID2);

        expect(eventoNonPieno.partecipanti).toContainEqual(userID2);
        expect(eventoNonPieno.pieno).toBe(false);
    });

    test('should register a user to an event (case 3)', async () => {
        const evento = await Evento.create({
            titolo: 'Evento Test 3',
            descrizione: 'Descrizione di prova 3',
            data: new Date('2024-10-15'),
            ora: '20:00',
            luogo: 'Napoli',
            accessibilita: 'Accessibile',
            partecipantiMAX: 1,
            organizzatoreID: new mongoose.Types.ObjectId(),
        });

        const userID = new mongoose.Types.ObjectId();

        const eventoAggiornato = await GestioneEventiDAO.registerToEvent(evento._id, userID);

        expect(eventoAggiornato.partecipanti).toContainEqual(userID);
        expect(eventoAggiornato.pieno).toBe(true);
    });

    test('should throw an error if event is full (case 1)', async () => {
        const evento = await Evento.create({
            titolo: 'Evento Test 1',
            descrizione: 'Descrizione di prova 1',
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

        await expect(GestioneEventiDAO.registerToEvent(evento._id, userID)).rejects.toThrow("L'evento è pieno.");
    });

    test('should throw an error if event is full (case 2)', async () => {
        const evento = await Evento.create({
            titolo: 'Evento Test 2',
            descrizione: 'Descrizione di prova 2',
            data: new Date('2024-11-30'),
            ora: '19:00',
            luogo: 'Milano',
            accessibilita: 'Non accessibile',
            partecipantiMAX: 2,
            organizzatoreID: new mongoose.Types.ObjectId(),
            partecipanti: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
            pieno: true,
        });

        const userID = new mongoose.Types.ObjectId();

        await expect(GestioneEventiDAO.registerToEvent(evento._id, userID)).rejects.toThrow("L'evento è pieno.");
    });

    test('should throw an error if event is full (case 3)', async () => {
        const evento = await Evento.create({
            titolo: 'Evento Test 3',
            descrizione: 'Descrizione di prova 3',
            data: new Date('2024-10-15'),
            ora: '20:00',
            luogo: 'Napoli',
            accessibilita: 'Accessibile',
            partecipantiMAX: 1,
            organizzatoreID: new mongoose.Types.ObjectId(),
            partecipanti: [new mongoose.Types.ObjectId()],
            pieno: true,
        });

        const userID = new mongoose.Types.ObjectId();

        await expect(GestioneEventiDAO.registerToEvent(evento._id, userID)).rejects.toThrow("L'evento è pieno.");
    });

    test('should throw an error if event does not exist (case 1)', async () => {
        const nonExistingEventID = new mongoose.Types.ObjectId();
        const userID = new mongoose.Types.ObjectId();

        await expect(GestioneEventiDAO.registerToEvent(nonExistingEventID, userID)).rejects.toThrow("L'evento non esiste.");
    });

    test('should throw an error if event does not exist (case 2)', async () => {
        const nonExistingEventID = new mongoose.Types.ObjectId();
        const userID = new mongoose.Types.ObjectId();

        await expect(GestioneEventiDAO.registerToEvent(nonExistingEventID, userID)).rejects.toThrow("L'evento non esiste.");
    });

    test('should throw an error if event does not exist (case 3)', async () => {
        const nonExistingEventID = new mongoose.Types.ObjectId();
        const userID = new mongoose.Types.ObjectId();

        await expect(GestioneEventiDAO.registerToEvent(nonExistingEventID, userID)).rejects.toThrow("L'evento non esiste.");
    });
});

//------------------------------------------updateEvent-------------------------------------------------------------------------

describe('updateEvent', () => {
    test('should update event details (case 1)', async () => {
        const evento = await Evento.create({
            titolo: 'Vecchio Titolo 1',
            descrizione: 'Vecchia Descrizione 1',
            data: new Date('2024-12-31'),
            ora: '18:00',
            luogo: 'Roma',
            accessibilita: 'Accessibile',
            partecipantiMAX: 100,
            organizzatoreID: new mongoose.Types.ObjectId(),
        });

        const aggiornamenti = { titolo: 'Nuovo Titolo 1', descrizione: 'Nuova Descrizione 1' };
        const eventoAggiornato = await GestioneEventiDAO.updateEvent(evento._id, aggiornamenti);

        expect(eventoAggiornato.titolo).toBe(aggiornamenti.titolo);
        expect(eventoAggiornato.descrizione).toBe(aggiornamenti.descrizione);
    });

    test('should update event details (case 2)', async () => {
        const evento = await Evento.create({
            titolo: 'Vecchio Titolo 2',
            descrizione: 'Vecchia Descrizione 2',
            data: new Date('2024-11-30'),
            ora: '19:00',
            luogo: 'Milano',
            accessibilita: 'Non accessibile',
            partecipantiMAX: 50,
            organizzatoreID: new mongoose.Types.ObjectId(),
        });

        const aggiornamenti = { titolo: 'Nuovo Titolo 2', descrizione: 'Nuova Descrizione 2' };
        const eventoAggiornato = await GestioneEventiDAO.updateEvent(evento._id, aggiornamenti);

        expect(eventoAggiornato.titolo).toBe(aggiornamenti.titolo);
        expect(eventoAggiornato.descrizione).toBe(aggiornamenti.descrizione);
    });

    test('should update event details (case 3)', async () => {
        const evento = await Evento.create({
            titolo: 'Vecchio Titolo 3',
            descrizione: 'Vecchia Descrizione 3',
            data: new Date('2024-10-15'),
            ora: '20:00',
            luogo: 'Napoli',
            accessibilita: 'Accessibile',
            partecipantiMAX: 200,
            organizzatoreID: new mongoose.Types.ObjectId(),
        });

        const aggiornamenti = { titolo: 'Nuovo Titolo 3', descrizione: 'Nuova Descrizione 3' };
        const eventoAggiornato = await GestioneEventiDAO.updateEvent(evento._id, aggiornamenti);

        expect(eventoAggiornato.titolo).toBe(aggiornamenti.titolo);
        expect(eventoAggiornato.descrizione).toBe(aggiornamenti.descrizione);
    });

    test('should throw an error if event ID is invalid (case 1)', async () => {
        const invalidEventID = 'invalid-id';
        const aggiornamenti = { titolo: 'Nuovo Titolo 1', descrizione: 'Nuova Descrizione 1' };

        await expect(GestioneEventiDAO.updateEvent(invalidEventID, aggiornamenti)).rejects.toThrow();
    });

    test('should throw an error if event ID is invalid (case 2)', async () => {
        const invalidEventID = 'invalid-id';
        const aggiornamenti = { titolo: 'Nuovo Titolo 2', descrizione: 'Nuova Descrizione 2' };

        await expect(GestioneEventiDAO.updateEvent(invalidEventID, aggiornamenti)).rejects.toThrow();
    });

    test('should throw an error if event ID is invalid (case 3)', async () => {
        const invalidEventID = 'invalid-id';
        const aggiornamenti = { titolo: 'Nuovo Titolo 3', descrizione: 'Nuova Descrizione 3' };

        await expect(GestioneEventiDAO.updateEvent(invalidEventID, aggiornamenti)).rejects.toThrow();
    });

    test('should throw an error if event does not exist (case 1)', async () => {
        const nonExistingEventID = new mongoose.Types.ObjectId();
        const aggiornamenti = { titolo: 'Nuovo Titolo 1', descrizione: 'Nuova Descrizione 1' };

        await expect(GestioneEventiDAO.updateEvent(nonExistingEventID, aggiornamenti)).rejects.toThrow('Evento non trovato');
    });

    test('should throw an error if event does not exist (case 2)', async () => {
        const nonExistingEventID = new mongoose.Types.ObjectId();
        const aggiornamenti = { titolo: 'Nuovo Titolo 2', descrizione: 'Nuova Descrizione 2' };

        await expect(GestioneEventiDAO.updateEvent(nonExistingEventID, aggiornamenti)).rejects.toThrow('Evento non trovato');
    });

    test('should throw an error if event does not exist (case 3)', async () => {
        const nonExistingEventID = new mongoose.Types.ObjectId();
        const aggiornamenti = { titolo: 'Nuovo Titolo 3', descrizione: 'Nuova Descrizione 3' };

        await expect(GestioneEventiDAO.updateEvent(nonExistingEventID, aggiornamenti)).rejects.toThrow('Evento non trovato');
    });
});

//------------------------------------------searchEvents-------------------------------------------------------------------------

describe('searchEvents', () => {
    test('should return events with specific filters (case 1)', async () => {
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

    test('should return events with specific filters (case 2)', async () => {
        await Evento.create([
            {
                titolo: 'Jazz Night',
                descrizione: 'Serata di jazz',
                data: new Date('2024-11-30'),
                ora: '20:00',
                luogo: 'Torino',
                accessibilita: 'Accessibile',
                partecipantiMAX: 100,
                organizzatoreID: new mongoose.Types.ObjectId(),
                labels: ['Musica', 'Indoor'],
            },
            {
                titolo: 'Opera Classica',
                descrizione: 'Spettacolo di opera',
                data: new Date('2024-11-25'),
                ora: '19:00',
                luogo: 'Firenze',
                accessibilita: 'Non accessibile',
                partecipantiMAX: 80,
                organizzatoreID: new mongoose.Types.ObjectId(),
                labels: ['Opera', 'Classica'],
            },
        ]);

        const filtri = { labels: ['Musica'] };
        const risultati = await GestioneEventiDAO.searchEvents(filtri);

        expect(risultati).toHaveLength(1);
        expect(risultati[0].titolo).toBe('Jazz Night');
        expect(risultati[0].labels).toContain('Musica');
    });

    test('should return events with specific filters (case 3)', async () => {
        await Evento.create([
            {
                titolo: 'Rock Concert',
                descrizione: 'Concerto rock',
                data: new Date('2024-10-15'),
                ora: '22:00',
                luogo: 'Bologna',
                accessibilita: 'Accessibile',
                partecipantiMAX: 300,
                organizzatoreID: new mongoose.Types.ObjectId(),
                labels: ['Musica', 'Rock'],
            },
            {
                titolo: 'Balletto Classico',
                descrizione: 'Spettacolo di balletto',
                data: new Date('2024-10-10'),
                ora: '18:00',
                luogo: 'Venezia',
                accessibilita: 'Non accessibile',
                partecipantiMAX: 120,
                organizzatoreID: new mongoose.Types.ObjectId(),
                labels: ['Balletto', 'Classica'],
            },
        ]);

        const filtri = { labels: ['Musica'] };
        const risultati = await GestioneEventiDAO.searchEvents(filtri);

        expect(risultati).toHaveLength(1);
        expect(risultati[0].titolo).toBe('Rock Concert');
        expect(risultati[0].labels).toContain('Musica');
    });

    test('should return an empty array if no events match the filters (case 1)', async () => {
        const filtri = { labels: ['NonEsistente'] };
        const risultati = await GestioneEventiDAO.searchEvents(filtri);

        expect(risultati).toHaveLength(0);
    });

    test('should return an empty array if no events match the filters (case 2)', async () => {
        const filtri = { labels: ['NonEsistente'] };
        const risultati = await GestioneEventiDAO.searchEvents(filtri);

        expect(risultati).toHaveLength(0);
    });

    test('should return an empty array if no events match the filters (case 3)', async () => {
        const filtri = { labels: ['NonEsistente'] };
        const risultati = await GestioneEventiDAO.searchEvents(filtri);

        expect(risultati).toHaveLength(0);
    });

    test('should throw an error if filters are invalid (case 1)', async () => {
        const filtri = { data: 'invalid-date' };

        await expect(GestioneEventiDAO.searchEvents(filtri)).rejects.toThrow();
    });

    test('should throw an error if filters are invalid (case 2)', async () => {
        const filtri = { data: 'invalid-date' };

        await expect(GestioneEventiDAO.searchEvents(filtri)).rejects.toThrow();
    });

    test('should throw an error if filters are invalid (case 3)', async () => {
        const filtri = { data: 'invalid-date' };

        await expect(GestioneEventiDAO.searchEvents(filtri)).rejects.toThrow();
    });
});

//------------------------------------------deleteEvent-------------------------------------------------------------------------

describe('deleteEvent', () => {
    test('should delete an existing event (case 1)', async () => {
        const evento = await Evento.create({
            titolo: 'Evento Test 1',
            descrizione: 'Descrizione di prova 1',
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

    test('should delete an existing event (case 2)', async () => {
        const evento = await Evento.create({
            titolo: 'Evento Test 2',
            descrizione: 'Descrizione di prova 2',
            data: new Date('2024-11-30'),
            ora: '19:00',
            luogo: 'Milano',
            accessibilita: 'Non accessibile',
            partecipantiMAX: 50,
            organizzatoreID: new mongoose.Types.ObjectId(),
        });

        const risultato = await GestioneEventiDAO.deleteEvent(evento._id);

        expect(risultato._id).toEqual(evento._id);

        const eventoCancellato = await Evento.findById(evento._id);
        expect(eventoCancellato).toBeNull();
    });

    test('should delete an existing event (case 3)', async () => {
        const evento = await Evento.create({
            titolo: 'Evento Test 3',
            descrizione: 'Descrizione di prova 3',
            data: new Date('2024-10-15'),
            ora: '20:00',
            luogo: 'Napoli',
            accessibilita: 'Accessibile',
            partecipantiMAX: 200,
            organizzatoreID: new mongoose.Types.ObjectId(),
        });

        const risultato = await GestioneEventiDAO.deleteEvent(evento._id);

        expect(risultato._id).toEqual(evento._id);

        const eventoCancellato = await Evento.findById(evento._id);
        expect(eventoCancellato).toBeNull();
    });

    test('should return null for a non-existing event (case 1)', async () => {
        const nonExistingEventID = new mongoose.Types.ObjectId();

        const risultato = await GestioneEventiDAO.deleteEvent(nonExistingEventID);

        expect(risultato).toBeNull();
    });

    test('should return null for a non-existing event (case 2)', async () => {
        const nonExistingEventID = new mongoose.Types.ObjectId();

        const risultato = await GestioneEventiDAO.deleteEvent(nonExistingEventID);

        expect(risultato).toBeNull();
    });

    test('should return null for a non-existing event (case 3)', async () => {
        const nonExistingEventID = new mongoose.Types.ObjectId();

        const risultato = await GestioneEventiDAO.deleteEvent(nonExistingEventID);

        expect(risultato).toBeNull();
    });

    test('should throw an error for an invalid event ID (case 1)', async () => {
        const invalidEventID = 'invalid-id';

        await expect(GestioneEventiDAO.deleteEvent(invalidEventID)).rejects.toThrow();
    });

    test('should throw an error for an invalid event ID (case 2)', async () => {
        const invalidEventID = 'invalid-id';

        await expect(GestioneEventiDAO.deleteEvent(invalidEventID)).rejects.toThrow();
    });

    test('should throw an error for an invalid event ID (case 3)', async () => {
        const invalidEventID = 'invalid-id';

        await expect(GestioneEventiDAO.deleteEvent(invalidEventID)).rejects.toThrow();
    });
});
//------------------------------------------removeParticipant-------------------------------------------------------------------------

describe('removeParticipant', () => {
    test('should remove a participant from an event (case 1)', async () => {
        const userID1 = new mongoose.Types.ObjectId();
        const userID2 = new mongoose.Types.ObjectId();
        const evento = await Evento.create({
            titolo: 'Evento Test 1',
            descrizione: 'Descrizione di prova 1',
            data: new Date('2024-12-31'),
            ora: '18:00',
            luogo: 'Roma',
            accessibilita: 'Accessibile',
            partecipantiMAX: 100,
            organizzatoreID: new mongoose.Types.ObjectId(),
            partecipanti: [userID1, userID2],
            pieno: true,
        });

        const eventoAggiornato = await GestioneEventiDAO.removeParticipant(evento._id, userID1);

        // Verifica che il partecipante sia stato rimosso
        expect(eventoAggiornato.partecipanti.map(p => p.toString())).not.toContain(userID1.toString());
        // Verifica che l'evento non sia più pieno
        expect(eventoAggiornato.pieno).toBe(false);
    });

    test('should remove a participant from an event (case 2)', async () => {
        const userID1 = new mongoose.Types.ObjectId();
        const userID2 = new mongoose.Types.ObjectId();
        const evento = await Evento.create({
            titolo: 'Evento Test 2',
            descrizione: 'Descrizione di prova 2',
            data: new Date('2024-12-31'),
            ora: '18:00',
            luogo: 'Milano',
            accessibilita: 'Non accessibile',
            partecipantiMAX: 50,
            organizzatoreID: new mongoose.Types.ObjectId(),
            partecipanti: [userID1, userID2],
            pieno: true,
        });

        const eventoAggiornato = await GestioneEventiDAO.removeParticipant(evento._id, userID2);

        // Verifica che il partecipante sia stato rimosso
        expect(eventoAggiornato.partecipanti.map(p => p.toString())).not.toContain(userID2.toString());
        // Verifica che l'evento non sia più pieno
        expect(eventoAggiornato.pieno).toBe(false);
    });

    test('should remove a participant from an event (case 3)', async () => {
        const userID1 = new mongoose.Types.ObjectId();
        const userID2 = new mongoose.Types.ObjectId();
        const evento = await Evento.create({
            titolo: 'Evento Test 3',
            descrizione: 'Descrizione di prova 3',
            data: new Date('2024-12-31'),
            ora: '18:00',
            luogo: 'Napoli',
            accessibilita: 'Accessibile',
            partecipantiMAX: 200,
            organizzatoreID: new mongoose.Types.ObjectId(),
            partecipanti: [userID1, userID2],
            pieno: true,
        });

        const eventoAggiornato = await GestioneEventiDAO.removeParticipant(evento._id, userID1);

        // Verifica che il partecipante sia stato rimosso
        expect(eventoAggiornato.partecipanti.map(p => p.toString())).not.toContain(userID1.toString());
        // Verifica che l'evento non sia più pieno
        expect(eventoAggiornato.pieno).toBe(false);
    });

    test('should throw an error if event ID is invalid (case 1)', async () => {
        const invalidEventID = 'invalid-id';
        const userID = new mongoose.Types.ObjectId();

        await expect(GestioneEventiDAO.removeParticipant(invalidEventID, userID)).rejects.toThrow('L\'ID dell\'evento non è valido.');
    });

    test('should throw an error if event ID is invalid (case 2)', async () => {
        const invalidEventID = '12345';
        const userID = new mongoose.Types.ObjectId();

        await expect(GestioneEventiDAO.removeParticipant(invalidEventID, userID)).rejects.toThrow('L\'ID dell\'evento non è valido.');
    });

    test('should throw an error if event ID is invalid (case 3)', async () => {
        const invalidEventID = '';
        const userID = new mongoose.Types.ObjectId();

        await expect(GestioneEventiDAO.removeParticipant(invalidEventID, userID)).rejects.toThrow('L\'ID dell\'evento non è valido.');
    });

    test('should throw an error if user ID is invalid (case 1)', async () => {
        const evento = await Evento.create({
            titolo: 'Evento Test 1',
            descrizione: 'Descrizione di prova 1',
            data: new Date('2024-12-31'),
            ora: '18:00',
            luogo: 'Roma',
            accessibilita: 'Accessibile',
            partecipantiMAX: 100,
            organizzatoreID: new mongoose.Types.ObjectId(),
            partecipanti: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
            pieno: true,
        });

        const invalidUserID = 'invalid-id';

        await expect(GestioneEventiDAO.removeParticipant(evento._id, invalidUserID)).rejects.toThrow('L\'ID dell\'utente non è valido.');
    });

    test('should throw an error if user ID is invalid (case 2)', async () => {
        const evento = await Evento.create({
            titolo: 'Evento Test 2',
            descrizione: 'Descrizione di prova 2',
            data: new Date('2024-12-31'),
            ora: '18:00',
            luogo: 'Milano',
            accessibilita: 'Non accessibile',
            partecipantiMAX: 50,
            organizzatoreID: new mongoose.Types.ObjectId(),
            partecipanti: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
            pieno: true,
        });

        const invalidUserID = '12345';

        await expect(GestioneEventiDAO.removeParticipant(evento._id, invalidUserID)).rejects.toThrow('L\'ID dell\'utente non è valido.');
    });

    test('should throw an error if user ID is invalid (case 3)', async () => {
        const evento = await Evento.create({
            titolo: 'Evento Test 3',
            descrizione: 'Descrizione di prova 3',
            data: new Date('2024-12-31'),
            ora: '18:00',
            luogo: 'Napoli',
            accessibilita: 'Accessibile',
            partecipantiMAX: 200,
            organizzatoreID: new mongoose.Types.ObjectId(),
            partecipanti: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
            pieno: true,
        });

        const invalidUserID = '';

        await expect(GestioneEventiDAO.removeParticipant(evento._id, invalidUserID)).rejects.toThrow('L\'ID dell\'utente non è valido.');
    });

    test('should throw an error if event does not exist (case 1)', async () => {
        const nonExistingEventID = new mongoose.Types.ObjectId();
        const userID = new mongoose.Types.ObjectId();

        await expect(GestioneEventiDAO.removeParticipant(nonExistingEventID, userID)).rejects.toThrow('Evento non trovato.');
    });

    test('should throw an error if event does not exist (case 2)', async () => {
        const nonExistingEventID = new mongoose.Types.ObjectId();
        const userID = new mongoose.Types.ObjectId();

        await expect(GestioneEventiDAO.removeParticipant(nonExistingEventID, userID)).rejects.toThrow('Evento non trovato.');
    });

    test('should throw an error if event does not exist (case 3)', async () => {
        const nonExistingEventID = new mongoose.Types.ObjectId();
        const userID = new mongoose.Types.ObjectId();

        await expect(GestioneEventiDAO.removeParticipant(nonExistingEventID, userID)).rejects.toThrow('Evento non trovato.');
    });
});
});