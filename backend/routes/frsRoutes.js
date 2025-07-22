const express = require('express');
const router = express.Router();

const frssController = require('../controllers/frsController');
const authenticateToken = require('../middlewares/auth'); // Middleware JWT

// Routes protégées (exemple : toutes les routes protégées)
router.post('/', authenticateToken, frssController.createFrss);
router.get('/', authenticateToken, frssController.getAllFrss);
router.get('/:id', authenticateToken, frssController.getFrssById);
router.put('/:id', authenticateToken, frssController.updateFrss);
router.delete('/:id', authenticateToken, frssController.deleteFrss);

module.exports = router;
