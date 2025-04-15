const path = require('path');
const clickhouseModel = require('../models/clickhouse.model');
const flatFileModel = require('../models/flatfile.model');
const { createClient } = require('@clickhouse/client');
const { createObjectCsvWriter } = require('csv-writer');

// Controller for ingestion operations
const ingestionController = {
  // Transfer data from ClickHouse to Flat File
  clickhouseToFlatFile: async (req, res, next) => {
    try {
      const { 
        host, port, database, username, token, 
        table, columns, outputFilename, delimiter 
      } = req.body;
      
      if (!host || !port || !database || !table || !columns || !columns.length || !outputFilename) {
        return res.status(400).json({
          success: false,
          message: 'Missing required parameters'
        });
      }

      // Create ClickHouse client
      const client = createClient({
        host: `${host}:${port}`,
        database,
        username,
        password: token
      });

      // Output file path
      const outputPath = path.join(__dirname, '../../uploads', outputFilename);
      
      // Execute ingestion
      const result = await clickhouseModel.exportToFlatFile(
        client, table, columns, outputPath, delimiter || ','
      );
      
      res.status(200).json({
        success: true,
        message: 'Data successfully exported to flat file',
        data: {
          recordsProcessed: result.count,
          outputFile: outputFilename,
          outputPath: outputPath
        }
      });
    } catch (error) {
      console.error('Error during ClickHouse to flat file ingestion:', error);
      res.status(500).json({
        success: false,
        message: `Ingestion failed: ${error.message}`
      });
    }
  },

  // Transfer data from Flat File to ClickHouse
  flatFileToClickHouse: async (req, res, next) => {
    try {
      const { 
        host, port, database, username, token,
        filename, delimiter, columns, targetTable, createTable
      } = req.body;
      
      if (!host || !port || !database || !filename || !columns || !columns.length || !targetTable) {
        return res.status(400).json({
          success: false,
          message: 'Missing required parameters'
        });
      }

      const filePath = path.join(__dirname, '../../uploads', filename);

      // Create ClickHouse client
      const client = createClient({
        host: `${host}:${port}`,
        database,
        username,
        password: token
      });

      // Execute ingestion
      const result = await flatFileModel.importToClickHouse(
        client, filePath, delimiter || ',', columns, targetTable, createTable
      );
      
      res.status(200).json({
        success: true,
        message: 'Data successfully imported to ClickHouse',
        data: {
          recordsProcessed: result.count,
          targetTable: targetTable
        }
      });
    } catch (error) {
      console.error('Error during flat file to ClickHouse ingestion:', error);
      res.status(500).json({
        success: false,
        message: `Ingestion failed: ${error.message}`
      });
    }
  }
};

module.exports = ingestionController;