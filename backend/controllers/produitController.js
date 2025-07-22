const Produit = require('../models/produitModel');
const fs = require('fs');
const path = require('path');

// Configuration du dossier d'uploads
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ➕ Ajouter un produit avec image
exports.createProduit = (req, res) => {
    // Vérifier les champs requis
    if (!req.body.nom || !req.body.prix || !req.body.cataloge_id) {
        if (req.file) fs.unlinkSync(req.file.path); // Nettoyer le fichier uploadé
        return res.status(400).json({ message: 'Nom, prix et catalogue ID sont requis' });
    }

    const imageUrl = req.file ? '/uploads/' + req.file.filename : null;
    
    const data = {
        nom: req.body.nom,
        description: req.body.description || null,
        prix: parseFloat(req.body.prix),
        cataloge_id: parseInt(req.body.cataloge_id),
        image_url: imageUrl
    };

    Produit.create(data, (err, result) => {
        if (err) {
            if (req.file) fs.unlinkSync(req.file.path);
            console.error('Erreur création produit:', err);
            
            // Gestion spécifique des erreurs MySQL
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ message: 'Catalogue ID invalide' });
            }
            
            return res.status(500).json({ 
                message: 'Erreur serveur',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
        
        res.status(201).json({ 
            message: 'Produit créé avec succès',
            produitId: result.insertId,
            imageUrl: imageUrl
        });
    });
};

// 📥 Récupérer tous les produits (inchangé)
exports.getAllProduits = (req, res) => {
    Produit.getAll((err, produits) => {
        if (err) {
            console.error('Erreur récupération produits:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        res.status(200).json(produits);
    });
};

// 🔍 Récupérer un produit par ID (inchangé)
exports.getProduitById = (req, res) => {
    const id = req.params.id;

    Produit.getById(id, (err, produit) => {
        if (err) {
            console.error('Erreur récupération produit:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        if (!produit) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }
        res.status(200).json(produit);
    });
};

// ✏️ Modifier un produit avec gestion d'image
exports.updateProduit = async (req, res) => {
    try {
        const id = req.params.id;
        let imageUrl = null;

        // Récupérer le produit existant
        const existingProduit = await new Promise((resolve, reject) => {
            Produit.getById(id, (err, produit) => {
                if (err) return reject(err);
                resolve(produit);
            });
        });

        if (!existingProduit) {
            // Supprimer la nouvelle image si le produit n'existe pas
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        // Préparer les données de mise à jour
        const data = {
            ...req.body,
            image_url: req.file ? '/uploads/' + req.file.filename : existingProduit.image_url
        };

        // Mettre à jour le produit
        const result = await new Promise((resolve, reject) => {
            Produit.update(id, data, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        // Supprimer l'ancienne image si elle a été remplacée
        if (req.file && existingProduit.image_url) {
            const oldImagePath = path.join(__dirname, '../../public', existingProduit.image_url);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        res.status(200).json({ 
            message: 'Produit mis à jour',
            imageUrl: data.image_url
        });

    } catch (err) {
        // Nettoyage en cas d'erreur
        if (req.file) fs.unlinkSync(req.file.path);
        
        console.error('Erreur mise à jour produit:', err);
        res.status(500).json({ 
            message: 'Erreur serveur',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};
// ❌ Supprimer un produit avec suppression de l'image associée
exports.deleteProduit = (req, res) => {
    const id = req.params.id;

    // Récupérer le produit pour connaître l'image associée
    Produit.getById(id, (err, produit) => {
        if (err) {
            console.error('Erreur récupération produit:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }

        Produit.delete(id, (err, result) => {
            if (err) {
                console.error('Erreur suppression produit:', err);
                return res.status(500).json({ message: 'Erreur serveur' });
            }

            // Supprimer l'image associée si elle existe
            if (produit && produit.image_url) {
                const imagePath = path.join(uploadDir, produit.image_url.replace('/uploads/', ''));
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }

            res.status(200).json({ message: 'Produit supprimé' });
        });
    });
};