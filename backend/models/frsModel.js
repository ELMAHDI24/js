const db = require('../config/db');

// CRUD pour la table "frss"
const Frss = {
  getAll: (callback) => {
    db.query('SELECT * FROM frss', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM frss WHERE id = ?', [id], callback);
  },

  create: (frssData, callback) => {
    const { nom, adresse, lelephone, email } = frssData;
    db.query(
      'INSERT INTO frss (nom, adresse, lelephone, email) VALUES (?, ?, ?, ?)',
      [nom, adresse, lelephone, email],
      callback
    );
  },

  update: (id, frssData, callback) => {
    const { nom, adresse, lelephone, email } = frssData;
    db.query(
      'UPDATE frss SET nom = ?, adresse = ?, lelephone = ?, email = ? WHERE id = ?',
      [nom, adresse, lelephone, email, id],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM frss WHERE id = ?', [id], callback);
  }
};

module.exports = Frss;
