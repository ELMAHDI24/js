const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/auth'); // Middleware JWT

// Routes publiques
router.post('/register',authenticateToken ,userController.registerUser);
router.post('/login', userController.loginUser);

// Routes protégées (exemple : récupérer tous les users, mise à jour, suppression)
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/:email', authenticateToken, userController.getUserByEmail);
router.get('/by-id/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router; 
