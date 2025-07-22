const db = require('../config/db');

const Produit = {
  
  create: (data, callback) => {
    const { nom, description, prix, image_url, cataloge_id } = data;
    const sql = `INSERT INTO produits (nom, description, prix, image_url, cataloge_id) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [nom, description, prix, image_url, cataloge_id], callback);
  },


  getAll: (callback) => {
  const query = `
    SELECT p.*, c.titre AS catalogue_titre
    FROM produits p
    LEFT JOIN catalogue c ON p.cataloge_id = c.id
  `;
  db.query(query, callback);
},


  getById: (id, callback) => {
    db.query(`SELECT * FROM produits WHERE id = ?`, [id], (err, results) => {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, null);
      return callback(null, results[0]);
    });
  },

  update: (id, data, callback) => {
    const { nom, description, prix, image_url, cataloge_id } = data;
    const sql = `
      UPDATE produits 
      SET nom = ?, description = ?, prix = ?, image_url = ?, cataloge_id = ?
      WHERE id = ?
    `;
    db.query(sql, [nom, description, prix, image_url, cataloge_id, id], callback);
  },


  delete: (id, callback) => {
    db.query(`DELETE FROM produits WHERE id = ?`, [id], callback);
  }
};

module.exports = Produit;
