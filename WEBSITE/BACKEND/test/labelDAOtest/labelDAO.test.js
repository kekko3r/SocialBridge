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

describe('labelDAO', () => {

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

    test('should throw an error if label is null (case 1)', async () => {
        await expect(labelDAO.createLabel(null)).rejects.toThrow("Il campo 'nome' è obbligatorio.");
    });

    test('should throw an error if label is null (case 2)', async () => {
        await expect(labelDAO.createLabel(null)).rejects.toThrow("Il campo 'nome' è obbligatorio.");
    });

    test('should throw an error if label is null (case 3)', async () => {
        await expect(labelDAO.createLabel(null)).rejects.toThrow("Il campo 'nome' è obbligatorio.");
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
        await Label.create([{ nome: 'Label A' }, { nome: 'Label B' }]);

        const labels = await labelDAO.findAllLabels();

        expect(labels).toHaveLength(2);
        expect(labels[0].nome).toBe('Label A');
        expect(labels[1].nome).toBe('Label B');
    });

    test('should return all labels (case 3)', async () => {
        await Label.create([{ nome: 'Label X' }, { nome: 'Label Y' }]);

        const labels = await labelDAO.findAllLabels();

        expect(labels).toHaveLength(2);
        expect(labels[0].nome).toBe('Label X');
        expect(labels[1].nome).toBe('Label Y');
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
        const label = await Label.create({ nome: 'Old Label' });

        const aggiornamenti = { nome: 'Updated Label' };
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
        const label = await Label.create({ nome: 'Old Label 2' });

        await expect(labelDAO.updateLabel(label._id, null)).rejects.toThrow("ID della label e aggiornamenti devono essere forniti.");
    });

    test('should throw an error if aggiornamenti is null (case 3)', async () => {
        const label = await Label.create({ nome: 'Old Label 3' });

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
});