const express = require('express');
const router = express.Router();
const collectionProduitsController = require('../controllers/collectionProduitsController');
const authenticateToken = require('../middlewares/auth'); // JWT middleware

// Routes protégées
router.post('/', authenticateToken, collectionProduitsController.addProduitToCollection);
router.get('/:collection_id', authenticateToken, collectionProduitsController.getProduitsByCollectionId);
router.delete('/', authenticateToken, collectionProduitsController.removeProduitFromCollection);

module.exports = router;
