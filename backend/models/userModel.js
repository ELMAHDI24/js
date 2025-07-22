const db = require('../config/db');

const User = {
    register: (userData, callback) => {
        const { nom, prenom, email, mot_passe, role, adresse, age } = userData;
        const sql = `INSERT INTO users (nom, prenom, email, mot_passe, role, adresse, age) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [nom, prenom, email, mot_passe, role, adresse, age], callback);

    },

    getUserByEmail: (email, callback) => {
        const sql = `SELECT * FROM users WHERE email = ?`;
        db.query(sql, [email], (err, results) => {
            if (err) return callback(err);
            if (results.length === 0) return callback(null, null);
            return callback(null, results[0]);
        });
    },

    getUserById: (id, callback) => {
        const sql = `SELECT * FROM users WHERE id = ?`;
        db.query(sql, [id], (err, results) => {
            if (err) return callback(err);
            if (results.length === 0) return callback(null, null);
            return callback(null, results[0]);
        });
    },

    getAllUsers: (callback) => {
        const sql = `SELECT * FROM users`;
        db.query(sql, callback);
    },

    updateUser: (id, userData, callback) => {
        const { nom, prenom, email, mot_passe, role, adresse, age } = userData;

        const sql = `
            UPDATE users SET 
            nom = ?, prenom = ?, email = ?, mot_passe = ?, role = ?, adresse = ?, age = ?
            WHERE id = ?
        `;

db.query(sql, [nom, prenom, email, mot_passe, role, adresse, age, id], callback);
    },

    deleteUser: (id, callback) => {
        const sql = `DELETE FROM users WHERE id = ?`;
        db.query(sql, [id], callback);
    }
};

module.exports = User;
