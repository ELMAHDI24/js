const Catalogue = require('../models/catalogueModel');

// 🔽 Récupérer tous les catalogues avec fournisseur
exports.getAllCatalogues = (req, res) => {
  Catalogue.getAll((err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    res.status(200).json(result);
  });
};

// 🔍 Récupérer un catalogue par ID
exports.getCatalogueById = (req, res) => {
  const id = req.params.id;
  Catalogue.getById(id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    if (result.length === 0) return res.status(404).json({ message: 'Catalogue non trouvé' });
    res.status(200).json(result[0]);
  });
};

// ➕ Ajouter un catalogue
exports.createCatalogue = (req, res) => {
  Catalogue.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    res.status(201).json({ message: 'Catalogue créé', id: result.insertId });
  });
};

// ✏️ Modifier un catalogue
exports.updateCatalogue = (req, res) => {
  const id = req.params.id;
  Catalogue.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    res.status(200).json({ message: 'Catalogue mis à jour' });
  });
};

// ❌ Supprimer un catalogue
exports.deleteCatalogue = (req, res) => {
  const id = req.params.id;
  Catalogue.delete(id, (err) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    res.status(200).json({ message: 'Catalogue supprimé' });
  });
};
