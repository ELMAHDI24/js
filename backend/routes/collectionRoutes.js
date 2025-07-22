const express = require('express');
const router = express.Router();

const collectionController = require('../controllers/collectionController');
const authenticateToken = require('../middlewares/auth'); // Middleware JWT

// ✅ Routes protégées par JWT
router.get('/', authenticateToken, collectionController.getAll);
router.get('/:id', authenticateToken, collectionController.getById);
router.get('/:id/produits', authenticateToken, collectionController.getProduitsByCollectionId); // 🔥 nouvelle route
router.post('/', authenticateToken, collectionController.create);
router.put('/:id', authenticateToken, collectionController.update);
router.delete('/:id', authenticateToken, collectionController.delete);

module.exports = router;
