const express = require('express');
const router = express.Router();
const clickhouseController = require('../controllers/clickhouse.controller');

// ClickHouse connection and validation routes
router.post('/connect', clickhouseController.connect);
router.post('/tables', clickhouseController.getTables);
router.post('/columns', clickhouseController.getColumns);
router.post('/preview', clickhouseController.previewData);

module.exports = router;