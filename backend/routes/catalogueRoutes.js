const express = require('express');
const router = express.Router();

const catalogueController = require('../controllers/catalogueController');
const authenticateToken = require('../middlewares/auth'); // Middleware JWT

// Routes protégées (exemple : toutes les routes protégées)
router.post('/', authenticateToken, catalogueController.createCatalogue);
router.get('/', authenticateToken, catalogueController.getAllCatalogues);
router.get('/:id', authenticateToken, catalogueController.getCatalogueById);
router.put('/:id', authenticateToken, catalogueController.updateCatalogue);
router.delete('/:id', authenticateToken, catalogueController.deleteCatalogue);

module.exports = router;
