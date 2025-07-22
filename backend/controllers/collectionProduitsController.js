const CollectionProduits = require('../models/collectionProduitsModel');

const collectionProduitsController = {
  // POST /api/collection_produits
  addProduitToCollection: (req, res) => {
    const { collection_id, produit_id } = req.body;
    if (!collection_id || !produit_id) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    CollectionProduits.addProduitToCollection(collection_id, produit_id, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Produit ajouté à la collection avec succès" });
    });
  },

  // GET /api/collection_produits/:collection_id
  getProduitsByCollectionId: (req, res) => {
    const collection_id = req.params.collection_id;
    CollectionProduits.getProduitsByCollectionId(collection_id, (err, produits) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(produits);
    });
  },

  // DELETE /api/collection_produits
  removeProduitFromCollection: (req, res) => {
    const { collection_id, produit_id } = req.body;
    if (!collection_id || !produit_id) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    CollectionProduits.removeProduitFromCollection(collection_id, produit_id, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Produit retiré de la collection avec succès" });
    });
  }
};

module.exports = collectionProduitsController;
