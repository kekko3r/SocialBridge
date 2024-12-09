const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Notifiche = require('../../database/models/GestioneNotificheModel'); // Modello per Notifiche
const GestioneNotificheDAO = require('../../libs/GestioneNotificheDAO'); // DAO DA TESTARE

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
    await Notifiche.deleteMany(); // Pulisci il database tra i test
});

describe('GestioneNotificheDAO', () => {

//------------------------------------------SendNotification-------------------------------------------------------------------------

describe('sendNotification', () => {
    test('should send a notification with valid input (case 1)', async () => {
        const userID = new mongoose.Types.ObjectId();
        const messaggio = 'Test notification message 1';

        const notifica = await GestioneNotificheDAO.sendNotification(userID, messaggio);

        expect(notifica).toBeTruthy();
        expect(notifica.userID).toEqual(userID);
        expect(notifica.messaggio).toBe(messaggio);
    });

    test('should send a notification with valid input (case 2)', async () => {
        const userID = new mongoose.Types.ObjectId();
        const messaggio = 'Test notification message 2';

        const notifica = await GestioneNotificheDAO.sendNotification(userID, messaggio);

        expect(notifica).toBeTruthy();
        expect(notifica.userID).toEqual(userID);
        expect(notifica.messaggio).toBe(messaggio);
    });

    test('should send a notification with valid input (case 3)', async () => {
        const userID = new mongoose.Types.ObjectId();
        const messaggio = 'Test notification message 3';

        const notifica = await GestioneNotificheDAO.sendNotification(userID, messaggio);

        expect(notifica).toBeTruthy();
        expect(notifica.userID).toEqual(userID);
        expect(notifica.messaggio).toBe(messaggio);
    });

    test('should throw an error if userID is missing (case 1)', async () => {
        const messaggio = 'Test notification message';
    
        await expect(GestioneNotificheDAO.sendNotification(null, messaggio)).rejects.toThrow('L\'ID utente e il messaggio sono obbligatori');
    });
    
    test('should throw an error if userID is missing (case 2)', async () => {
        const messaggio = 'Another test notification message';
    
        await expect(GestioneNotificheDAO.sendNotification(undefined, messaggio)).rejects.toThrow('L\'ID utente e il messaggio sono obbligatori');
    });
    
    test('should throw an error if userID is missing (case 3)', async () => {
        const messaggio = 'Yet another test notification message';
    
        await expect(GestioneNotificheDAO.sendNotification('', messaggio)).rejects.toThrow('L\'ID utente e il messaggio sono obbligatori');
    });

    test('should throw an error if messaggio is missing (case 1)', async () => {
        const userID = new mongoose.Types.ObjectId();
    
        await expect(GestioneNotificheDAO.sendNotification(userID, null)).rejects.toThrow('L\'ID utente e il messaggio sono obbligatori');
    });
    
    test('should throw an error if messaggio is missing (case 2)', async () => {
        const userID = new mongoose.Types.ObjectId();
    
        await expect(GestioneNotificheDAO.sendNotification(userID, undefined)).rejects.toThrow('L\'ID utente e il messaggio sono obbligatori');
    });
    
    test('should throw an error if messaggio is missing (case 3)', async () => {
        const userID = new mongoose.Types.ObjectId();
    
        await expect(GestioneNotificheDAO.sendNotification(userID, '')).rejects.toThrow('L\'ID utente e il messaggio sono obbligatori');
    });
});

//------------------------------------------GetNotifications-------------------------------------------------------------------------

describe('getNotifications', () => {
    test('should return all notifications for a user (case 1)', async () => {
        const userID = new mongoose.Types.ObjectId();

        await Notifiche.create([
            { userID, messaggio: 'Notification 1' },
            { userID, messaggio: 'Notification 2' }
        ]);

        const notifiche = await GestioneNotificheDAO.getNotifications(userID);

        expect(notifiche).toHaveLength(2);
        expect(notifiche[0].userID).toEqual(userID);
        expect(notifiche[1].userID).toEqual(userID);
    });

    test('should return all notifications for a user (case 2)', async () => {
        const userID = new mongoose.Types.ObjectId();

        await Notifiche.create([
            { userID, messaggio: 'Notification 3' },
            { userID, messaggio: 'Notification 4' }
        ]);

        const notifiche = await GestioneNotificheDAO.getNotifications(userID);

        expect(notifiche).toHaveLength(2);
        expect(notifiche[0].userID).toEqual(userID);
        expect(notifiche[1].userID).toEqual(userID);
    });

    test('should return all notifications for a user (case 3)', async () => {
        const userID = new mongoose.Types.ObjectId();

        await Notifiche.create([
            { userID, messaggio: 'Notification 5' },
            { userID, messaggio: 'Notification 6' }
        ]);

        const notifiche = await GestioneNotificheDAO.getNotifications(userID);

        expect(notifiche).toHaveLength(2);
        expect(notifiche[0].userID).toEqual(userID);
        expect(notifiche[1].userID).toEqual(userID);
    });

    test('should throw an error if userID is missing (case 1)', async () => {
        await expect(GestioneNotificheDAO.getNotifications(null)).rejects.toThrow('L\'ID utente è obbligatorio');
    });
    
    test('should throw an error if userID is missing (case 2)', async () => {
        await expect(GestioneNotificheDAO.getNotifications(undefined)).rejects.toThrow('L\'ID utente è obbligatorio');
    });
    
    test('should throw an error if userID is missing (case 3)', async () => {
        await expect(GestioneNotificheDAO.getNotifications('')).rejects.toThrow('L\'ID utente è obbligatorio');
    });

    test('should return an empty array if no notifications are found (case 1)', async () => {
        const userID = new mongoose.Types.ObjectId();
    
        const notifiche = await GestioneNotificheDAO.getNotifications(userID);
    
        expect(notifiche).toHaveLength(0);
    });
    
    test('should return an empty array if no notifications are found (case 2)', async () => {
        const userID = new mongoose.Types.ObjectId();
    
        const notifiche = await GestioneNotificheDAO.getNotifications(userID);
    
        expect(notifiche).toHaveLength(0);
    });
    
    test('should return an empty array if no notifications are found (case 3)', async () => {
        const userID = new mongoose.Types.ObjectId();
    
        const notifiche = await GestioneNotificheDAO.getNotifications(userID);
    
        expect(notifiche).toHaveLength(0);
    });
});

//------------------------------------------MarkNotificationAsRead-------------------------------------------------------------------------

describe('markNotificationAsRead', () => {
    test('should mark a notification as read (case 1)', async () => {
        const notifica = await Notifiche.create({
            userID: new mongoose.Types.ObjectId(),
            messaggio: 'Test notification 1',
            letto: false
        });

        const notificaAggiornata = await GestioneNotificheDAO.markNotificationAsRead(notifica._id);

        expect(notificaAggiornata).toBeTruthy();
        expect(notificaAggiornata.letto).toBe(true);
    });

    test('should mark a notification as read (case 2)', async () => {
        const notifica = await Notifiche.create({
            userID: new mongoose.Types.ObjectId(),
            messaggio: 'Test notification 2',
            letto: false
        });

        const notificaAggiornata = await GestioneNotificheDAO.markNotificationAsRead(notifica._id);

        expect(notificaAggiornata).toBeTruthy();
        expect(notificaAggiornata.letto).toBe(true);
    });

    test('should mark a notification as read (case 3)', async () => {
        const notifica = await Notifiche.create({
            userID: new mongoose.Types.ObjectId(),
            messaggio: 'Test notification 3',
            letto: false
        });

        const notificaAggiornata = await GestioneNotificheDAO.markNotificationAsRead(notifica._id);

        expect(notificaAggiornata).toBeTruthy();
        expect(notificaAggiornata.letto).toBe(true);
    });

    test('should throw an error if notificationID is missing (case 1)', async () => {
        await expect(GestioneNotificheDAO.markNotificationAsRead(null)).rejects.toThrow('L\'ID della notifica è obbligatorio');
    });
    
    test('should throw an error if notificationID is missing (case 2)', async () => {
        await expect(GestioneNotificheDAO.markNotificationAsRead(undefined)).rejects.toThrow('L\'ID della notifica è obbligatorio');
    });
    
    test('should throw an error if notificationID is missing (case 3)', async () => {
        await expect(GestioneNotificheDAO.markNotificationAsRead('')).rejects.toThrow('L\'ID della notifica è obbligatorio');
    });

    test('should throw an error if notification does not exist (case 1)', async () => {
        const nonExistingNotificationID = new mongoose.Types.ObjectId();
    
        await expect(GestioneNotificheDAO.markNotificationAsRead(nonExistingNotificationID)).rejects.toThrow('Notifica non trovata');
    });
    
    test('should throw an error if notification does not exist (case 2)', async () => {
        const nonExistingNotificationID = new mongoose.Types.ObjectId();
    
        await expect(GestioneNotificheDAO.markNotificationAsRead(nonExistingNotificationID)).rejects.toThrow('Notifica non trovata');
    });
    
    test('should throw an error if notification does not exist (case 3)', async () => {
        const nonExistingNotificationID = new mongoose.Types.ObjectId();
    
        await expect(GestioneNotificheDAO.markNotificationAsRead(nonExistingNotificationID)).rejects.toThrow('Notifica non trovata');
    });
});

//------------------------------------------DeleteNotification-------------------------------------------------------------------------

describe('deleteNotification', () => {
    test('should delete a notification by ID (case 1)', async () => {
        const notifica = await Notifiche.create({
            userID: new mongoose.Types.ObjectId(),
            messaggio: 'Test notification 1'
        });

        const notificaEliminata = await GestioneNotificheDAO.deleteNotification(notifica._id);

        expect(notificaEliminata).toBeTruthy();
        expect(notificaEliminata._id).toEqual(notifica._id);

        const notificaEsiste = await Notifiche.findById(notifica._id);
        expect(notificaEsiste).toBeNull();
    });

    test('should delete a notification by ID (case 2)', async () => {
        const notifica = await Notifiche.create({
            userID: new mongoose.Types.ObjectId(),
            messaggio: 'Test notification 2'
        });

        const notificaEliminata = await GestioneNotificheDAO.deleteNotification(notifica._id);

        expect(notificaEliminata).toBeTruthy();
        expect(notificaEliminata._id).toEqual(notifica._id);

        const notificaEsiste = await Notifiche.findById(notifica._id);
        expect(notificaEsiste).toBeNull();
    });

    test('should delete a notification by ID (case 3)', async () => {
        const notifica = await Notifiche.create({
            userID: new mongoose.Types.ObjectId(),
            messaggio: 'Test notification 3'
        });

        const notificaEliminata = await GestioneNotificheDAO.deleteNotification(notifica._id);

        expect(notificaEliminata).toBeTruthy();
        expect(notificaEliminata._id).toEqual(notifica._id);

        const notificaEsiste = await Notifiche.findById(notifica._id);
        expect(notificaEsiste).toBeNull();
    });

    test('should throw an error if notificationID is missing (case 1)', async () => {
        await expect(GestioneNotificheDAO.deleteNotification(null)).rejects.toThrow('L\'ID della notifica è obbligatorio');
    });
    
    test('should throw an error if notificationID is missing (case 2)', async () => {
        await expect(GestioneNotificheDAO.deleteNotification(undefined)).rejects.toThrow('L\'ID della notifica è obbligatorio');
    });
    
    test('should throw an error if notificationID is missing (case 3)', async () => {
        await expect(GestioneNotificheDAO.deleteNotification('')).rejects.toThrow('L\'ID della notifica è obbligatorio');
    });

    test('should throw an error if notification does not exist (case 1)', async () => {
        const nonExistingNotificationID = new mongoose.Types.ObjectId();
    
        await expect(GestioneNotificheDAO.deleteNotification(nonExistingNotificationID)).rejects.toThrow('Notifica non trovata');
    });
    
    test('should throw an error if notification does not exist (case 2)', async () => {
        const nonExistingNotificationID = new mongoose.Types.ObjectId();
    
        await expect(GestioneNotificheDAO.deleteNotification(nonExistingNotificationID)).rejects.toThrow('Notifica non trovata');
    });
    
    test('should throw an error if notification does not exist (case 3)', async () => {
        const nonExistingNotificationID = new mongoose.Types.ObjectId();
    
        await expect(GestioneNotificheDAO.deleteNotification(nonExistingNotificationID)).rejects.toThrow('Notifica non trovata');
    });
});

//------------------------------------------FindAll-------------------------------------------------------------------------

describe('findAll', () => {
    test('should return all notifications (case 1)', async () => {
        await Notifiche.create([
            { userID: new mongoose.Types.ObjectId(), messaggio: 'Notification 1' },
            { userID: new mongoose.Types.ObjectId(), messaggio: 'Notification 2' }
        ]);

        const notifiche = await GestioneNotificheDAO.findAll();

        expect(notifiche).toHaveLength(2);
    });

    test('should return all notifications (case 2)', async () => {
        await Notifiche.create([
            { userID: new mongoose.Types.ObjectId(), messaggio: 'Notification 3' },
            { userID: new mongoose.Types.ObjectId(), messaggio: 'Notification 4' }
        ]);

        const notifiche = await GestioneNotificheDAO.findAll();

        expect(notifiche).toHaveLength(2);
    });

    test('should return all notifications (case 3)', async () => {
        await Notifiche.create([
            { userID: new mongoose.Types.ObjectId(), messaggio: 'Notification 5' },
            { userID: new mongoose.Types.ObjectId(), messaggio: 'Notification 6' }
        ]);

        const notifiche = await GestioneNotificheDAO.findAll();

        expect(notifiche).toHaveLength(2);
    });

    test('should return an empty array if no notifications exist (case 1)', async () => {
        const notifiche = await GestioneNotificheDAO.findAll();
    
        expect(notifiche).toHaveLength(0);
    });
    
    test('should return an empty array if no notifications exist (case 2)', async () => {
        const notifiche = await GestioneNotificheDAO.findAll();
    
        expect(notifiche).toHaveLength(0);
    });
    
    test('should return an empty array if no notifications exist (case 3)', async () => {
        const notifiche = await GestioneNotificheDAO.findAll();
    
        expect(notifiche).toHaveLength(0);
    });
});
});