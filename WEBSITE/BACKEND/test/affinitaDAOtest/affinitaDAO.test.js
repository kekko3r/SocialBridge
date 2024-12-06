const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Label = require('../../database/models/labelModel'); // Modello per Label
const labelDAO = require('../../libs/labelDAO'); // DAO DA TESTARE

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
    await Label.deleteMany(); // Pulisci il database tra i test
});

//------------------------------------------CreateLabel-------------------------------------------------------------------------

describe('createLabel', () => {
    test('should create a new label with valid input (case 1)', async () => {
        const newLabel = { nome: 'Test Label 1' };

        const labelCreata = await labelDAO.createLabel(newLabel);

        expect(labelCreata).toBeTruthy();
        expect(labelCreata.nome).toBe(newLabel.nome);
    });

    test('should create a new label with valid input (case 2)', async () => {
        const newLabel = { nome: 'Test Label 2' };

        const labelCreata = await labelDAO.createLabel(newLabel);

        expect(labelCreata).toBeTruthy();
        expect(labelCreata.nome).toBe(newLabel.nome);
    });

    test('should create a new label with valid input (case 3)', async () => {
        const newLabel = { nome: 'Test Label 3' };

        const labelCreata = await labelDAO.createLabel(newLabel);

        expect(labelCreata).toBeTruthy();
        expect(labelCreata.nome).toBe(newLabel.nome);
    });

    test('should throw an error if nome is missing (case 1)', async () => {
        const newLabel = {};

        await expect(labelDAO.createLabel(newLabel)).rejects.toThrow("Il campo 'nome' è obbligatorio.");
    });

    test('should throw an error if nome is missing (case 2)', async () => {
        const newLabel = {};

        await expect(labelDAO.createLabel(newLabel)).rejects.toThrow("Il campo 'nome' è obbligatorio.");
    });

    test('should throw an error if nome is missing (case 3)', async () => {
        const newLabel = {};

        await expect(labelDAO.createLabel(newLabel)).rejects.toThrow("Il campo 'nome' è obbligatorio.");
    });
});

//------------------------------------------FindLabelById-------------------------------------------------------------------------

describe('findLabelById', () => {
    test('should return a label by ID (case 1)', async () => {
        const label = await Label.create({ nome: 'Test Label 1' });

        const labelTrovata = await labelDAO.findLabelById(label._id);

        expect(labelTrovata).toBeTruthy();
        expect(labelTrovata.nome).toBe(label.nome);
    });

    test('should return a label by ID (case 2)', async () => {
        const label = await Label.create({ nome: 'Test Label 2' });

        const labelTrovata = await labelDAO.findLabelById(label._id);

        expect(labelTrovata).toBeTruthy();
        expect(labelTrovata.nome).toBe(label.nome);
    });

    test('should return a label by ID (case 3)', async () => {
        const label = await Label.create({ nome: 'Test Label 3' });

        const labelTrovata = await labelDAO.findLabelById(label._id);

        expect(labelTrovata).toBeTruthy();
        expect(labelTrovata.nome).toBe(label.nome);
    });

    test('should throw an error if labelId is null (case 1)', async () => {
        await expect(labelDAO.findLabelById(null)).rejects.toThrow("L'ID della label non può essere nullo.");
    });

    test('should throw an error if labelId is null (case 2)', async () => {
        await expect(labelDAO.findLabelById(null)).rejects.toThrow("L'ID della label non può essere nullo.");
    });

    test('should throw an error if labelId is null (case 3)', async () => {
        await expect(labelDAO.findLabelById(null)).rejects.toThrow("L'ID della label non può essere nullo.");
    });

    test('should throw an error if label does not exist (case 1)', async () => {
        const nonExistingLabelId = new mongoose.Types.ObjectId();

        await expect(labelDAO.findLabelById(nonExistingLabelId)).rejects.toThrow("Label non trovata.");
    });

    test('should throw an error if label does not exist (case 2)', async () => {
        const nonExistingLabelId = new mongoose.Types.ObjectId();

        await expect(labelDAO.findLabelById(nonExistingLabelId)).rejects.toThrow("Label non trovata.");
    });

    test('should throw an error if label does not exist (case 3)', async () => {
        const nonExistingLabelId = new mongoose.Types.ObjectId();

        await expect(labelDAO.findLabelById(nonExistingLabelId)).rejects.toThrow("Label non trovata.");
    });
});

