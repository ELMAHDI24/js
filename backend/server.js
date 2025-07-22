const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const multer = require('multer');
const path = require('path');


const userRoutes = require('./routes/userRoutes');
const produitRoutes = require('./routes/produitRoutes');
const frssRoutes = require('./routes/frsRoutes');
const catalogueRoutes = require('./routes/catalogueRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const collectionProduitsRoutes = require('./routes/collectionProduitsRouter');
const dashboardRoutes = require('./routes/dashboardRoutes');



dotenv.config();


const db = require('./config/db');

const app = express();


app.use(cors());
app.use(express.json());


app.use('/api/users', userRoutes);
app.use('/api/produits', produitRoutes);
app.use('/api/frss', frssRoutes);
app.use('/api/catalogue', catalogueRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/collection_produits', collectionProduitsRoutes);
app.use('/api/dashboard', dashboardRoutes);






const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Dossier où les images seront stockées
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route pour créer un produit
app.post('/api/produits', upload.single('image'), async (req, res) => {
  try {
    const { nom, description, prix, cataloge_id } = req.body;
    const imageUrl = req.file ? '/uploads/' + req.file.filename : null;
    
    // Sauvegarder le produit dans la base de données avec imageUrl
    // ...
    
    res.status(201).send(produit);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route pour mettre à jour un produit
app.put('/api/produits/:id', upload.single('image'), async (req, res) => {
  try {
    const { nom, description, prix, cataloge_id } = req.body;
    let imageUrl = null;
    
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename;
      // Optionnel: Supprimer l'ancienne image si elle existe
    }
    
    // Mettre à jour le produit dans la base de données
    // ...
    
    res.status(200).send(produit);
  } catch (error) {
    res.status(500).send(error.message);
  }
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
