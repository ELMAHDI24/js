const Collection = require('../models/collectionModel');

const groupCollectionsWithProduits = (rows) => {
  const map = new Map();

  rows.forEach(row => {
    const collectionId = row.collection_id;
    if (!map.has(collectionId)) {
      map.set(collectionId, {
        id: collectionId,
        nom: row.collection_nom,
        description: row.collection_description,
        produits: []
      });
    }

    if (row.produit_id) {
      map.get(collectionId).produits.push({
        id: row.produit_id,
        nom: row.produit_nom,
        description: row.produit_description,
        prix: row.prix,
        image_url: row.image_url
      });
    }
  });

  return Array.from(map.values());
};

const collectionController = {
  // ✅ Toutes les collections avec leurs produits
  getAll: (req, res) => {
    Collection.getAllWithProduits((err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      const structured = groupCollectionsWithProduits(results);
      res.json(structured);
    });
  },

  // ✅ Une seule collection avec ses produits
  getById: (req, res) => {
    const id = req.params.id;
    Collection.getByIdWithProduits(id, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'Collection non trouvée' });

      const structured = groupCollectionsWithProduits(results);
      res.json(structured[0]);
    });
  },

  // ➕ Créer une collection
  create: (req, res) => {
    const data = req.body;
    if (!data.nom) return res.status(400).json({ message: 'Le champ nom est requis' });

    Collection.create(data, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Collection ajoutée avec succès', id: result.insertId });
    });
  },

  // ✏️ Modifier une collection
  update: (req, res) => {
    const id = req.params.id;
    const data = req.body;
    Collection.update(id, data, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Collection mise à jour avec succès' });
    });
  },

  // ❌ Supprimer une collection
  delete: (req, res) => {
    const id = req.params.id;
    Collection.delete(id, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Collection supprimée avec succès' });
    });
  },

  // ✅ Produits d'une collection spécifique
  getProduitsByCollectionId: (req, res) => {
    const id = req.params.id;
    Collection.getProduitsByCollectionId(id, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  }
};

module.exports = collectionController;
