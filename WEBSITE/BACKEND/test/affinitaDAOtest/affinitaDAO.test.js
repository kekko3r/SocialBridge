const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Affinita = require('../../database/models/affinitaModel'); // Modello per Affinita
const affinitaDAO = require('../../libs/affinitaDAO'); // DAO DA TESTARE

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
    // Pulisci la collezione prima di ogni test
    await Affinita.deleteMany({});
});

describe('affinitaDAO', () => {

//------------------------------------------createAffinita-------------------------------------------------------------------------

describe('createAffinita', () => {
    test('should create a new affinity (case 1)', async () => {
        const input = { utente1ID: new mongoose.Types.ObjectId(), utente2ID: new mongoose.Types.ObjectId(), punteggio: 10 };
        const result = await affinitaDAO.createAffinita(input);
        expect(result).toBeTruthy();
        expect(result.utente1ID).toEqual(input.utente1ID);
        expect(result.punteggio).toBe(10);
    });

    test('should create a new affinity (case 2)', async () => {
        const input = { utente1ID: new mongoose.Types.ObjectId(), utente2ID: new mongoose.Types.ObjectId(), punteggio: 20 };
        const result = await affinitaDAO.createAffinita(input);
        expect(result).toBeTruthy();
        expect(result.utente1ID).toEqual(input.utente1ID);
        expect(result.punteggio).toBe(20);
    });

    test('should create a new affinity (case 3)', async () => {
        const input = { utente1ID: new mongoose.Types.ObjectId(), utente2ID: new mongoose.Types.ObjectId(), punteggio: 30 };
        const result = await affinitaDAO.createAffinita(input);
        expect(result).toBeTruthy();
        expect(result.utente1ID).toEqual(input.utente1ID);
        expect(result.punteggio).toBe(30);
    });
});

//------------------------------------------findAffinita-------------------------------------------------------------------------

describe('findAffinita', () => {
    test('should find an affinity between two users (case 1)', async () => {
        const user1ID = new mongoose.Types.ObjectId();
        const user2ID = new mongoose.Types.ObjectId();
        const input = { utente1ID: user1ID, utente2ID: user2ID, punteggio: 15 };
        await Affinita.create(input);
        const result = await affinitaDAO.findAffinita(user1ID, user2ID);
        expect(result).toBeTruthy();
        expect(result.utente1ID).toEqual(user1ID);
        expect(result.utente2ID).toEqual(user2ID);
        expect(result.punteggio).toBe(15);
    });

    test('should find an affinity between two users (case 2)', async () => {
        const user1ID = new mongoose.Types.ObjectId();
        const user2ID = new mongoose.Types.ObjectId();
        const input = { utente1ID: user1ID, utente2ID: user2ID, punteggio: 25 };
        await Affinita.create(input);
        const result = await affinitaDAO.findAffinita(user1ID, user2ID);
        expect(result).toBeTruthy();
        expect(result.utente1ID).toEqual(user1ID);
        expect(result.utente2ID).toEqual(user2ID);
        expect(result.punteggio).toBe(25);
    });

    test('should find an affinity between two users (case 3)', async () => {
        const user1ID = new mongoose.Types.ObjectId();
        const user2ID = new mongoose.Types.ObjectId();
        const input = { utente1ID: user1ID, utente2ID: user2ID, punteggio: 35 };
        await Affinita.create(input);
        const result = await affinitaDAO.findAffinita(user1ID, user2ID);
        expect(result).toBeTruthy();
        expect(result.utente1ID).toEqual(user1ID);
        expect(result.utente2ID).toEqual(user2ID);
        expect(result.punteggio).toBe(35);
    });
});

//------------------------------------------findAffinitaByUtente-------------------------------------------------------------------------

describe('findAffinitaByUtente', () => {
    test('should find all affinities of a user (case 1)', async () => {
        const user1ID = new mongoose.Types.ObjectId();
        const affinita1 = { utente1ID: user1ID, utente2ID: new mongoose.Types.ObjectId(), punteggio: 10 };
        const affinita2 = { utente1ID: new mongoose.Types.ObjectId(), utente2ID: user1ID, punteggio: 20 };
        const affinita3 = { utente1ID: new mongoose.Types.ObjectId(), utente2ID: new mongoose.Types.ObjectId(), punteggio: 30 };
        await Affinita.create([affinita1, affinita2, affinita3]);
        const result = await affinitaDAO.findAffinitaByUtente(user1ID);
        expect(result.length).toBe(2);
        expect(result[0].punteggio).toBe(10);
        expect(result[1].punteggio).toBe(20);
    });

    test('should find all affinities of a user (case 2)', async () => {
        const user1ID = new mongoose.Types.ObjectId();
        const affinita1 = { utente1ID: user1ID, utente2ID: new mongoose.Types.ObjectId(), punteggio: 15 };
        const affinita2 = { utente1ID: new mongoose.Types.ObjectId(), utente2ID: user1ID, punteggio: 25 };
        const affinita3 = { utente1ID: new mongoose.Types.ObjectId(), utente2ID: new mongoose.Types.ObjectId(), punteggio: 35 };
        await Affinita.create([affinita1, affinita2, affinita3]);
        const result = await affinitaDAO.findAffinitaByUtente(user1ID);
        expect(result.length).toBe(2);
        expect(result[0].punteggio).toBe(15);
        expect(result[1].punteggio).toBe(25);
    });

    test('should find all affinities of a user (case 3)', async () => {
        const user1ID = new mongoose.Types.ObjectId();
        const affinita1 = { utente1ID: user1ID, utente2ID: new mongoose.Types.ObjectId(), punteggio: 20 };
        const affinita2 = { utente1ID: new mongoose.Types.ObjectId(), utente2ID: user1ID, punteggio: 30 };
        const affinita3 = { utente1ID: new mongoose.Types.ObjectId(), utente2ID: new mongoose.Types.ObjectId(), punteggio: 40 };
        await Affinita.create([affinita1, affinita2, affinita3]);
        const result = await affinitaDAO.findAffinitaByUtente(user1ID);
        expect(result.length).toBe(2);
        expect(result[0].punteggio).toBe(20);
        expect(result[1].punteggio).toBe(30);
    });
});

//------------------------------------------updatePunteggio-------------------------------------------------------------------------

describe('updatePunteggio', () => {
    test('should update the score of an affinity (case 1)', async () => {
        const input = { utente1ID: new mongoose.Types.ObjectId(), utente2ID: new mongoose.Types.ObjectId(), punteggio: 15 };
        await Affinita.create(input);
        const updated = await affinitaDAO.updatePunteggio(input.utente1ID, input.utente2ID, 20);
        expect(updated).toBeTruthy();
        expect(updated.punteggio).toBe(20);
    });

    test('should update the score of an affinity (case 2)', async () => {
        const input = { utente1ID: new mongoose.Types.ObjectId(), utente2ID: new mongoose.Types.ObjectId(), punteggio: 25 };
        await Affinita.create(input);
        const updated = await affinitaDAO.updatePunteggio(input.utente1ID, input.utente2ID, 30);
        expect(updated).toBeTruthy();
        expect(updated.punteggio).toBe(30);
    });

    test('should update the score of an affinity (case 3)', async () => {
        const input = { utente1ID: new mongoose.Types.ObjectId(), utente2ID: new mongoose.Types.ObjectId(), punteggio: 35 };
        await Affinita.create(input);
        const updated = await affinitaDAO.updatePunteggio(input.utente1ID, input.utente2ID, 40);
        expect(updated).toBeTruthy();
        expect(updated.punteggio).toBe(40);
    });
});

//------------------------------------------deleteAffinita-------------------------------------------------------------------------

describe('deleteAffinita', () => {
    test('should delete an affinity between two users (case 1)', async () => {
        const input = { utente1ID: new mongoose.Types.ObjectId(), utente2ID: new mongoose.Types.ObjectId(), punteggio: 15 };
        const request = await Affinita.create(input);
        const deleted = await affinitaDAO.deleteAffinita(request.utente1ID, request.utente2ID);
        expect(deleted).toBeTruthy();
        expect(deleted.utente1ID).toEqual(request.utente1ID);
    });

    test('should delete an affinity between two users (case 2)', async () => {
        const input = { utente1ID: new mongoose.Types.ObjectId(), utente2ID: new mongoose.Types.ObjectId(), punteggio: 25 };
        const request = await Affinita.create(input);
        const deleted = await affinitaDAO.deleteAffinita(request.utente1ID, request.utente2ID);
        expect(deleted).toBeTruthy();
        expect(deleted.utente1ID).toEqual(request.utente1ID);
    });

    test('should delete an affinity between two users (case 3)', async () => {
        const input = { utente1ID: new mongoose.Types.ObjectId(), utente2ID: new mongoose.Types.ObjectId(), punteggio: 35 };
        const request = await Affinita.create(input);
        const deleted = await affinitaDAO.deleteAffinita(request.utente1ID, request.utente2ID);
        expect(deleted).toBeTruthy();
        expect(deleted.utente1ID).toEqual(request.utente1ID);
    });
});
});