const Frss = require('../models/frsModel');

// 🔽 Récupérer tous les fournisseurs
exports.getAllFrss = (req, res) => {
  Frss.getAll((err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    res.status(200).json(result);
  });
};

// 🔍 Récupérer un fournisseur par ID
exports.getFrssById = (req, res) => {
  const id = req.params.id;
  Frss.getById(id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    if (result.length === 0) return res.status(404).json({ message: 'Fournisseur non trouvé' });
    res.status(200).json(result[0]);
  });
};

// ➕ Ajouter un fournisseur
exports.createFrss = (req, res) => {
  Frss.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    res.status(201).json({ message: 'Fournisseur ajouté', id: result.insertId });
  });
};

// ✏️ Modifier un fournisseur
exports.updateFrss = (req, res) => {
  const id = req.params.id;
  Frss.update(id, req.body, (err) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    res.status(200).json({ message: 'Fournisseur mis à jour' });
  });
};

// ❌ Supprimer un fournisseur
exports.deleteFrss = (req, res) => {
  const id = req.params.id;
  Frss.delete(id, (err) => {
    if (err) return res.status(500).json({ message: 'Erreur serveur' });
    res.status(200).json({ message: 'Fournisseur supprimé' });
  });
};
