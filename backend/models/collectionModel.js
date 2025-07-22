const db = require('../config/db');

const Collection = {
  // Obtenir toutes les collections avec leurs produits associés
  getAllWithProduits: (callback) => {
    const sql = `
      SELECT 
        c.id AS collection_id,
        c.nom AS collection_nom,
        c.description AS collection_description,
        p.id AS produit_id,
        p.nom AS produit_nom,
        p.description AS produit_description,
        p.prix,
        p.image_url
      FROM collection c
      LEFT JOIN collection_produits cp ON c.id = cp.collection_id
      LEFT JOIN produits p ON cp.produit_id = p.id
      ORDER BY c.id
    `;
    db.query(sql, callback);
  },

  // Obtenir toutes les collections (sans produits)
  getAll: (callback) => {
    db.query('SELECT * FROM collection', callback);
  },

  // Obtenir une seule collection avec ses produits
  getByIdWithProduits: (id, callback) => {
    const sql = `
      SELECT 
        c.id AS collection_id,
        c.nom AS collection_nom,
        c.description AS collection_description,
        p.id AS produit_id,
        p.nom AS produit_nom,
        p.description AS produit_description,
        p.prix,
        p.image_url
      FROM collection c
      LEFT JOIN collection_produits cp ON c.id = cp.collection_id
      LEFT JOIN produits p ON cp.produit_id = p.id
      WHERE c.id = ?
    `;
    db.query(sql, [id], callback);
  },

  // Obtenir une seule collection (simple)
  getById: (id, callback) => {
    db.query('SELECT * FROM collection WHERE id = ?', [id], callback);
  },

  create: (collectionData, callback) => {
    const { nom, description } = collectionData;
    db.query(
      'INSERT INTO collection (nom, description) VALUES (?, ?)',
      [nom, description],
      callback
    );
  },

  update: (id, collectionData, callback) => {
    const { nom, description } = collectionData;
    db.query(
      'UPDATE collection SET nom = ?, description = ? WHERE id = ?',
      [nom, description, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM collection WHERE id = ?', [id], callback);
  },

  getProduitsByCollectionId: (collectionId, callback) => {
  const sql = `
    SELECT 
      p.id AS produit_id,
      p.nom AS produit_nom,
      p.description AS produit_description,
      p.prix,
      p.image_url
    FROM produits p
    INNER JOIN collection_produits cp ON p.id = cp.produit_id
    WHERE cp.collection_id = ?
  `;
  db.query(sql, [collectionId], callback);
},
};

module.exports = Collection;
