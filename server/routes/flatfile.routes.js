const express = require('express');
const router = express.Router();
const flatFileController = require('../controllers/flatfile.controller');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Flat file routes
router.post('/upload', upload.single('file'), flatFileController.uploadFile);
router.post('/columns', flatFileController.getColumns);
router.post('/preview', flatFileController.previewData);

module.exports = router;