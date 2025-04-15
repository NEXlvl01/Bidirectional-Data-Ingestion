const express = require('express');
const router = express.Router();
const ingestionController = require('../controllers/ingestion.controller');

// Data ingestion routes
router.post('/clickhouse-to-flatfile', ingestionController.clickhouseToFlatFile);
router.post('/flatfile-to-clickhouse', ingestionController.flatFileToClickHouse);

module.exports = router;