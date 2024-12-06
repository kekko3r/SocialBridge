const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Utente = require('../../database/models/GestioneUtenteModel'); // Il modello CHE USA IL DAO
const GestioneUtenteDAO = require('../../libs/GestioneUtenteDAO'); // DAO DA TESTARE
const bcrypt = require('bcrypt');

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
    await Utente.deleteMany(); // Pulisci il database tra i test
});

describe('GestioneUtenteDAO', () => {

//-----------------------------------------getUserByID-----------------------------------------------------------

    describe('getUserById', () => {
        test('should return a user by ID (case 1)', async () => {
            const utente1 = await Utente.create({ 
                nome: 'Forza', 
                cognome: 'Inter', 
                email: 'forzainter@example.com', 
                password: 'Password123', 
                ruolo: 'utente' 
            });

            const foundUser = await GestioneUtenteDAO.getUserById(utente1._id);

            expect(foundUser).toBeTruthy();
            expect(foundUser.nome).toBe('Forza');
            expect(foundUser.cognome).toBe('Inter');
            expect(foundUser.email).toBe('forzainter@example.com');
        });

        test('should return a user by ID (case 2)', async () => {
            const utente2 = await Utente.create({ 
                nome: 'Forza 2', 
                cognome: 'Milan', 
                email: 'forzamilan@example.com', 
                password: 'Password456', 
                ruolo: 'admin' 
            });

            const foundUser = await GestioneUtenteDAO.getUserById(utente2._id);

            expect(foundUser).toBeTruthy();
            expect(foundUser.nome).toBe('Forza 2');
            expect(foundUser.cognome).toBe('Milan');
            expect(foundUser.email).toBe('forzamilan@example.com');
        });

        test('should return a user by ID (case 3)', async () => {
            const utente3 = await Utente.create({ 
                nome: 'Forza 3', 
                cognome: 'Juventus', 
                email: 'forzajuve@example.com', 
                password: 'Password789', 
                ruolo: 'utente' 
            });

            const foundUser = await GestioneUtenteDAO.getUserById(utente3._id);

            expect(foundUser).toBeTruthy();
            expect(foundUser.nome).toBe('Forza 3');
            expect(foundUser.cognome).toBe('Juventus');
            expect(foundUser.email).toBe('forzajuve@example.com');
        });
    });
    
    //-----------------------------------------DeleteUser-----------------------------------------------------------

    describe('deleteUser', () => {
        test('should delete a user (case 1)', async () => {
            const user1 = await Utente.create({ 
                nome: 'Javier', 
                cognome: 'Zanetti', 
                email: 'jzanetti4@example.com', 
                password: 'Password123', 
                ruolo: 'utente' 
            });

            const deletedUser = await GestioneUtenteDAO.deleteUser(user1._id);

            expect(deletedUser).toBeTruthy();
            expect(deletedUser.email).toBe('jzanetti4@example.com');

            const userExists = await Utente.findById(user1._id);
            expect(userExists).toBeNull();
        });

        test('should delete a user (case 2)', async () => {
            const user2 = await Utente.create({ 
                nome: 'Diego', 
                cognome: 'Milito', 
                email: 'dmilito22@example.com', 
                password: 'Password456', 
                ruolo: 'admin' 
            });

            const deletedUser = await GestioneUtenteDAO.deleteUser(user2._id);

            expect(deletedUser).toBeTruthy();
            expect(deletedUser.email).toBe('dmilito22@example.com');

            const userExists = await Utente.findById(user2._id);
            expect(userExists).toBeNull();
        });

        test('should delete a user (case 3)', async () => {
            const user3 = await Utente.create({ 
                nome: 'Esteban', 
                cognome: 'Cambiasso', 
                email: 'ecambiasso19@example.com', 
                password: 'Password789', 
                ruolo: 'utente' 
            });

            const deletedUser = await GestioneUtenteDAO.deleteUser(user3._id);

            expect(deletedUser).toBeTruthy();
            expect(deletedUser.email).toBe('ecambiasso19@example.com');

            const userExists = await Utente.findById(user3._id);
            expect(userExists).toBeNull();
        });
    });

//-----------------------------------------LoginUser-----------------------------------------------------------
    describe('loginUser', () => {
        test('should authenticate a user with valid credentials (case 1)', async () => {
            const hashedPassword = await bcrypt.hash('Prova123_', 10);
            await Utente.create({
                nome: 'Noemi',
                cognome: 'Torelli',
                email: 'noemi.torelli@example.com',
                password: hashedPassword,
                ruolo: 'utente'
            });

            const loggedInUser = await GestioneUtenteDAO.loginUser({
                email: 'noemi.torelli@example.com',
                password: 'Prova123_'
            });

            expect(loggedInUser).toBeTruthy();
            expect(loggedInUser.nome).toBe('Noemi');
            expect(loggedInUser.cognome).toBe('Torelli');
            expect(loggedInUser.email).toBe('noemi.torelli@example.com');
            expect(loggedInUser.ruolo).toBe('utente');
        });

        test('should authenticate a user with valid credentials (case 2)', async () => {
            const hashedPassword = await bcrypt.hash('Prova456_', 10);
            await Utente.create({
                nome: 'Simone',
                cognome: 'Verdi',
                email: 'simone.verdi@example.com',
                password: hashedPassword,
                ruolo: 'utente'
            });

            const loggedInUser = await GestioneUtenteDAO.loginUser({
                email: 'simone.verdi@example.com',
                password: 'Prova456_'
            });

            expect(loggedInUser).toBeTruthy();
            expect(loggedInUser.nome).toBe('Simone');
            expect(loggedInUser.cognome).toBe('Verdi');
            expect(loggedInUser.email).toBe('simone.verdi@example.com');
            expect(loggedInUser.ruolo).toBe('utente');
        });

        test('should authenticate a user with valid credentials (case 3)', async () => {
            const hashedPassword = await bcrypt.hash('Prova789_', 10);
            await Utente.create({
                nome: 'Camilo',
                cognome: 'Zuniga',
                email: 'camilo.zuniga@example.com',
                password: hashedPassword,
                ruolo: 'utente'
            });

            const loggedInUser = await GestioneUtenteDAO.loginUser({
                email: 'camilo.zuniga@example.com',
                password: 'Prova789_'
            });

            expect(loggedInUser).toBeTruthy();
            expect(loggedInUser.nome).toBe('Camilo');
            expect(loggedInUser.cognome).toBe('Zuniga');
            expect(loggedInUser.email).toBe('camilo.zuniga@example.com');
            expect(loggedInUser.ruolo).toBe('utente');
        });

        test('should throw an error with invalid credentials (case 1)', async () => {
            await Utente.create({
                nome: 'Ezequil',
                cognome: 'Lavezzi',
                email: 'ezequil.lavezzi@example.com',
                password: 'Prova123_', // Password in chiaro
                ruolo: 'utente'
            });

            await expect(
                GestioneUtenteDAO.loginUser({
                    email: 'non.esistente@example.com',
                    password: 'Prova123_'
                })
            ).rejects.toThrow('Email o password errati.');

            await expect(
                GestioneUtenteDAO.loginUser({
                    email: 'ezequil.lavezzi@example.com',
                    password: 'PasswordErrata'
                })
            ).rejects.toThrow('Email o password errati.');
        });

        test('should throw an error with invalid credentials (case 2)', async () => {
            await Utente.create({
                nome: 'Diego',
                cognome: 'Maradona',
                email: 'diego.maradona@example.com',
                password: 'Password123', // Password in chiaro
                ruolo: 'utente'
            });
        
            await expect(
                GestioneUtenteDAO.loginUser({
                    email: 'non.esistente@example.com',
                    password: 'Password123'
                })
            ).rejects.toThrow('Email o password errati.');
        
            await expect(
                GestioneUtenteDAO.loginUser({
                    email: 'diego.maradona@example.com',
                    password: 'WrongPassword'
                })
            ).rejects.toThrow('Email o password errati.');
        });
        
        test('should throw an error with invalid credentials (case 3)', async () => {
            await Utente.create({
                nome: 'Lionel',
                cognome: 'Messi',
                email: 'lionel.messi@example.com',
                password: 'Messi123', // Password in chiaro
                ruolo: 'utente'
            });
        
            await expect(
                GestioneUtenteDAO.loginUser({
                    email: 'non.esistente@example.com',
                    password: 'Messi123'
                })
            ).rejects.toThrow('Email o password errati.');
        
            await expect(
                GestioneUtenteDAO.loginUser({
                    email: 'lionel.messi@example.com',
                    password: 'WrongPassword'
                })
            ).rejects.toThrow('Email o password errati.');
        });
    });

    //-----------------------------------------UpdateProfile-----------------------------------------------------------

    describe('updateProfile', () => {
        test('should update the user profile with valid data (case 1)', async () => {
            const user1 = await Utente.create({
                nome: 'Lino',
                cognome: 'Banfi',
                email: 'linobanfi@example.com',
                password: 'Prova123_',
                ruolo: 'utente'
            });

            const updateData = {
                nome: 'Daniele',
                cognome: 'De Rossi',
                email: 'danielederossi@example.com',
                ruolo: 'admin'
            };

            const updatedUser = await GestioneUtenteDAO.updateProfile(user1._id, updateData);

            expect(updatedUser).toBeTruthy();
            expect(updatedUser.nome).toBe(updateData.nome);
            expect(updatedUser.cognome).toBe(updateData.cognome);
            expect(updatedUser.email).toBe(updateData.email);
            expect(updatedUser.ruolo).toBe(updateData.ruolo);
        });

        test('should update the user profile with valid data (case 2)', async () => {
            const user2 = await Utente.create({
                nome: 'Carlo',
                cognome: 'Verdone',
                email: 'carloverdone@example.com',
                password: 'Password123',
                ruolo: 'utente'
            });

            const updateData = {
                nome: 'Gianluca',
                cognome: 'Vialli',
                email: 'gianlucavialli@example.com',
                ruolo: 'admin'
            };

            const updatedUser = await GestioneUtenteDAO.updateProfile(user2._id, updateData);

            expect(updatedUser).toBeTruthy();
            expect(updatedUser.nome).toBe(updateData.nome);
            expect(updatedUser.cognome).toBe(updateData.cognome);
            expect(updatedUser.email).toBe(updateData.email);
            expect(updatedUser.ruolo).toBe(updateData.ruolo);
        });

        test('should update the user profile with valid data (case 3)', async () => {
            const user3 = await Utente.create({
                nome: 'Alberto',
                cognome: 'Sordi',
                email: 'albertosordi@example.com',
                password: 'Password456',
                ruolo: 'admin'
            });

            const updateData = {
                nome: 'Francesco',
                cognome: 'Totti',
                email: 'francescototti@example.com',
                ruolo: 'admin'
            };

            const updatedUser = await GestioneUtenteDAO.updateProfile(user3._id, updateData);

            expect(updatedUser).toBeTruthy();
            expect(updatedUser.nome).toBe(updateData.nome);
            expect(updatedUser.cognome).toBe(updateData.cognome);
            expect(updatedUser.email).toBe(updateData.email);
            expect(updatedUser.ruolo).toBe(updateData.ruolo);
        });

        test('should not update fields if no valid data is provided (case 1)', async () => {
            const user1 = await Utente.create({
                nome: 'Pizza',
                cognome: 'Margherita',
                email: 'pizzamargherita@example.com',
                password: 'Prova123_',
                ruolo: 'utente'
            });
        
            const updateData = {}; // Nessun campo da aggiornare
        
            const updatedUser = await GestioneUtenteDAO.updateProfile(user1._id, updateData);
        
            expect(updatedUser).toBeTruthy();
            expect(updatedUser.nome).toBe(user1.nome);
            expect(updatedUser.cognome).toBe(user1.cognome);
            expect(updatedUser.email).toBe(user1.email);
            expect(updatedUser.ruolo).toBe(user1.ruolo);
        });
        
        test('should not update fields if no valid data is provided (case 2)', async () => {
            const user2 = await Utente.create({
                nome: 'Risotto',
                cognome: 'Alla Milanese',
                email: 'risottomilanese@example.com',
                password: 'Password123',
                ruolo: 'utente'
            });
        
            const updateData = {}; // Nessun campo da aggiornare
        
            const updatedUser = await GestioneUtenteDAO.updateProfile(user2._id, updateData);
        
            expect(updatedUser).toBeTruthy();
            expect(updatedUser.nome).toBe(user2.nome);
            expect(updatedUser.cognome).toBe(user2.cognome);
            expect(updatedUser.email).toBe(user2.email);
            expect(updatedUser.ruolo).toBe(user2.ruolo);
        });
        
        test('should not update fields if no valid data is provided (case 3)', async () => {
            const user3 = await Utente.create({
                nome: 'Pasta',
                cognome: 'Alla Carbonara',
                email: 'pastacarbonara@example.com',
                password: 'Password456',
                ruolo: 'admin'
            });
        
            const updateData = {}; // Nessun campo da aggiornare
        
            const updatedUser = await GestioneUtenteDAO.updateProfile(user3._id, updateData);
        
            expect(updatedUser).toBeTruthy();
            expect(updatedUser.nome).toBe(user3.nome);
            expect(updatedUser.cognome).toBe(user3.cognome);
            expect(updatedUser.email).toBe(user3.email);
            expect(updatedUser.ruolo).toBe(user3.ruolo);
        });
    });
    
    //-----------------------------------------RegisterUser-----------------------------------------------------------

    describe('registerUser', () => {
        test('should create a new user (case 1)', async () => {
            const newUser = {
                nome: 'Diego',
                cognome: 'Maradona',
                email: 'diego.maradona@example.com',
                password: 'Password123',
                ruolo: 'utente'
            };

            const createdUser = await GestioneUtenteDAO.registerUser(newUser);

            expect(createdUser).toBeTruthy();
            expect(createdUser.nome).toBe('Diego');
            expect(createdUser.cognome).toBe('Maradona');
            expect(createdUser.email).toBe('diego.maradona@example.com');
            expect(createdUser.ruolo).toBe('utente');
        });

        test('should create a new user (case 2)', async () => {
            const newUser = {
                nome: 'Trimo',
                cognome: 'Rimo',
                email: 'trimo.rimo@example.com',
                password: 'Password456',
                ruolo: 'admin'
            };

            const createdUser = await GestioneUtenteDAO.registerUser(newUser);

            expect(createdUser).toBeTruthy();
            expect(createdUser.nome).toBe('Trimo');
            expect(createdUser.cognome).toBe('Rimo');
            expect(createdUser.email).toBe('trimo.rimo@example.com');
            expect(createdUser.ruolo).toBe('admin');
        });

        test('should create a new user (case 3)', async () => {
            const newUser = {
                nome: 'Pino',
                cognome: 'Daniele',
                email: 'pino.daniele@example.com',
                password: 'Password456',
                ruolo: 'admin'
            };

            const createdUser = await GestioneUtenteDAO.registerUser(newUser);

            expect(createdUser).toBeTruthy();
            expect(createdUser.nome).toBe('Pino');
            expect(createdUser.cognome).toBe('Daniele');
            expect(createdUser.email).toBe('pino.daniele@example.com');
            expect(createdUser.ruolo).toBe('admin');
        });

        test('should throw an error when registering a user with an existing email (case 1)', async () => {
            await GestioneUtenteDAO.registerUser({
                nome: 'Trimone',
                cognome: 'Limone',
                email: 'trimone.limone@example.com',
                password: 'Password123',
                ruolo: 'utente'
            });
        
            const userData = {
                email: 'trimone.limone@example.com',
                password: 'Prova123_',
                nome: 'Duplicate',
                cognome: 'User',
                ruolo: 'utente'
            };
        
            await expect(
                GestioneUtenteDAO.registerUser(userData)
            ).rejects.toThrow('Errore durante la registrazione dell\'utente: email già esistente');
        });
        
        test('should throw an error when registering a user with an existing email (case 2)', async () => {
            await GestioneUtenteDAO.registerUser({
                nome: 'Lena',
                cognome: 'Siena',
                email: 'lena.siena@example.com',
                password: 'Password456',
                ruolo: 'admin'
            });
        
            const userData = {
                email: 'lena.siena@example.com',
                password: 'Prova456_',
                nome: 'Duplicate',
                cognome: 'User',
                ruolo: 'admin'
            };
        
            await expect(
                GestioneUtenteDAO.registerUser(userData)
            ).rejects.toThrow('Errore durante la registrazione dell\'utente: email già esistente');
        });
        
        test('should throw an error when registering a user with an existing email (case 3)', async () => {
            await GestioneUtenteDAO.registerUser({
                nome: 'Marco',
                cognome: 'Bianchi',
                email: 'marco.bianchi@example.com',
                password: 'Password789',
                ruolo: 'utente'
            });
        
            const userData = {
                email: 'marco.bianchi@example.com',
                password: 'Prova789_',
                nome: 'Duplicate',
                cognome: 'User',
                ruolo: 'utente'
            };
        
            await expect(
                GestioneUtenteDAO.registerUser(userData)
            ).rejects.toThrow('Errore durante la registrazione dell\'utente: email già esistente');
        });

        test('should throw an error when required fields are missing (case 1)', async () => {
            const incompleteData = {
                password: 'Prova123_',
                nome: 'Incomplete',
                cognome: 'User',
                ruolo: 'utente'
            };
        
            await expect(
                GestioneUtenteDAO.registerUser(incompleteData)
            ).rejects.toThrow('Errore durante la registrazione dell\'utente');
        });
        
        test('should throw an error when required fields are missing (case 2)', async () => {
            const incompleteData = {
                email: 'incomplete.user@example.com',
                nome: 'Incomplete',
                cognome: 'User',
                ruolo: 'utente'
            };
        
            await expect(
                GestioneUtenteDAO.registerUser(incompleteData)
            ).rejects.toThrow('Errore durante la registrazione dell\'utente');
        });
        
        test('should throw an error when required fields are missing (case 3)', async () => {
            const incompleteData = {
                email: 'incomplete.user@example.com',
                password: 'Prova123_',
                ruolo: 'utente'
            };
        
            await expect(
                GestioneUtenteDAO.registerUser(incompleteData)
            ).rejects.toThrow('Errore durante la registrazione dell\'utente');
        });
    });
});