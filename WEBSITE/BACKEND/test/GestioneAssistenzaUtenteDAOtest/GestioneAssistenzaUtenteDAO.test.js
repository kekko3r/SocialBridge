const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const AssistenzaUtente = require('../../database/models/GestioneAssistenzaUtenteModel'); // Il modello CHE USA IL DAO
const GestioneAssistenzaUtenteDAO = require('../../libs/GestioneAssistenzaUtenteDAO'); // DAO DA TESTARE

let mongoServer;

beforeAll(async () => {
    // Avvia un'istanza di MongoDB in memoria
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
  
    // Connettiti all'istanza di MongoDB
    await mongoose.connect(uri);
});
  
afterAll(async () => {
    // Chiudi la connessione a MongoDB e termina il server
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    // Pulisci il database prima di ogni test
    await AssistenzaUtente.deleteMany({});
});

describe('GestioneAssistenzaUtenteDAO', () => {

//------------------------------------------submitSupportRequest-------------------------------------------------------------------------

describe('submitSupportRequest', () => {
    test('should create a new support request with valid input (case 1)', async () => {
        const supportRequest = {
            userID: new mongoose.Types.ObjectId(),
            issueDetails: 'Problema con il login',
            attachments: ['screenshot1.png', 'screenshot2.png']
        };

        const createdRequest = await GestioneAssistenzaUtenteDAO.submitSupportRequest(supportRequest);

        expect(createdRequest).toBeTruthy();
        expect(createdRequest.userID).toEqual(supportRequest.userID);
        expect(createdRequest.issueDetails).toBe(supportRequest.issueDetails);
        expect(createdRequest.attachments).toEqual(supportRequest.attachments);
    });

    test('should create a new support request with valid input (case 2)', async () => {
        const supportRequest = {
            userID: new mongoose.Types.ObjectId(),
            issueDetails: 'Problema con la registrazione',
            attachments: ['screenshot3.png']
        };

        const createdRequest = await GestioneAssistenzaUtenteDAO.submitSupportRequest(supportRequest);

        expect(createdRequest).toBeTruthy();
        expect(createdRequest.userID).toEqual(supportRequest.userID);
        expect(createdRequest.issueDetails).toBe(supportRequest.issueDetails);
        expect(createdRequest.attachments).toEqual(supportRequest.attachments);
    });

    test('should create a new support request with valid input (case 3)', async () => {
        const supportRequest = {
            userID: new mongoose.Types.ObjectId(),
            issueDetails: 'Problema con il pagamento',
            attachments: []
        };

        const createdRequest = await GestioneAssistenzaUtenteDAO.submitSupportRequest(supportRequest);

        expect(createdRequest).toBeTruthy();
        expect(createdRequest.userID).toEqual(supportRequest.userID);
        expect(createdRequest.issueDetails).toBe(supportRequest.issueDetails);
        expect(createdRequest.attachments).toEqual(supportRequest.attachments);
    });

    test('should throw an error if userID is missing (case 1)', async () => {
        const supportRequest = {
            issueDetails: 'Problema con il login',
            attachments: ['screenshot1.png', 'screenshot2.png']
        };

        await expect(GestioneAssistenzaUtenteDAO.submitSupportRequest(supportRequest)).rejects.toThrow('L\'ID dell\'utente è obbligatorio');
    });

    test('should throw an error if userID is missing (case 2)', async () => {
        const supportRequest = {
            issueDetails: 'Problema con la registrazione',
            attachments: ['screenshot3.png']
        };

        await expect(GestioneAssistenzaUtenteDAO.submitSupportRequest(supportRequest)).rejects.toThrow('L\'ID dell\'utente è obbligatorio');
    });

    test('should throw an error if userID is missing (case 3)', async () => {
        const supportRequest = {
            issueDetails: 'Problema con il pagamento',
            attachments: []
        };

        await expect(GestioneAssistenzaUtenteDAO.submitSupportRequest(supportRequest)).rejects.toThrow('L\'ID dell\'utente è obbligatorio');
    });

    test('should throw an error if issueDetails is missing (case 1)', async () => {
        const supportRequest = {
            userID: new mongoose.Types.ObjectId(),
            attachments: ['screenshot1.png', 'screenshot2.png']
        };

        await expect(GestioneAssistenzaUtenteDAO.submitSupportRequest(supportRequest)).rejects.toThrow('I dettagli del problema sono obbligatori');
    });

    test('should throw an error if issueDetails is missing (case 2)', async () => {
        const supportRequest = {
            userID: new mongoose.Types.ObjectId(),
            attachments: ['screenshot3.png']
        };

        await expect(GestioneAssistenzaUtenteDAO.submitSupportRequest(supportRequest)).rejects.toThrow('I dettagli del problema sono obbligatori');
    });

    test('should throw an error if issueDetails is missing (case 3)', async () => {
        const supportRequest = {
            userID: new mongoose.Types.ObjectId(),
            attachments: []
        };

        await expect(GestioneAssistenzaUtenteDAO.submitSupportRequest(supportRequest)).rejects.toThrow('I dettagli del problema sono obbligatori');
    });
});

//------------------------------------------getSupportRequests-------------------------------------------------------------------------

describe('getSupportRequests', () => {
    test('should return all support requests for a user (case 1)', async () => {
        const userID = new mongoose.Types.ObjectId();
        await AssistenzaUtente.create({ userID, issueDetails: 'Problema 1' });
        await AssistenzaUtente.create({ userID, issueDetails: 'Problema 2' });

        const requests = await GestioneAssistenzaUtenteDAO.getSupportRequests(userID);

        expect(requests).toHaveLength(2);
        expect(requests[0].issueDetails).toBe('Problema 1');
        expect(requests[1].issueDetails).toBe('Problema 2');
    });

    test('should return all support requests for a user (case 2)', async () => {
        const userID = new mongoose.Types.ObjectId();
        await AssistenzaUtente.create({ userID, issueDetails: 'Problema A' });
        await AssistenzaUtente.create({ userID, issueDetails: 'Problema B' });

        const requests = await GestioneAssistenzaUtenteDAO.getSupportRequests(userID);

        expect(requests).toHaveLength(2);
        expect(requests[0].issueDetails).toBe('Problema A');
        expect(requests[1].issueDetails).toBe('Problema B');
    });

    test('should return all support requests for a user (case 3)', async () => {
        const userID = new mongoose.Types.ObjectId();
        await AssistenzaUtente.create({ userID, issueDetails: 'Problema X' });
        await AssistenzaUtente.create({ userID, issueDetails: 'Problema Y' });

        const requests = await GestioneAssistenzaUtenteDAO.getSupportRequests(userID);

        expect(requests).toHaveLength(2);
        expect(requests[0].issueDetails).toBe('Problema X');
        expect(requests[1].issueDetails).toBe('Problema Y');
    });

    test('should return an empty array if no support requests exist for a user (case 1)', async () => {
        const userID = new mongoose.Types.ObjectId();

        const requests = await GestioneAssistenzaUtenteDAO.getSupportRequests(userID);

        expect(requests).toHaveLength(0);
    });

    test('should return an empty array if no support requests exist for a user (case 2)', async () => {
        const userID = new mongoose.Types.ObjectId();

        const requests = await GestioneAssistenzaUtenteDAO.getSupportRequests(userID);

        expect(requests).toHaveLength(0);
    });

    test('should return an empty array if no support requests exist for a user (case 3)', async () => {
        const userID = new mongoose.Types.ObjectId();

        const requests = await GestioneAssistenzaUtenteDAO.getSupportRequests(userID);

        expect(requests).toHaveLength(0);
    });

    test('should throw an error if userID is missing (case 1)', async () => {
        await expect(GestioneAssistenzaUtenteDAO.getSupportRequests(null)).rejects.toThrow('L\'ID dell\'utente è obbligatorio');
    });

    test('should throw an error if userID is missing (case 2)', async () => {
        await expect(GestioneAssistenzaUtenteDAO.getSupportRequests(null)).rejects.toThrow('L\'ID dell\'utente è obbligatorio');
    });

    test('should throw an error if userID is missing (case 3)', async () => {
        await expect(GestioneAssistenzaUtenteDAO.getSupportRequests(null)).rejects.toThrow('L\'ID dell\'utente è obbligatorio');
    });
});

//------------------------------------------resolveSupportRequest-------------------------------------------------------------------------

describe('resolveSupportRequest', () => {
    test('should update the status of a support request to resolved (case 1)', async () => {
        const supportRequest = await AssistenzaUtente.create({
            userID: new mongoose.Types.ObjectId(),
            issueDetails: 'Problema con il login'
        });

        const updatedRequest = await GestioneAssistenzaUtenteDAO.resolveSupportRequest(supportRequest._id, 'resolved');

        expect(updatedRequest).toBeTruthy();
        expect(updatedRequest.status).toBe('resolved');
    });

    test('should update the status of a support request to resolved (case 2)', async () => {
        const supportRequest = await AssistenzaUtente.create({
            userID: new mongoose.Types.ObjectId(),
            issueDetails: 'Problema con la registrazione'
        });

        const updatedRequest = await GestioneAssistenzaUtenteDAO.resolveSupportRequest(supportRequest._id, 'resolved');

        expect(updatedRequest).toBeTruthy();
        expect(updatedRequest.status).toBe('resolved');
    });

    test('should update the status of a support request to resolved (case 3)', async () => {
        const supportRequest = await AssistenzaUtente.create({
            userID: new mongoose.Types.ObjectId(),
            issueDetails: 'Problema con il pagamento'
        });

        const updatedRequest = await GestioneAssistenzaUtenteDAO.resolveSupportRequest(supportRequest._id, 'resolved');

        expect(updatedRequest).toBeTruthy();
        expect(updatedRequest.status).toBe('resolved');
    });

    test('should update the status of a support request to closed (case 1)', async () => {
        const supportRequest = await AssistenzaUtente.create({
            userID: new mongoose.Types.ObjectId(),
            issueDetails: 'Problema con il login'
        });

        const updatedRequest = await GestioneAssistenzaUtenteDAO.resolveSupportRequest(supportRequest._id, 'closed');

        expect(updatedRequest).toBeTruthy();
        expect(updatedRequest.status).toBe('closed');
    });

    test('should update the status of a support request to closed (case 2)', async () => {
        const supportRequest = await AssistenzaUtente.create({
            userID: new mongoose.Types.ObjectId(),
            issueDetails: 'Problema con la registrazione'
        });

        const updatedRequest = await GestioneAssistenzaUtenteDAO.resolveSupportRequest(supportRequest._id, 'closed');

        expect(updatedRequest).toBeTruthy();
        expect(updatedRequest.status).toBe('closed');
    });

    test('should update the status of a support request to closed (case 3)', async () => {
        const supportRequest = await AssistenzaUtente.create({
            userID: new mongoose.Types.ObjectId(),
            issueDetails: 'Problema con il pagamento'
        });

        const updatedRequest = await GestioneAssistenzaUtenteDAO.resolveSupportRequest(supportRequest._id, 'closed');

        expect(updatedRequest).toBeTruthy();
        expect(updatedRequest.status).toBe('closed');
    });

    test('should throw an error if requestID is invalid (case 1)', async () => {
        const invalidRequestID = 'invalid-id';

        await expect(GestioneAssistenzaUtenteDAO.resolveSupportRequest(invalidRequestID, 'resolved')).rejects.toThrow('ID della richiesta non valido');
    });

    test('should throw an error if requestID is invalid (case 2)', async () => {
        const invalidRequestID = 'invalid-id';

        await expect(GestioneAssistenzaUtenteDAO.resolveSupportRequest(invalidRequestID, 'resolved')).rejects.toThrow('ID della richiesta non valido');
    });

    test('should throw an error if requestID is invalid (case 3)', async () => {
        const invalidRequestID = 'invalid-id';

        await expect(GestioneAssistenzaUtenteDAO.resolveSupportRequest(invalidRequestID, 'resolved')).rejects.toThrow('ID della richiesta non valido');
    });

    test('should throw an error if status is invalid (case 1)', async () => {
        const supportRequest = await AssistenzaUtente.create({
            userID: new mongoose.Types.ObjectId(),
            issueDetails: 'Problema con il login'
        });

        await expect(GestioneAssistenzaUtenteDAO.resolveSupportRequest(supportRequest._id, 'invalid-status')).rejects.toThrow('Stato non valido per la risoluzione della richiesta');
    });

    test('should throw an error if status is invalid (case 2)', async () => {
        const supportRequest = await AssistenzaUtente.create({
            userID: new mongoose.Types.ObjectId(),
            issueDetails: 'Problema con la registrazione'
        });

        await expect(GestioneAssistenzaUtenteDAO.resolveSupportRequest(supportRequest._id, 'invalid-status')).rejects.toThrow('Stato non valido per la risoluzione della richiesta');
    });

    test('should throw an error if status is invalid (case 3)', async () => {
        const supportRequest = await AssistenzaUtente.create({
            userID: new mongoose.Types.ObjectId(),
            issueDetails: 'Problema con il pagamento'
        });

        await expect(GestioneAssistenzaUtenteDAO.resolveSupportRequest(supportRequest._id, 'invalid-status')).rejects.toThrow('Stato non valido per la risoluzione della richiesta');
    });
});

//------------------------------------------deleteSupportRequest-------------------------------------------------------------------------

describe('deleteSupportRequest', () => {
    test('should delete an existing support request (case 1)', async () => {
        const supportRequest = await AssistenzaUtente.create({
            userID: new mongoose.Types.ObjectId(),
            issueDetails: 'Problema con il login'
        });

        const deletedRequest = await GestioneAssistenzaUtenteDAO.deleteSupportRequest(supportRequest._id);

        expect(deletedRequest).toBeTruthy();
        expect(deletedRequest._id).toEqual(supportRequest._id);

        const foundRequest = await AssistenzaUtente.findById(supportRequest._id);
        expect(foundRequest).toBeNull();
    });

    test('should delete an existing support request (case 2)', async () => {
        const supportRequest = await AssistenzaUtente.create({
            userID: new mongoose.Types.ObjectId(),
            issueDetails: 'Problema con la registrazione'
        });

        const deletedRequest = await GestioneAssistenzaUtenteDAO.deleteSupportRequest(supportRequest._id);

        expect(deletedRequest).toBeTruthy();
        expect(deletedRequest._id).toEqual(supportRequest._id);

        const foundRequest = await AssistenzaUtente.findById(supportRequest._id);
        expect(foundRequest).toBeNull();
    });

    test('should delete an existing support request (case 3)', async () => {
        const supportRequest = await AssistenzaUtente.create({
            userID: new mongoose.Types.ObjectId(),
            issueDetails: 'Problema con il pagamento'
        });

        const deletedRequest = await GestioneAssistenzaUtenteDAO.deleteSupportRequest(supportRequest._id);

        expect(deletedRequest).toBeTruthy();
        expect(deletedRequest._id).toEqual(supportRequest._id);

        const foundRequest = await AssistenzaUtente.findById(supportRequest._id);
        expect(foundRequest).toBeNull();
    });

    test('should return null for a non-existing support request (case 1)', async () => {
        const nonExistingRequestID = new mongoose.Types.ObjectId();

        const deletedRequest = await GestioneAssistenzaUtenteDAO.deleteSupportRequest(nonExistingRequestID);

        expect(deletedRequest).toBeNull();
    });

    test('should return null for a non-existing support request (case 2)', async () => {
        const nonExistingRequestID = new mongoose.Types.ObjectId();

        const deletedRequest = await GestioneAssistenzaUtenteDAO.deleteSupportRequest(nonExistingRequestID);

        expect(deletedRequest).toBeNull();
    });

    test('should return null for a non-existing support request (case 3)', async () => {
        const nonExistingRequestID = new mongoose.Types.ObjectId();

        const deletedRequest = await GestioneAssistenzaUtenteDAO.deleteSupportRequest(nonExistingRequestID);

        expect(deletedRequest).toBeNull();
    });

    test('should throw an error for an invalid request ID (case 1)', async () => {
        const invalidRequestID = 'invalid-id';

        await expect(GestioneAssistenzaUtenteDAO.deleteSupportRequest(invalidRequestID)).rejects.toThrow('ID della richiesta non valido');
    });

    test('should throw an error for an invalid request ID (case 2)', async () => {
        const invalidRequestID = 'invalid-id';

        await expect(GestioneAssistenzaUtenteDAO.deleteSupportRequest(invalidRequestID)).rejects.toThrow('ID della richiesta non valido');
    });

    test('should throw an error for an invalid request ID (case 3)', async () => {
        const invalidRequestID = 'invalid-id';

        await expect(GestioneAssistenzaUtenteDAO.deleteSupportRequest(invalidRequestID)).rejects.toThrow('ID della richiesta non valido');
    });
});
});