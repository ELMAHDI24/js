const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'ton_secret_pour_jwt';

// ➕ Inscription sécurisée
exports.registerUser = (req, res) => {
    const userData = req.body;

    bcrypt.hash(userData.mot_passe, 10, (err, hash) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });

        userData.mot_passe = hash;

        User.register(userData, (err, result) => {
            if (err) return res.status(500).json({ message: 'Erreur serveur' });
            res.status(201).json({ message: 'Utilisateur enregistré avec succès', userId: result.insertId });
        });
    });
};

// 🔐 Connexion
exports.loginUser = (req, res) => {
    const { email, mot_passe } = req.body;

    User.getUserByEmail(email, (err, user) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        if (!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

        bcrypt.compare(mot_passe, user.mot_passe, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Erreur serveur' });
            if (!isMatch) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: 'Connexion réussie',
                token,
                user: {
                    id: user.id,
                    nom: user.nom,
                    prenom: user.prenom,
                    email: user.email,
                    role: user.role,
                    adresse: user.adresse,
                    age: user.age
                }
            });
        });
    });
};

// 📥 Récupérer tous les utilisateurs
exports.getAllUsers = (req, res) => {
    User.getAllUsers((err, users) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.status(200).json(users);
    });
};

// 🔍 Récupérer un utilisateur par email
exports.getUserByEmail = (req, res) => {
    const email = req.params.email;

    User.getUserByEmail(email, (err, user) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.status(200).json(user);
    });
};

// 🔍 Récupérer un utilisateur par ID
exports.getUserById = (req, res) => {
    const id = req.params.id;

    User.getUserById(id, (err, user) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.status(200).json(user);
    });
};

// ✏️ Mise à jour d’un utilisateur
exports.updateUser = (req, res) => {
    const id = req.params.id;
    const userData = req.body;

    if (userData.mot_passe) {
        bcrypt.hash(userData.mot_passe, 10, (err, hash) => {
            if (err) return res.status(500).json({ message: 'Erreur serveur' });

            userData.mot_passe = hash;

            User.updateUser(id, userData, (err) => {
                if (err) return res.status(500).json({ message: 'Erreur serveur' });
                res.status(200).json({ message: 'Utilisateur mis à jour' });
            });
        });
    } else {
        User.updateUser(id, userData, (err) => {
            if (err) return res.status(500).json({ message: 'Erreur serveur' });
            res.status(200).json({ message: 'Utilisateur mis à jour' });
        });
    }
};

// ❌ Suppression d’un utilisateur
exports.deleteUser = (req, res) => {
    const id = req.params.id;

    User.deleteUser(id, (err) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.status(200).json({ message: 'Utilisateur supprimé' });
    });
};
