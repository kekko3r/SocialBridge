const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Recensione = require('../../database/models/recensioneModel'); // Modello per Recensione
const recensioneDAO = require('../../libs/recensioneDAO'); // DAO DA TESTARE

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
    await Recensione.deleteMany(); // Pulisci il database tra i test
});

describe('recensioneDAO', () => {

//------------------------------------------CreateRecensione-------------------------------------------------------------------------

describe('createRecensione', () => {
    test('should create a new recensione with valid input (case 1)', async () => {
        const newRecensione = {
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 5,
            commento: 'Ottimo evento!'
        };

        const recensioneCreata = await recensioneDAO.createRecensione(newRecensione);

        expect(recensioneCreata).toBeTruthy();
        expect(recensioneCreata.eventoID).toEqual(newRecensione.eventoID);
        expect(recensioneCreata.autoreID).toEqual(newRecensione.autoreID);
        expect(recensioneCreata.voto).toBe(newRecensione.voto);
        expect(recensioneCreata.commento).toBe(newRecensione.commento);
    });

    test('should create a new recensione with valid input (case 2)', async () => {
        const newRecensione = {
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 4,
            commento: 'Buon evento!'
        };

        const recensioneCreata = await recensioneDAO.createRecensione(newRecensione);

        expect(recensioneCreata).toBeTruthy();
        expect(recensioneCreata.eventoID).toEqual(newRecensione.eventoID);
        expect(recensioneCreata.autoreID).toEqual(newRecensione.autoreID);
        expect(recensioneCreata.voto).toBe(newRecensione.voto);
        expect(recensioneCreata.commento).toBe(newRecensione.commento);
    });

    test('should create a new recensione with valid input (case 3)', async () => {
        const newRecensione = {
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 3,
            commento: 'Evento nella media.'
        };

        const recensioneCreata = await recensioneDAO.createRecensione(newRecensione);

        expect(recensioneCreata).toBeTruthy();
        expect(recensioneCreata.eventoID).toEqual(newRecensione.eventoID);
        expect(recensioneCreata.autoreID).toEqual(newRecensione.autoreID);
        expect(recensioneCreata.voto).toBe(newRecensione.voto);
        expect(recensioneCreata.commento).toBe(newRecensione.commento);
    });

    test('should throw an error if required fields are missing (case 1)', async () => {
        const newRecensione = {
            eventoID: new mongoose.Types.ObjectId(),
            voto: 5,
            commento: 'Ottimo evento!'
        };

        await expect(recensioneDAO.createRecensione(newRecensione)).rejects.toThrow();
    });

    test('should throw an error if required fields are missing (case 2)', async () => {
        const newRecensione = {
            autoreID: new mongoose.Types.ObjectId(),
            voto: 4,
            commento: 'Buon evento!'
        };

        await expect(recensioneDAO.createRecensione(newRecensione)).rejects.toThrow();
    });

    test('should throw an error if required fields are missing (case 3)', async () => {
        const newRecensione = {
            voto: 3,
            commento: 'Evento nella media.'
        };

        await expect(recensioneDAO.createRecensione(newRecensione)).rejects.toThrow();
    });

    test('should throw an error if voto is invalid (case 1)', async () => {
        const newRecensione = {
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 10, // Invalid voto
            commento: 'Ottimo evento!'
        };

        await expect(recensioneDAO.createRecensione(newRecensione)).rejects.toThrow('Voto non valido');
    });

    test('should throw an error if voto is invalid (case 2)', async () => {
        const newRecensione = {
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: -1, // Invalid voto
            commento: 'Evento pessimo!'
        };

        await expect(recensioneDAO.createRecensione(newRecensione)).rejects.toThrow('Voto non valido');
    });

    test('should throw an error if voto is invalid (case 3)', async () => {
        const newRecensione = {
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 'cinque', // Invalid voto
            commento: 'Ottimo evento!'
        };

        await expect(recensioneDAO.createRecensione(newRecensione)).rejects.toThrow('Voto non valido');
    });
});

//------------------------------------------GetRecensioniByEvento-------------------------------------------------------------------------

describe('getRecensioniByEvento', () => {
    test('should return all recensioni for an evento (case 1)', async () => {
        const eventoID = new mongoose.Types.ObjectId();

        await Recensione.create([
            { eventoID, autoreID: new mongoose.Types.ObjectId(), voto: 5, commento: 'Ottimo evento!' },
            { eventoID, autoreID: new mongoose.Types.ObjectId(), voto: 4, commento: 'Buon evento!' }
        ]);

        const recensioni = await recensioneDAO.getRecensioniByEvento(eventoID);

        expect(recensioni).toHaveLength(2);
        expect(recensioni[0].eventoID).toEqual(eventoID);
        expect(recensioni[1].eventoID).toEqual(eventoID);
    });

    test('should return all recensioni for an evento (case 2)', async () => {
        const eventoID = new mongoose.Types.ObjectId();

        await Recensione.create([
            { eventoID, autoreID: new mongoose.Types.ObjectId(), voto: 3, commento: 'Evento nella media.' },
            { eventoID, autoreID: new mongoose.Types.ObjectId(), voto: 2, commento: 'Evento sotto la media.' }
        ]);

        const recensioni = await recensioneDAO.getRecensioniByEvento(eventoID);

        expect(recensioni).toHaveLength(2);
        expect(recensioni[0].eventoID).toEqual(eventoID);
        expect(recensioni[1].eventoID).toEqual(eventoID);
    });

    test('should return all recensioni for an evento (case 3)', async () => {
        const eventoID = new mongoose.Types.ObjectId();

        await Recensione.create([
            { eventoID, autoreID: new mongoose.Types.ObjectId(), voto: 1, commento: 'Pessimo evento.' },
            { eventoID, autoreID: new mongoose.Types.ObjectId(), voto: 5, commento: 'Fantastico evento!' }
        ]);

        const recensioni = await recensioneDAO.getRecensioniByEvento(eventoID);

        expect(recensioni).toHaveLength(2);
        expect(recensioni[0].eventoID).toEqual(eventoID);
        expect(recensioni[1].eventoID).toEqual(eventoID);
    });

    test('should return an empty array if no recensioni found (case 1)', async () => {
        const eventoID = new mongoose.Types.ObjectId();

        const recensioni = await recensioneDAO.getRecensioniByEvento(eventoID);

        expect(recensioni).toHaveLength(0);
    });

    test('should return an empty array if no recensioni found (case 2)', async () => {
        const eventoID = new mongoose.Types.ObjectId();

        const recensioni = await recensioneDAO.getRecensioniByEvento(eventoID);

        expect(recensioni).toHaveLength(0);
    });

    test('should return an empty array if no recensioni found (case 3)', async () => {
        const eventoID = new mongoose.Types.ObjectId();

        const recensioni = await recensioneDAO.getRecensioniByEvento(eventoID);

        expect(recensioni).toHaveLength(0);
    });

    test('should throw an error if eventoID is invalid (case 1)', async () => {
        const invalidEventoID = 'invalid-id';

        await expect(recensioneDAO.getRecensioniByEvento(invalidEventoID)).rejects.toThrow();
    });

    test('should throw an error if eventoID is invalid (case 2)', async () => {
        const invalidEventoID = 'invalid-id';

        await expect(recensioneDAO.getRecensioniByEvento(invalidEventoID)).rejects.toThrow();
    });

    test('should throw an error if eventoID is invalid (case 3)', async () => {
        const invalidEventoID = 'invalid-id';

        await expect(recensioneDAO.getRecensioniByEvento(invalidEventoID)).rejects.toThrow();
    });
});

//------------------------------------------UpdateRecensione-------------------------------------------------------------------------

describe('updateRecensione', () => {
    test('should update a recensione with valid input (case 1)', async () => {
        const recensione = await Recensione.create({
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 3,
            commento: 'Evento discreto'
        });

        const updateData = { voto: 5, commento: 'Evento fantastico' };
        const recensioneAggiornata = await recensioneDAO.updateRecensione(recensione._id, updateData);

        expect(recensioneAggiornata).toBeTruthy();
        expect(recensioneAggiornata.voto).toBe(updateData.voto);
        expect(recensioneAggiornata.commento).toBe(updateData.commento);
    });

    test('should update a recensione with valid input (case 2)', async () => {
        const recensione = await Recensione.create({
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 2,
            commento: 'Evento mediocre'
        });

        const updateData = { voto: 4, commento: 'Evento migliorato' };
        const recensioneAggiornata = await recensioneDAO.updateRecensione(recensione._id, updateData);

        expect(recensioneAggiornata).toBeTruthy();
        expect(recensioneAggiornata.voto).toBe(updateData.voto);
        expect(recensioneAggiornata.commento).toBe(updateData.commento);
    });

    test('should update a recensione with valid input (case 3)', async () => {
        const recensione = await Recensione.create({
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 1,
            commento: 'Evento pessimo'
        });

        const updateData = { voto: 3, commento: 'Evento migliorato' };
        const recensioneAggiornata = await recensioneDAO.updateRecensione(recensione._id, updateData);

        expect(recensioneAggiornata).toBeTruthy();
        expect(recensioneAggiornata.voto).toBe(updateData.voto);
        expect(recensioneAggiornata.commento).toBe(updateData.commento);
    });

    test('should throw an error if recensioneID is invalid (case 1)', async () => {
        const invalidRecensioneID = 'invalid-id';
        const updateData = { voto: 5, commento: 'Evento fantastico' };

        await expect(recensioneDAO.updateRecensione(invalidRecensioneID, updateData)).rejects.toThrow();
    });

    test('should throw an error if recensioneID is invalid (case 2)', async () => {
        const invalidRecensioneID = 'invalid-id';
        const updateData = { voto: 4, commento: 'Evento migliorato' };

        await expect(recensioneDAO.updateRecensione(invalidRecensioneID, updateData)).rejects.toThrow();
    });

    test('should throw an error if recensioneID is invalid (case 3)', async () => {
        const invalidRecensioneID = 'invalid-id';
        const updateData = { voto: 3, commento: 'Evento migliorato' };

        await expect(recensioneDAO.updateRecensione(invalidRecensioneID, updateData)).rejects.toThrow();
    });

    test('should throw an error if update data is invalid (case 1)', async () => {
        const recensione = await Recensione.create({
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 3,
            commento: 'Evento discreto'
        });

        const invalidUpdateData = { voto: 10, commento: 'Evento fantastico' }; // Invalid voto

        await expect(recensioneDAO.updateRecensione(recensione._id, invalidUpdateData)).rejects.toThrow('Voto non valido');
    });

    test('should throw an error if update data is invalid (case 2)', async () => {
        const recensione = await Recensione.create({
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 2,
            commento: 'Evento mediocre'
        });

        const invalidUpdateData = { voto: -1, commento: 'Evento migliorato' }; // Invalid voto

        await expect(recensioneDAO.updateRecensione(recensione._id, invalidUpdateData)).rejects.toThrow('Voto non valido');
    });

    test('should throw an error if update data is invalid (case 3)', async () => {
        const recensione = await Recensione.create({
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 1,
            commento: 'Evento pessimo'
        });

        const invalidUpdateData = { voto: 'cinque', commento: 'Evento migliorato' }; // Invalid voto

        await expect(recensioneDAO.updateRecensione(recensione._id, invalidUpdateData)).rejects.toThrow('Voto non valido');
    });
});

//------------------------------------------DeleteRecensione-------------------------------------------------------------------------

describe('deleteRecensione', () => {
    test('should delete a recensione (case 1)', async () => {
        const recensione = await Recensione.create({
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 3,
            commento: 'Evento discreto'
        });

        const recensioneEliminata = await recensioneDAO.deleteRecensione(recensione._id);

        expect(recensioneEliminata).toBeTruthy();
        expect(recensioneEliminata._id).toEqual(recensione._id);

        const recensioneEsiste = await Recensione.findById(recensione._id);
        expect(recensioneEsiste).toBeNull();
    });

    test('should delete a recensione (case 2)', async () => {
        const recensione = await Recensione.create({
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 4,
            commento: 'Buon evento'
        });

        const recensioneEliminata = await recensioneDAO.deleteRecensione(recensione._id);

        expect(recensioneEliminata).toBeTruthy();
        expect(recensioneEliminata._id).toEqual(recensione._id);

        const recensioneEsiste = await Recensione.findById(recensione._id);
        expect(recensioneEsiste).toBeNull();
    });

    test('should delete a recensione (case 3)', async () => {
        const recensione = await Recensione.create({
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 5,
            commento: 'Evento fantastico'
        });

        const recensioneEliminata = await recensioneDAO.deleteRecensione(recensione._id);

        expect(recensioneEliminata).toBeTruthy();
        expect(recensioneEliminata._id).toEqual(recensione._id);

        const recensioneEsiste = await Recensione.findById(recensione._id);
        expect(recensioneEsiste).toBeNull();
    });

    test('should throw an error if recensioneID is invalid (case 1)', async () => {
        const invalidRecensioneID = 'invalid-id';

        await expect(recensioneDAO.deleteRecensione(invalidRecensioneID)).rejects.toThrow();
    });

    test('should throw an error if recensioneID is invalid (case 2)', async () => {
        const invalidRecensioneID = 'invalid-id';

        await expect(recensioneDAO.deleteRecensione(invalidRecensioneID)).rejects.toThrow();
    });

    test('should throw an error if recensioneID is invalid (case 3)', async () => {
        const invalidRecensioneID = 'invalid-id';

        await expect(recensioneDAO.deleteRecensione(invalidRecensioneID)).rejects.toThrow();
    });

    test('should return null if recensione does not exist (case 1)', async () => {
        const recensioneID = new mongoose.Types.ObjectId();

        const recensioneEliminata = await recensioneDAO.deleteRecensione(recensioneID);

        expect(recensioneEliminata).toBeNull();
    });

    test('should return null if recensione does not exist (case 2)', async () => {
        const recensioneID = new mongoose.Types.ObjectId();

        const recensioneEliminata = await recensioneDAO.deleteRecensione(recensioneID);

        expect(recensioneEliminata).toBeNull();
    });

    test('should return null if recensione does not exist (case 3)', async () => {
        const recensioneID = new mongoose.Types.ObjectId();

        const recensioneEliminata = await recensioneDAO.deleteRecensione(recensioneID);

        expect(recensioneEliminata).toBeNull();
    });
});

//------------------------------------------FindById-------------------------------------------------------------------------

describe('findById', () => {
    test('should return a recensione by ID (case 1)', async () => {
        const recensione = await Recensione.create({
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 3,
            commento: 'Evento discreto'
        });

        const recensioneTrovata = await recensioneDAO.findById(recensione._id);

        expect(recensioneTrovata).toBeTruthy();
        expect(recensioneTrovata._id).toEqual(recensione._id);
    });

    test('should return a recensione by ID (case 2)', async () => {
        const recensione = await Recensione.create({
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 5,
            commento: 'Evento fantastico'
        });

        const recensioneTrovata = await recensioneDAO.findById(recensione._id);

        expect(recensioneTrovata).toBeTruthy();
        expect(recensioneTrovata._id).toEqual(recensione._id);
    });

    test('should return a recensione by ID (case 3)', async () => {
        const recensione = await Recensione.create({
            eventoID: new mongoose.Types.ObjectId(),
            autoreID: new mongoose.Types.ObjectId(),
            voto: 1,
            commento: 'Evento pessimo'
        });

        const recensioneTrovata = await recensioneDAO.findById(recensione._id);

        expect(recensioneTrovata).toBeTruthy();
        expect(recensioneTrovata._id).toEqual(recensione._id);
    });

    test('should throw an error if recensioneID is invalid (case 1)', async () => {
        const invalidRecensioneID = 'invalid-id';

        await expect(recensioneDAO.findById(invalidRecensioneID)).rejects.toThrow();
    });

    test('should throw an error if recensioneID is invalid (case 2)', async () => {
        const invalidRecensioneID = 'invalid-id';

        await expect(recensioneDAO.findById(invalidRecensioneID)).rejects.toThrow();
    });

    test('should throw an error if recensioneID is invalid (case 3)', async () => {
        const invalidRecensioneID = 'invalid-id';

        await expect(recensioneDAO.findById(invalidRecensioneID)).rejects.toThrow();
    });

    test('should return null if recensione does not exist (case 1)', async () => {
        const recensioneID = new mongoose.Types.ObjectId();

        const recensioneTrovata = await recensioneDAO.findById(recensioneID);

        expect(recensioneTrovata).toBeNull();
    });

    test('should return null if recensione does not exist (case 2)', async () => {
        const recensioneID = new mongoose.Types.ObjectId();

        const recensioneTrovata = await recensioneDAO.findById(recensioneID);

        expect(recensioneTrovata).toBeNull();
    });

    test('should return null if recensione does not exist (case 3)', async () => {
        const recensioneID = new mongoose.Types.ObjectId();

        const recensioneTrovata = await recensioneDAO.findById(recensioneID);

        expect(recensioneTrovata).toBeNull();
    });
});

//------------------------------------------FindAll-------------------------------------------------------------------------

describe('findAll', () => {
    test('should return all recensioni (case 1)', async () => {
        await Recensione.create([
            { eventoID: new mongoose.Types.ObjectId(), autoreID: new mongoose.Types.ObjectId(), voto: 5, commento: 'Ottimo evento!' },
            { eventoID: new mongoose.Types.ObjectId(), autoreID: new mongoose.Types.ObjectId(), voto: 4, commento: 'Buon evento!' }
        ]);

        const recensioni = await recensioneDAO.findAll();

        expect(recensioni).toHaveLength(2);
    });

    test('should return all recensioni (case 2)', async () => {
        await Recensione.create([
            { eventoID: new mongoose.Types.ObjectId(), autoreID: new mongoose.Types.ObjectId(), voto: 3, commento: 'Evento nella media.' },
            { eventoID: new mongoose.Types.ObjectId(), autoreID: new mongoose.Types.ObjectId(), voto: 2, commento: 'Evento sotto la media.' }
        ]);

        const recensioni = await recensioneDAO.findAll();

        expect(recensioni).toHaveLength(2);
    });

    test('should return all recensioni (case 3)', async () => {
        await Recensione.create([
            { eventoID: new mongoose.Types.ObjectId(), autoreID: new mongoose.Types.ObjectId(), voto: 1, commento: 'Pessimo evento.' },
            { eventoID: new mongoose.Types.ObjectId(), autoreID: new mongoose.Types.ObjectId(), voto: 5, commento: 'Fantastico evento!' }
        ]);

        const recensioni = await recensioneDAO.findAll();

        expect(recensioni).toHaveLength(2);
    });

    test('should return an empty array if no recensioni exist (case 1)', async () => {
        const recensioni = await recensioneDAO.findAll();

        expect(recensioni).toHaveLength(0);
    });

    test('should return an empty array if no recensioni exist (case 2)', async () => {
        const recensioni = await recensioneDAO.findAll();

        expect(recensioni).toHaveLength(0);
    });

    test('should return an empty array if no recensioni exist (case 3)', async () => {
        const recensioni = await recensioneDAO.findAll();

        expect(recensioni).toHaveLength(0);
    });

    test('should return all recensioni with specific filters (case 1)', async () => {
        await Recensione.create([
            { eventoID: new mongoose.Types.ObjectId(), autoreID: new mongoose.Types.ObjectId(), voto: 5, commento: 'Ottimo evento!' },
            { eventoID: new mongoose.Types.ObjectId(), autoreID: new mongoose.Types.ObjectId(), voto: 4, commento: 'Buon evento!' }
        ]);

        const filters = { voto: 5 };
        const recensioni = await recensioneDAO.findAll(filters);

        expect(recensioni).toHaveLength(1);
        expect(recensioni[0].voto).toBe(5);
    });

    test('should return all recensioni with specific filters (case 2)', async () => {
        await Recensione.create([
            { eventoID: new mongoose.Types.ObjectId(), autoreID: new mongoose.Types.ObjectId(), voto: 3, commento: 'Evento nella media.' },
            { eventoID: new mongoose.Types.ObjectId(), autoreID: new mongoose.Types.ObjectId(), voto: 2, commento: 'Evento sotto la media.' }
        ]);

        const filters = { voto: 3 };
        const recensioni = await recensioneDAO.findAll(filters);

        expect(recensioni).toHaveLength(1);
        expect(recensioni[0].voto).toBe(3);
    });

    test('should return all recensioni with specific filters (case 3)', async () => {
        await Recensione.create([
            { eventoID: new mongoose.Types.ObjectId(), autoreID: new mongoose.Types.ObjectId(), voto: 1, commento: 'Pessimo evento.' },
            { eventoID: new mongoose.Types.ObjectId(), autoreID: new mongoose.Types.ObjectId(), voto: 5, commento: 'Fantastico evento!' }
        ]);

        const filters = { voto: 1 };
        const recensioni = await recensioneDAO.findAll(filters);

        expect(recensioni).toHaveLength(1);
        expect(recensioni[0].voto).toBe(1);
    });
});
});