const express = require('express');
const router = express.Router();
const clickhouseRoutes = require('./routes/clickhouse.routes');
const flatFileRoutes = require('./routes/flatfile.routes');
const ingestionRoutes = require('./routes/ingestion.routes');

// Mount route groups
router.use('/clickhouse', clickhouseRoutes);
router.use('/flatfile', flatFileRoutes);
router.use('/ingestion', ingestionRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Service is healthy' });
});

module.exports = router;
