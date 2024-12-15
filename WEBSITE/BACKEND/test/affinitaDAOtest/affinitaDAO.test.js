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
        const input = { user: new mongoose.Types.ObjectId(), participantID: new mongoose.Types.ObjectId(), rating: 4, comment: 'Good' };
        const result = await affinitaDAO.createAffinita(input);
        expect(result).toBeTruthy();
        expect(result.user).toEqual(input.user);
        expect(result.rating).toBe(4);
    });

    test('should create a new affinity (case 2)', async () => {
        const input = { user: new mongoose.Types.ObjectId(), participantID: new mongoose.Types.ObjectId(), rating: 5, comment: 'Excellent' };
        const result = await affinitaDAO.createAffinita(input);
        expect(result).toBeTruthy();
        expect(result.user).toEqual(input.user);
        expect(result.rating).toBe(5);
    });

    test('should create a new affinity (case 3)', async () => {
        const input = { user: new mongoose.Types.ObjectId(), participantID: new mongoose.Types.ObjectId(), rating: 3, comment: 'Average' };
        const result = await affinitaDAO.createAffinita(input);
        expect(result).toBeTruthy();
        expect(result.user).toEqual(input.user);
        expect(result.rating).toBe(3);
    });
});

//------------------------------------------updateRatingAndComment-------------------------------------------------------------------------

describe('updateRatingAndComment', () => {
    test('should update the rating and comment of an affinity (case 1)', async () => {
        const input = { user: new mongoose.Types.ObjectId(), participantID: new mongoose.Types.ObjectId(), rating: 3, comment: 'Average' };
        await Affinita.create(input);
        const updated = await affinitaDAO.updateRatingAndComment(input.user, input.participantID, 5, 'Excellent');
        expect(updated).toBeTruthy();
        expect(updated.rating).toBe(5);
        expect(updated.comment).toBe('Excellent');
    });

    test('should update the rating and comment of an affinity (case 2)', async () => {
        const input = { user: new mongoose.Types.ObjectId(), participantID: new mongoose.Types.ObjectId(), rating: 2, comment: 'Poor' };
        await Affinita.create(input);
        const updated = await affinitaDAO.updateRatingAndComment(input.user, input.participantID, 4, 'Good');
        expect(updated).toBeTruthy();
        expect(updated.rating).toBe(4);
        expect(updated.comment).toBe('Good');
    });

    test('should update the rating and comment of an affinity (case 3)', async () => {
        const input = { user: new mongoose.Types.ObjectId(), participantID: new mongoose.Types.ObjectId(), rating: 1, comment: 'Bad' };
        await Affinita.create(input);
        const updated = await affinitaDAO.updateRatingAndComment(input.user, input.participantID, 3, 'Average');
        expect(updated).toBeTruthy();
        expect(updated.rating).toBe(3);
        expect(updated.comment).toBe('Average');
    });
});

//------------------------------------------getAffinitaByUser-------------------------------------------------------------------------

describe('getAffinitaByUser', () => {
    test('should find all affinities of a user (case 1)', async () => {
        const user = new mongoose.Types.ObjectId();
        const affinita1 = { user, participantID: new mongoose.Types.ObjectId(), rating: 4, comment: 'Good' };
        const affinita2 = { user, participantID: new mongoose.Types.ObjectId(), rating: 5, comment: 'Excellent' };
        await Affinita.create([affinita1, affinita2]);
        const result = await affinitaDAO.getAffinitaByUser(user);
        expect(result.length).toBe(2);
        expect(result[0].rating).toBe(4);
        expect(result[1].rating).toBe(5);
    });

    test('should find all affinities of a user (case 2)', async () => {
        const user = new mongoose.Types.ObjectId();
        const affinita1 = { user, participantID: new mongoose.Types.ObjectId(), rating: 3, comment: 'Average' };
        const affinita2 = { user, participantID: new mongoose.Types.ObjectId(), rating: 2, comment: 'Poor' };
        await Affinita.create([affinita1, affinita2]);
        const result = await affinitaDAO.getAffinitaByUser(user);
        expect(result.length).toBe(2);
        expect(result[0].rating).toBe(3);
        expect(result[1].rating).toBe(2);
    });

    test('should find all affinities of a user (case 3)', async () => {
        const user = new mongoose.Types.ObjectId();
        const affinita1 = { user, participantID: new mongoose.Types.ObjectId(), rating: 1, comment: 'Bad' };
        const affinita2 = { user, participantID: new mongoose.Types.ObjectId(), rating: 4, comment: 'Good' };
        await Affinita.create([affinita1, affinita2]);
        const result = await affinitaDAO.getAffinitaByUser(user);
        expect(result.length).toBe(2);
        expect(result[0].rating).toBe(1);
        expect(result[1].rating).toBe(4);
    });
});

//------------------------------------------deleteAffinita-------------------------------------------------------------------------

describe('deleteAffinita', () => {
    test('should delete an affinity (case 1)', async () => {
        const input = { user: new mongoose.Types.ObjectId(), participantID: new mongoose.Types.ObjectId(), rating: 3, comment: 'Average' };
        const request = await Affinita.create(input);
        const deleted = await affinitaDAO.deleteAffinita(input.user, input.participantID);
        expect(deleted).toBeTruthy();
        expect(deleted.user).toEqual(input.user);
    });

    test('should delete an affinity (case 2)', async () => {
        const input = { user: new mongoose.Types.ObjectId(), participantID: new mongoose.Types.ObjectId(), rating: 2, comment: 'Poor' };
        const request = await Affinita.create(input);
        const deleted = await affinitaDAO.deleteAffinita(input.user, input.participantID);
        expect(deleted).toBeTruthy();
        expect(deleted.user).toEqual(input.user);
    });

    test('should delete an affinity (case 3)', async () => {
        const input = { user: new mongoose.Types.ObjectId(), participantID: new mongoose.Types.ObjectId(), rating: 1, comment: 'Bad' };
        const request = await Affinita.create(input);
        const deleted = await affinitaDAO.deleteAffinita(input.user, input.participantID);
        expect(deleted).toBeTruthy();
        expect(deleted.user).toEqual(input.user);
    });
});
});