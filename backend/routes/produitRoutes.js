const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const authenticateToken = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

// Configuration de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads');
    require('fs').mkdirSync(uploadDir, { recursive: true }); // Crée le dossier s'il n'existe pas
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'produit-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accepter seulement les images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite à 5MB
  }
});

router.post('/', 
  authenticateToken,
  (req, res, next) => {
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
  },
  upload.single('image'),
  produitController.createProduit
);

router.put('/:id', 
  authenticateToken, 
  upload.single('image'), 
  produitController.updateProduit
);

// Routes protégées sans gestion de fichiers
router.get('/', authenticateToken, produitController.getAllProduits);
router.get('/:id', authenticateToken, produitController.getProduitById);
router.delete('/:id', authenticateToken, produitController.deleteProduit);

module.exports = router;