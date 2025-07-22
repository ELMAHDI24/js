const db = require('../config/db');

const CollectionProduits = {

  addProduitToCollection: (collection_id, produit_id, callback) => {
    const sql = `INSERT INTO collection_produits (collection_id, produit_id) VALUES (?, ?)`;
    db.query(sql, [collection_id, produit_id], callback);
  },

  
  getProduitsByCollectionId: (collection_id, callback) => {
    const sql = `
      SELECT p.*
      FROM produits p
      INNER JOIN collection_produits cp ON cp.produit_id = p.id
      WHERE cp.collection_id = ?
    `;
    db.query(sql, [collection_id], callback);
  },


  removeProduitFromCollection: (collection_id, produit_id, callback) => {
    const sql = `DELETE FROM collection_produits WHERE collection_id = ? AND produit_id = ?`;
    db.query(sql, [collection_id, produit_id], callback);
  }
};

module.exports = CollectionProduits;
