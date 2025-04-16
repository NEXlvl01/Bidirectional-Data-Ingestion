const { createClient } = require('@clickhouse/client');
const clickhouseModel = require('../models/clickhouse.model');

// Controller for ClickHouse operations
const clickhouseController = {
  // Test connection to ClickHouse
  connect: async (req, res, next) => {
    try {
      const { host, port, database, username, token } = req.body;
      
      if (!host || !port || !database) {
        return res.status(400).json({
          success: false,
          message: 'Missing required connection parameters'
        });
      }

      // Attempt to connect with provided credentials
      const client = createClient({
        host: `${host}:${port}`,
        database,
        username,
        password: token // Using JWT token as password for authentication
      });

      // Test the connection
      await client.ping();
      
      res.status(200).json({
        success: true,
        message: 'Successfully connected to ClickHouse'
      });
    } catch (error) {
      console.error('ClickHouse connection error:', error);
      res.status(500).json({
        success: false,
        message: `Failed to connect to ClickHouse: ${error.message}`
      });
    }
  },

  // Get available tables from ClickHouse
  getTables: async (req, res, next) => {
    try {
      const { host, port, database, username, token } = req.body;
      
      // Create ClickHouse client
      const client = createClient({
        host: `${host}:${port}`,
        database,
        username,
        password: token
      });

      // Get tables
      const tables = await clickhouseModel.getTables(client, database);
      
      res.status(200).json({
        success: true,
        data: tables
      });
    } catch (error) {
      console.error('Error getting ClickHouse tables:', error);
      res.status(500).json({
        success: false,
        message: `Failed to get tables: ${error.message}`
      });
    }
  },

  // Get columns for a specific table
  getColumns: async (req, res, next) => {
    try {
      const { host, port, database, username, token, table } = req.body;
      
      if (!table) {
        return res.status(400).json({
          success: false,
          message: 'Table name is required'
        });
      }

      // Create ClickHouse client
      const client = createClient({
        host: `${host}:${port}`,
        database,
        username,
        password: token
      });

      // Get columns
      const columns = await clickhouseModel.getColumns(client, database, table);
      
      res.status(200).json({
        success: true,
        data: columns
      });
    } catch (error) {
      console.error('Error getting columns:', error);
      res.status(500).json({
        success: false,
        message: `Failed to get columns: ${error.message}`
      });
    }
  },

  // Preview data from a table with selected columns
  previewData: async (req, res, next) => {
    try {
      
      const { host, port, database, username, token, table, columns } = req.body;
      
      if (!table || !columns || !columns.length) {
        return res.status(400).json({
          success: false,
          message: 'Table name and at least one column are required'
        });
      }

      // Create ClickHouse client
      const client = createClient({
        host: `${host}:${port}`,
        database,
        username,
        password: token
      });

      // Preview data
      const limit = 100; // Show first 100 rows
      const data = await clickhouseModel.previewData(client, table, columns, limit);
      
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error previewing data:', error);
      res.status(500).json({
        success: false,
        message: `Failed to preview data: ${error.message}`
      });
    }
  }
};

module.exports = clickhouseController;