//------------------------------------------FindAllLabels-------------------------------------------------------------------------

describe('findAllLabels', () => {
    test('should return all labels (case 1)', async () => {
        await Label.create([{ nome: 'Label 1' }, { nome: 'Label 2' }]);

        const labels = await labelDAO.findAllLabels();

        expect(labels).toHaveLength(2);
        expect(labels[0].nome).toBe('Label 1');
        expect(labels[1].nome).toBe('Label 2');
    });

    test('should return all labels (case 2)', async () => {
        await Label.create([{ nome: 'Label 3' }, { nome: 'Label 4' }]);

        const labels = await labelDAO.findAllLabels();

        expect(labels).toHaveLength(2);
        expect(labels[0].nome).toBe('Label 3');
        expect(labels[1].nome).toBe('Label 4');
    });

    test('should return all labels (case 3)', async () => {
        await Label.create([{ nome: 'Label 5' }, { nome: 'Label 6' }]);

        const labels = await labelDAO.findAllLabels();

        expect(labels).toHaveLength(2);
        expect(labels[0].nome).toBe('Label 5');
        expect(labels[1].nome).toBe('Label 6');
    });

    test('should throw an error if no labels are found (case 1)', async () => {
        await expect(labelDAO.findAllLabels()).rejects.toThrow("Non sono presenti labels nel database.");
    });

    test('should throw an error if no labels are found (case 2)', async () => {
        await expect(labelDAO.findAllLabels()).rejects.toThrow("Non sono presenti labels nel database.");
    });

    test('should throw an error if no labels are found (case 3)', async () => {
        await expect(labelDAO.findAllLabels()).rejects.toThrow("Non sono presenti labels nel database.");
    });
});

//------------------------------------------UpdateLabel-------------------------------------------------------------------------

describe('updateLabel', () => {
    test('should update a label with valid input (case 1)', async () => {
        const label = await Label.create({ nome: 'Old Label 1' });

        const aggiornamenti = { nome: 'Updated Label 1' };
        const labelAggiornata = await labelDAO.updateLabel(label._id, aggiornamenti);

        expect(labelAggiornata).toBeTruthy();
        expect(labelAggiornata.nome).toBe(aggiornamenti.nome);
    });

    test('should update a label with valid input (case 2)', async () => {
        const label = await Label.create({ nome: 'Old Label 2' });

        const aggiornamenti = { nome: 'Updated Label 2' };
        const labelAggiornata = await labelDAO.updateLabel(label._id, aggiornamenti);

        expect(labelAggiornata).toBeTruthy();
        expect(labelAggiornata.nome).toBe(aggiornamenti.nome);
    });

    test('should update a label with valid input (case 3)', async () => {
        const label = await Label.create({ nome: 'Old Label 3' });

        const aggiornamenti = { nome: 'Updated Label 3' };
        const labelAggiornata = await labelDAO.updateLabel(label._id, aggiornamenti);

        expect(labelAggiornata).toBeTruthy();
        expect(labelAggiornata.nome).toBe(aggiornamenti.nome);
    });

    test('should throw an error if labelId is null (case 1)', async () => {
        const aggiornamenti = { nome: 'Updated Label' };

        await expect(labelDAO.updateLabel(null, aggiornamenti)).rejects.toThrow("ID della label e aggiornamenti devono essere forniti.");
    });

    test('should throw an error if labelId is null (case 2)', async () => {
        const aggiornamenti = { nome: 'Updated Label' };

        await expect(labelDAO.updateLabel(null, aggiornamenti)).rejects.toThrow("ID della label e aggiornamenti devono essere forniti.");
    });

    test('should throw an error if labelId is null (case 3)', async () => {
        const aggiornamenti = { nome: 'Updated Label' };

        await expect(labelDAO.updateLabel(null, aggiornamenti)).rejects.toThrow("ID della label e aggiornamenti devono essere forniti.");
    });

    test('should throw an error if aggiornamenti is null (case 1)', async () => {
        const label = await Label.create({ nome: 'Old Label' });

        await expect(labelDAO.updateLabel(label._id, null)).rejects.toThrow("ID della label e aggiornamenti devono essere forniti.");
    });

    test('should throw an error if aggiornamenti is null (case 2)', async () => {
        const label = await Label.create({ nome: 'Old Label' });

        await expect(labelDAO.updateLabel(label._id, null)).rejects.toThrow("ID della label e aggiornamenti devono essere forniti.");
    });

    test('should throw an error if aggiornamenti is null (case 3)', async () => {
        const label = await Label.create({ nome: 'Old Label' });

        await expect(labelDAO.updateLabel(label._id, null)).rejects.toThrow("ID della label e aggiornamenti devono essere forniti.");
    });

    test('should throw an error if label does not exist (case 1)', async () => {
        const nonExistingLabelId = new mongoose.Types.ObjectId();
        const aggiornamenti = { nome: 'Updated Label' };

        await expect(labelDAO.updateLabel(nonExistingLabelId, aggiornamenti)).rejects.toThrow("Impossibile aggiornare la label, ID non trovato.");
    });

    test('should throw an error if label does not exist (case 2)', async () => {
        const nonExistingLabelId = new mongoose.Types.ObjectId();
        const aggiornamenti = { nome: 'Updated Label' };

        await expect(labelDAO.updateLabel(nonExistingLabelId, aggiornamenti)).rejects.toThrow("Impossibile aggiornare la label, ID non trovato.");
    });

    test('should throw an error if label does not exist (case 3)', async () => {
        const nonExistingLabelId = new mongoose.Types.ObjectId();
        const aggiornamenti = { nome: 'Updated Label' };

        await expect(labelDAO.updateLabel(nonExistingLabelId, aggiornamenti)).rejects.toThrow("Impossibile aggiornare la label, ID non trovato.");
    });
});

