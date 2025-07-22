const db = require('../config/db');

// CRUD pour la table "catalogue"
const Catalogue = {
  getAll: (callback) => {
    const query = `
      SELECT catalogue.*, frss.nom AS fournisseur_nom
      FROM catalogue
      LEFT JOIN frss ON catalogue.frss_id = frss.id
    `;
    db.query(query, callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM catalogue WHERE id = ?', [id], callback);
  },

  create: (catalogueData, callback) => {
    const { titre, description, date_creation, frss_id } = catalogueData;
    db.query(
      'INSERT INTO catalogue (titre, description, date_creation, frss_id) VALUES (?, ?, ?, ?)',
      [titre, description, date_creation, frss_id],
      callback
    );
  },

  update: (id, catalogueData, callback) => {
    const { titre, description, date_creation, frss_id } = catalogueData;
    db.query(
      'UPDATE catalogue SET titre = ?, description = ?, date_creation = ?, frss_id = ? WHERE id = ?',
      [titre, description, date_creation, frss_id, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM catalogue WHERE id = ?', [id], callback);
  }
};

module.exports = Catalogue;
