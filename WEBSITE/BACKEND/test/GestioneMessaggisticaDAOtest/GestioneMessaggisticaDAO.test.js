const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Messaggio = require('../../database/models/GestioneMessaggisticaModel'); // Il modello CHE USA IL DAO
const GestioneMessaggisticaDAO = require('../../libs/GestioneMessaggisticaDAO'); // DAO DA TESTARE

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
    await Messaggio.deleteMany({});
});

describe('GestioneMessaggisticaDAO', () => {

//------------------------------------------sendMessage-------------------------------------------------------------------------

describe('sendMessage', () => {
    test('should create a new text message with valid input (case 1)', async () => {
        const senderID = new mongoose.Types.ObjectId();
        const receiverID = new mongoose.Types.ObjectId();
        const text = 'Ciao, come stai?';

        const createdMessage = await GestioneMessaggisticaDAO.sendMessage(senderID, receiverID, text);

        expect(createdMessage).toBeTruthy();
        expect(createdMessage.mittenteID).toEqual(senderID);
        expect(createdMessage.destinatarioID).toEqual(receiverID);
        expect(createdMessage.testo).toBe(text);
    });

    test('should create a new text message with valid input (case 2)', async () => {
        const senderID = new mongoose.Types.ObjectId();
        const receiverID = new mongoose.Types.ObjectId();
        const text = 'Buongiorno!';

        const createdMessage = await GestioneMessaggisticaDAO.sendMessage(senderID, receiverID, text);

        expect(createdMessage).toBeTruthy();
        expect(createdMessage.mittenteID).toEqual(senderID);
        expect(createdMessage.destinatarioID).toEqual(receiverID);
        expect(createdMessage.testo).toBe(text);
    });

    test('should create a new text message with valid input (case 3)', async () => {
        const senderID = new mongoose.Types.ObjectId();
        const receiverID = new mongoose.Types.ObjectId();
        const text = 'Buonasera!';

        const createdMessage = await GestioneMessaggisticaDAO.sendMessage(senderID, receiverID, text);

        expect(createdMessage).toBeTruthy();
        expect(createdMessage.mittenteID).toEqual(senderID);
        expect(createdMessage.destinatarioID).toEqual(receiverID);
        expect(createdMessage.testo).toBe(text);
    });

    test('should throw an error if any required field is missing (case 1)', async () => {
        const senderID = new mongoose.Types.ObjectId();
        const receiverID = new mongoose.Types.ObjectId();

        await expect(GestioneMessaggisticaDAO.sendMessage(senderID, receiverID, null)).rejects.toThrow();
    });

    test('should throw an error if any required field is missing (case 2)', async () => {
        const senderID = new mongoose.Types.ObjectId();

        await expect(GestioneMessaggisticaDAO.sendMessage(senderID, null, 'Ciao')).rejects.toThrow();
    });

    test('should throw an error if any required field is missing (case 3)', async () => {
        const receiverID = new mongoose.Types.ObjectId();

        await expect(GestioneMessaggisticaDAO.sendMessage(null, receiverID, 'Ciao')).rejects.toThrow();
    });

    test('should throw an error if text is empty (case 1)', async () => {
        const senderID = new mongoose.Types.ObjectId();
        const receiverID = new mongoose.Types.ObjectId();
        const text = '';

        await expect(GestioneMessaggisticaDAO.sendMessage(senderID, receiverID, text)).rejects.toThrow();
    });

    test('should throw an error if text is empty (case 2)', async () => {
        const senderID = new mongoose.Types.ObjectId();
        const receiverID = new mongoose.Types.ObjectId();
        const text = '';

        await expect(GestioneMessaggisticaDAO.sendMessage(senderID, receiverID, text)).rejects.toThrow();
    });

    test('should throw an error if text is empty (case 3)', async () => {
        const senderID = new mongoose.Types.ObjectId();
        const receiverID = new mongoose.Types.ObjectId();
        const text = '';

        await expect(GestioneMessaggisticaDAO.sendMessage(senderID, receiverID, text)).rejects.toThrow();
    });
});
//------------------------------------------getMessagesBetweenUsers-------------------------------------------------------------------------

describe('getMessagesBetweenUsers', () => {
    test('should return all messages between two users (case 1)', async () => {
        const user1ID = new mongoose.Types.ObjectId();
        const user2ID = new mongoose.Types.ObjectId();
        await Messaggio.create({ mittenteID: user1ID, destinatarioID: user2ID, testo: 'Messaggio 1' });
        await Messaggio.create({ mittenteID: user2ID, destinatarioID: user1ID, testo: 'Messaggio 2' });

        const messages = await GestioneMessaggisticaDAO.getMessagesBetweenUsers(user1ID, user2ID);

        expect(messages).toHaveLength(2);
        expect(messages[0].testo).toBe('Messaggio 1');
        expect(messages[1].testo).toBe('Messaggio 2');
    });

    test('should return all messages between two users (case 2)', async () => {
        const user1ID = new mongoose.Types.ObjectId();
        const user2ID = new mongoose.Types.ObjectId();
        await Messaggio.create({ mittenteID: user1ID, destinatarioID: user2ID, testo: 'Messaggio A' });
        await Messaggio.create({ mittenteID: user2ID, destinatarioID: user1ID, testo: 'Messaggio B' });

        const messages = await GestioneMessaggisticaDAO.getMessagesBetweenUsers(user1ID, user2ID);

        expect(messages).toHaveLength(2);
        expect(messages[0].testo).toBe('Messaggio A');
        expect(messages[1].testo).toBe('Messaggio B');
    });

    test('should return all messages between two users (case 3)', async () => {
        const user1ID = new mongoose.Types.ObjectId();
        const user2ID = new mongoose.Types.ObjectId();
        await Messaggio.create({ mittenteID: user1ID, destinatarioID: user2ID, testo: 'Messaggio X' });
        await Messaggio.create({ mittenteID: user2ID, destinatarioID: user1ID, testo: 'Messaggio Y' });

        const messages = await GestioneMessaggisticaDAO.getMessagesBetweenUsers(user1ID, user2ID);

        expect(messages).toHaveLength(2);
        expect(messages[0].testo).toBe('Messaggio X');
        expect(messages[1].testo).toBe('Messaggio Y');
    });

    test('should return an empty array if no messages exist between users (case 1)', async () => {
        const user1ID = new mongoose.Types.ObjectId();
        const user2ID = new mongoose.Types.ObjectId();

        const messages = await GestioneMessaggisticaDAO.getMessagesBetweenUsers(user1ID, user2ID);

        expect(messages).toHaveLength(0);
    });

    test('should return an empty array if no messages exist between users (case 2)', async () => {
        const user1ID = new mongoose.Types.ObjectId();
        const user2ID = new mongoose.Types.ObjectId();

        const messages = await GestioneMessaggisticaDAO.getMessagesBetweenUsers(user1ID, user2ID);

        expect(messages).toHaveLength(0);
    });

    test('should return an empty array if no messages exist between users (case 3)', async () => {
        const user1ID = new mongoose.Types.ObjectId();
        const user2ID = new mongoose.Types.ObjectId();

        const messages = await GestioneMessaggisticaDAO.getMessagesBetweenUsers(user1ID, user2ID);

        expect(messages).toHaveLength(0);
    });

    test('should throw an error if any user ID is missing (case 1)', async () => {
        const user1ID = new mongoose.Types.ObjectId();

        await expect(GestioneMessaggisticaDAO.getMessagesBetweenUsers(user1ID, null)).rejects.toThrow();
    });

    test('should throw an error if any user ID is missing (case 2)', async () => {
        const user1ID = new mongoose.Types.ObjectId();

        await expect(GestioneMessaggisticaDAO.getMessagesBetweenUsers(null, user1ID)).rejects.toThrow();
    });

    test('should throw an error if any user ID is missing (case 3)', async () => {
        const user1ID = new mongoose.Types.ObjectId();

        await expect(GestioneMessaggisticaDAO.getMessagesBetweenUsers(null, user1ID)).rejects.toThrow();
    });
});

//------------------------------------------notifyMessage-------------------------------------------------------------------------

describe('notifyMessage', () => {
    test('should mark a message as notified (case 1)', async () => {
        const receiverID = new mongoose.Types.ObjectId();
        const message = await Messaggio.create({ mittenteID: new mongoose.Types.ObjectId(), destinatarioID: receiverID, testo: 'Messaggio 1' });

        const notifiedMessage = await GestioneMessaggisticaDAO.notifyMessage(receiverID, message._id);

        expect(notifiedMessage).toBeTruthy();
        expect(notifiedMessage.notificato).toBe(true);
    });

    test('should mark a message as notified (case 2)', async () => {
        const receiverID = new mongoose.Types.ObjectId();
        const message = await Messaggio.create({ mittenteID: new mongoose.Types.ObjectId(), destinatarioID: receiverID, testo: 'Messaggio 2' });

        const notifiedMessage = await GestioneMessaggisticaDAO.notifyMessage(receiverID, message._id);

        expect(notifiedMessage).toBeTruthy();
        expect(notifiedMessage.notificato).toBe(true);
    });

    test('should mark a message as notified (case 3)', async () => {
        const receiverID = new mongoose.Types.ObjectId();
        const message = await Messaggio.create({ mittenteID: new mongoose.Types.ObjectId(), destinatarioID: receiverID, testo: 'Messaggio 3' });

        const notifiedMessage = await GestioneMessaggisticaDAO.notifyMessage(receiverID, message._id);

        expect(notifiedMessage).toBeTruthy();
        expect(notifiedMessage.notificato).toBe(true);
    });

    test('should throw an error if message ID is invalid (case 1)', async () => {
        const receiverID = new mongoose.Types.ObjectId();
        const invalidMessageID = 'invalid-id';

        await expect(GestioneMessaggisticaDAO.notifyMessage(receiverID, invalidMessageID)).rejects.toThrow();
    });

    test('should throw an error if message ID is invalid (case 2)', async () => {
        const receiverID = new mongoose.Types.ObjectId();
        const invalidMessageID = 'invalid-id';

        await expect(GestioneMessaggisticaDAO.notifyMessage(receiverID, invalidMessageID)).rejects.toThrow();
    });

    test('should throw an error if message ID is invalid (case 3)', async () => {
        const receiverID = new mongoose.Types.ObjectId();
        const invalidMessageID = 'invalid-id';

        await expect(GestioneMessaggisticaDAO.notifyMessage(receiverID, invalidMessageID)).rejects.toThrow();
    });

    test('should throw an error if message does not exist (case 1)', async () => {
        const receiverID = new mongoose.Types.ObjectId();
        const nonExistingMessageID = new mongoose.Types.ObjectId();

        await expect(GestioneMessaggisticaDAO.notifyMessage(receiverID, nonExistingMessageID)).rejects.toThrow();
    });

    test('should throw an error if message does not exist (case 2)', async () => {
        const receiverID = new mongoose.Types.ObjectId();
        const nonExistingMessageID = new mongoose.Types.ObjectId();

        await expect(GestioneMessaggisticaDAO.notifyMessage(receiverID, nonExistingMessageID)).rejects.toThrow();
    });

    test('should throw an error if message does not exist (case 3)', async () => {
        const receiverID = new mongoose.Types.ObjectId();
        const nonExistingMessageID = new mongoose.Types.ObjectId();

        await expect(GestioneMessaggisticaDAO.notifyMessage(receiverID, nonExistingMessageID)).rejects.toThrow();
    });
});

//------------------------------------------sendMultimediaMessage-------------------------------------------------------------------------

describe('sendMultimediaMessage', () => {
    test('should create a new multimedia message with valid input (case 1)', async () => {
        const senderID = new mongoose.Types.ObjectId();
        const receiverID = new mongoose.Types.ObjectId();
        const media = 'path/to/media/file1.jpg';

        const createdMessage = await GestioneMessaggisticaDAO.sendMultimediaMessage(senderID, receiverID, media);

        expect(createdMessage).toBeTruthy();
        expect(createdMessage.mittenteID).toEqual(senderID);
        expect(createdMessage.destinatarioID).toEqual(receiverID);
        expect(createdMessage.media).toBe(media);
    });

    test('should create a new multimedia message with valid input (case 2)', async () => {
        const senderID = new mongoose.Types.ObjectId();
        const receiverID = new mongoose.Types.ObjectId();
        const media = 'path/to/media/file2.jpg';

        const createdMessage = await GestioneMessaggisticaDAO.sendMultimediaMessage(senderID, receiverID, media);

        expect(createdMessage).toBeTruthy();
        expect(createdMessage.mittenteID).toEqual(senderID);
        expect(createdMessage.destinatarioID).toEqual(receiverID);
        expect(createdMessage.media).toBe(media);
    });

    test('should create a new multimedia message with valid input (case 3)', async () => {
        const senderID = new mongoose.Types.ObjectId();
        const receiverID = new mongoose.Types.ObjectId();
        const media = 'path/to/media/file3.jpg';

        const createdMessage = await GestioneMessaggisticaDAO.sendMultimediaMessage(senderID, receiverID, media);

        expect(createdMessage).toBeTruthy();
        expect(createdMessage.mittenteID).toEqual(senderID);
        expect(createdMessage.destinatarioID).toEqual(receiverID);
        expect(createdMessage.media).toBe(media);
    });

    test('should throw an error if any required field is missing (case 1)', async () => {
        const senderID = new mongoose.Types.ObjectId();
        const receiverID = new mongoose.Types.ObjectId();

        await expect(GestioneMessaggisticaDAO.sendMultimediaMessage(senderID, receiverID, null)).rejects.toThrow();
    });

    test('should throw an error if any required field is missing (case 2)', async () => {
        const senderID = new mongoose.Types.ObjectId();

        await expect(GestioneMessaggisticaDAO.sendMultimediaMessage(senderID, null, 'path/to/media/file.jpg')).rejects.toThrow();
    });

    test('should throw an error if any required field is missing (case 3)', async () => {
        const receiverID = new mongoose.Types.ObjectId();

        await expect(GestioneMessaggisticaDAO.sendMultimediaMessage(null, receiverID, 'path/to/media/file.jpg')).rejects.toThrow();
    });

    test('should throw an error if media path is empty (case 1)', async () => {
        const senderID = new mongoose.Types.ObjectId();
        const receiverID = new mongoose.Types.ObjectId();
        const media = '';

        await expect(GestioneMessaggisticaDAO.sendMultimediaMessage(senderID, receiverID, media)).rejects.toThrow();
    });

    test('should throw an error if media path is empty (case 2)', async () => {
        const senderID = new mongoose.Types.ObjectId();
        const receiverID = new mongoose.Types.ObjectId();
        const media = '';

        await expect(GestioneMessaggisticaDAO.sendMultimediaMessage(senderID, receiverID, media)).rejects.toThrow();
    });

    test('should throw an error if media path is empty (case 3)', async () => {
        const senderID = new mongoose.Types.ObjectId();
        const receiverID = new mongoose.Types.ObjectId();
        const media = '';

        await expect(GestioneMessaggisticaDAO.sendMultimediaMessage(senderID, receiverID, media)).rejects.toThrow();
    });
});

//------------------------------------------deleteMessage-------------------------------------------------------------------------

describe('deleteMessage', () => {
    test('should delete an existing message (case 1)', async () => {
        const message = await Messaggio.create({ mittenteID: new mongoose.Types.ObjectId(), destinatarioID: new mongoose.Types.ObjectId(), testo: 'Messaggio 1' });

        const deletedMessage = await GestioneMessaggisticaDAO.deleteMessage(message._id);

        expect(deletedMessage).toBeTruthy();
        expect(deletedMessage._id).toEqual(message._id);

        const foundMessage = await Messaggio.findById(message._id);
        expect(foundMessage).toBeNull();
    });

    test('should delete an existing message (case 2)', async () => {
        const message = await Messaggio.create({ mittenteID: new mongoose.Types.ObjectId(), destinatarioID: new mongoose.Types.ObjectId(), testo: 'Messaggio 2' });

        const deletedMessage = await GestioneMessaggisticaDAO.deleteMessage(message._id);

        expect(deletedMessage).toBeTruthy();
        expect(deletedMessage._id).toEqual(message._id);

        const foundMessage = await Messaggio.findById(message._id);
        expect(foundMessage).toBeNull();
    });

    test('should delete an existing message (case 3)', async () => {
        const message = await Messaggio.create({ mittenteID: new mongoose.Types.ObjectId(), destinatarioID: new mongoose.Types.ObjectId(), testo: 'Messaggio 3' });

        const deletedMessage = await GestioneMessaggisticaDAO.deleteMessage(message._id);

        expect(deletedMessage).toBeTruthy();
        expect(deletedMessage._id).toEqual(message._id);

        const foundMessage = await Messaggio.findById(message._id);
        expect(foundMessage).toBeNull();
    });

    test('should return null for a non-existing message (case 1)', async () => {
        const nonExistingMessageID = new mongoose.Types.ObjectId();

        const deletedMessage = await GestioneMessaggisticaDAO.deleteMessage(nonExistingMessageID);

        expect(deletedMessage).toBeNull();
    });

    test('should return null for a non-existing message (case 2)', async () => {
        const nonExistingMessageID = new mongoose.Types.ObjectId();

        const deletedMessage = await GestioneMessaggisticaDAO.deleteMessage(nonExistingMessageID);

        expect(deletedMessage).toBeNull();
    });

    test('should return null for a non-existing message (case 3)', async () => {
        const nonExistingMessageID = new mongoose.Types.ObjectId();

        const deletedMessage = await GestioneMessaggisticaDAO.deleteMessage(nonExistingMessageID);

        expect(deletedMessage).toBeNull();
    });

    test('should throw an error for an invalid message ID (case 1)', async () => {
        const invalidMessageID = 'invalid-id';

        await expect(GestioneMessaggisticaDAO.deleteMessage(invalidMessageID)).rejects.toThrow();
    });

    test('should throw an error for an invalid message ID (case 2)', async () => {
        const invalidMessageID = 'invalid-id';

        await expect(GestioneMessaggisticaDAO.deleteMessage(invalidMessageID)).rejects.toThrow();
    });

    test('should throw an error for an invalid message ID (case 3)', async () => {
        const invalidMessageID = 'invalid-id';

        await expect(GestioneMessaggisticaDAO.deleteMessage(invalidMessageID)).rejects.toThrow();
    });
});

//------------------------------------------markMessageAsRead-------------------------------------------------------------------------

describe('markMessageAsRead', () => {
    test('should mark a message as read (case 1)', async () => {
        const message = await Messaggio.create({ mittenteID: new mongoose.Types.ObjectId(), destinatarioID: new mongoose.Types.ObjectId(), testo: 'Messaggio 1' });

        const readMessage = await GestioneMessaggisticaDAO.markMessageAsRead(message._id, 'letto');

        expect(readMessage).toBeTruthy();
        expect(readMessage.stato).toBe('letto');
    });

    test('should mark a message as read (case 2)', async () => {
        const message = await Messaggio.create({ mittenteID: new mongoose.Types.ObjectId(), destinatarioID: new mongoose.Types.ObjectId(), testo: 'Messaggio 2' });

        const readMessage = await GestioneMessaggisticaDAO.markMessageAsRead(message._id, 'letto');

        expect(readMessage).toBeTruthy();
        expect(readMessage.stato).toBe('letto');
    });

    test('should mark a message as read (case 3)', async () => {
        const message = await Messaggio.create({ mittenteID: new mongoose.Types.ObjectId(), destinatarioID: new mongoose.Types.ObjectId(), testo: 'Messaggio 3' });

        const readMessage = await GestioneMessaggisticaDAO.markMessageAsRead(message._id, 'letto');

        expect(readMessage).toBeTruthy();
        expect(readMessage.stato).toBe('letto');
    });

    test('should throw an error if message ID is invalid (case 1)', async () => {
        const invalidMessageID = 'invalid-id';

        await expect(GestioneMessaggisticaDAO.markMessageAsRead(invalidMessageID, 'letto')).rejects.toThrow();
    });

    test('should throw an error if message ID is invalid (case 2)', async () => {
        const invalidMessageID = 'invalid-id';

        await expect(GestioneMessaggisticaDAO.markMessageAsRead(invalidMessageID, 'letto')).rejects.toThrow();
    });

    test('should throw an error if message ID is invalid (case 3)', async () => {
        const invalidMessageID = 'invalid-id';

        await expect(GestioneMessaggisticaDAO.markMessageAsRead(invalidMessageID, 'letto')).rejects.toThrow();
    });

    test('should throw an error if message does not exist (case 1)', async () => {
        const nonExistingMessageID = new mongoose.Types.ObjectId();

        await expect(GestioneMessaggisticaDAO.markMessageAsRead(nonExistingMessageID, 'letto')).rejects.toThrow();
    });

    test('should throw an error if message does not exist (case 2)', async () => {
        const nonExistingMessageID = new mongoose.Types.ObjectId();

        await expect(GestioneMessaggisticaDAO.markMessageAsRead(nonExistingMessageID, 'letto')).rejects.toThrow();
    });

    test('should throw an error if message does not exist (case 3)', async () => {
        const nonExistingMessageID = new mongoose.Types.ObjectId();

        await expect(GestioneMessaggisticaDAO.markMessageAsRead(nonExistingMessageID, 'letto')).rejects.toThrow();
    });
});
});