//------------------------------------------DeleteLabel-------------------------------------------------------------------------

describe('deleteLabel', () => {
    test('should delete a label by ID (case 1)', async () => {
        const label = await Label.create({ nome: 'Test Label 1' });

        const labelEliminata = await labelDAO.deleteLabel(label._id);

        expect(labelEliminata).toBeTruthy();
        expect(labelEliminata._id).toEqual(label._id);

        const labelEsiste = await Label.findById(label._id);
        expect(labelEsiste).toBeNull();
    });

    test('should delete a label by ID (case 2)', async () => {
        const label = await Label.create({ nome: 'Test Label 2' });

        const labelEliminata = await labelDAO.deleteLabel(label._id);

        expect(labelEliminata).toBeTruthy();
        expect(labelEliminata._id).toEqual(label._id);

        const labelEsiste = await Label.findById(label._id);
        expect(labelEsiste).toBeNull();
    });

    test('should delete a label by ID (case 3)', async () => {
        const label = await Label.create({ nome: 'Test Label 3' });

        const labelEliminata = await labelDAO.deleteLabel(label._id);

        expect(labelEliminata).toBeTruthy();
        expect(labelEliminata._id).toEqual(label._id);

        const labelEsiste = await Label.findById(label._id);
        expect(labelEsiste).toBeNull();
    });

    test('should throw an error if labelId is null (case 1)', async () => {
        await expect(labelDAO.deleteLabel(null)).rejects.toThrow("L'ID della label non può essere nullo.");
    });

    test('should throw an error if labelId is null (case 2)', async () => {
        await expect(labelDAO.deleteLabel(null)).rejects.toThrow("L'ID della label non può essere nullo.");
    });

    test('should throw an error if labelId is null (case 3)', async () => {
        await expect(labelDAO.deleteLabel(null)).rejects.toThrow("L'ID della label non può essere nullo.");
    });

    test('should throw an error if label does not exist (case 1)', async () => {
        const nonExistingLabelId = new mongoose.Types.ObjectId();

        await expect(labelDAO.deleteLabel(nonExistingLabelId)).rejects.toThrow("Impossibile eliminare la label, ID non trovato.");
    });

    test('should throw an error if label does not exist (case 2)', async () => {
        const nonExistingLabelId = new mongoose.Types.ObjectId();

        await expect(labelDAO.deleteLabel(nonExistingLabelId)).rejects.toThrow("Impossibile eliminare la label, ID non trovato.");
    });

    test('should throw an error if label does not exist (case 3)', async () => {
        const nonExistingLabelId = new mongoose.Types.ObjectId();

        await expect(labelDAO.deleteLabel(nonExistingLabelId)).rejects.toThrow("Impossibile eliminare la label, ID non trovato.");
    });
});

describe('affinitaDAO', () => {

    beforeEach(async () => {
        // Pulisci la collezione prima di ogni test
        await Affinita.deleteMany({});
    });

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