const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticateToken = require('../middlewares/auth');

// Statistiques globales
router.get('/stats', authenticateToken, dashboardController.getGlobalStats);

// Graphiques
router.get('/chart/produits-par-catalogue', authenticateToken, dashboardController.getProduitsParCatalogue);
router.get('/chart/produits-par-collection', authenticateToken, dashboardController.getProduitsParCollection);
router.get('/chart/catalogues-par-fournisseur', authenticateToken, dashboardController.getCataloguesParFournisseur);

// Derniers ajouts
router.get('/recent/produits', authenticateToken, dashboardController.getLastProduits);
router.get('/recent/catalogues', authenticateToken, dashboardController.getLastCatalogues);
router.get('/recent/collections', authenticateToken, dashboardController.getLastCollections);

// Informations utilisateur connecté
router.get('/me', authenticateToken, dashboardController.getCurrentUserInfo);

module.exports = router;
