
const db = require('../config/db');

const dashboardModel = {

  getGlobalStats: (callback) => {
    const sql = `
      SELECT 
        (SELECT COUNT(*) FROM produits) AS total_produits,
        (SELECT COUNT(*) FROM catalogue) AS total_catalogues,
        (SELECT COUNT(*) FROM collection) AS total_collections,
        (SELECT COUNT(*) FROM frss) AS total_fournisseurs,
        (SELECT COUNT(*) FROM users) AS total_utilisateurs
    `;
    db.query(sql, callback);
  },

 
  getProduitsParCatalogue: (callback) => {
    const sql = `
      SELECT c.titre AS catalogue, COUNT(p.id) AS total
      FROM catalogue c
      LEFT JOIN produits p ON p.cataloge_id = c.id
      GROUP BY c.id
    `;
    db.query(sql, callback);
  },

  // 2. Graphique : Nombre de produits par collection
  getProduitsParCollection: (callback) => {
    const sql = `
      SELECT col.nom AS collection, COUNT(cp.produit_id) AS total
      FROM collection col
      LEFT JOIN collection_produits cp ON col.id = cp.collection_id
      GROUP BY col.id
    `;
    db.query(sql, callback);
  },

  // 2. Graphique : Nombre de catalogues par fournisseur
  getCataloguesParFournisseur: (callback) => {
    const sql = `
      SELECT f.nom AS fournisseur, COUNT(c.id) AS total_catalogues
      FROM frss f
      LEFT JOIN catalogue c ON f.id = c.frss_id
      GROUP BY f.id
    `;
    db.query(sql, callback);
  },

  // 3. Derniers produits ajoutés
  getLastProduits: (callback) => {
    const sql = `
      SELECT id, nom, prix, image_url
      FROM produits
      ORDER BY id DESC
      LIMIT 5
    `;
    db.query(sql, callback);
  },

  // 3. Derniers catalogues créés
  getLastCatalogues: (callback) => {
    const sql = `
      SELECT id, titre, date_creation
      FROM catalogue
      ORDER BY id DESC
      LIMIT 5
    `;
    db.query(sql, callback);
  },

  // 3. Dernières collections créées
  getLastCollections: (callback) => {
    const sql = `
      SELECT id, nom
      FROM collection
      ORDER BY id DESC
      LIMIT 5
    `;
    db.query(sql, callback);
  }
};

module.exports = dashboardModel;
