const dashboardModel = require('../models/dashboardModel');

const dashboardController = {
  getGlobalStats: (req, res) => {
    dashboardModel.getGlobalStats((err, stats) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(stats[0]);
    });
  },

  getProduitsParCatalogue: (req, res) => {
    dashboardModel.getProduitsParCatalogue((err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  },

  getProduitsParCollection: (req, res) => {
    dashboardModel.getProduitsParCollection((err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  },

  getCataloguesParFournisseur: (req, res) => {
    dashboardModel.getCataloguesParFournisseur((err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  },

  getLastProduits: (req, res) => {
    dashboardModel.getLastProduits((err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  },

  getLastCatalogues: (req, res) => {
    dashboardModel.getLastCatalogues((err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  },

  getLastCollections: (req, res) => {
    dashboardModel.getLastCollections((err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  },

  getCurrentUserInfo: (req, res) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Utilisateur non authentifié' });

    res.json({
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      lastLogin: user.lastLogin || null
    });
  }
};

module.exports = dashboardController;
