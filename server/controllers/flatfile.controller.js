const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const flatFileModel = require('../models/flatfile.model');

// Controller for Flat File operations
const flatFileController = {
  // Upload a flat file
  uploadFile: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // Return file info
      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          size: req.file.size
        }
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({
        success: false,
        message: `Failed to upload file: ${error.message}`
      });
    }
  },

  // Get columns from a flat file
  getColumns: async (req, res, next) => {
    try {
      const { filename, delimiter } = req.body;
      
      if (!filename) {
        return res.status(400).json({
          success: false,
          message: 'Filename is required'
        });
      }

      const filePath = path.join(__dirname, '../../uploads', filename);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      // Get columns from file
      const columns = await flatFileModel.getColumns(filePath, delimiter || ',');
      
      res.status(200).json({
        success: true,
        data: columns
      });
    } catch (error) {
      console.error('Error getting columns from file:', error);
      res.status(500).json({
        success: false,
        message: `Failed to get columns: ${error.message}`
      });
    }
  },

  // Preview data from a flat file
  previewData: async (req, res, next) => {
    try {
      const { filename, delimiter, columns } = req.body;
      
      if (!filename) {
        return res.status(400).json({
          success: false,
          message: 'Filename is required'
        });
      }

      const filePath = path.join(__dirname, '../../uploads', filename);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found'
        });
      }

      // Preview data from file
      const limit = 100; // Show first 100 rows
      const data = await flatFileModel.previewData(filePath, delimiter || ',', columns, limit);
      
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error previewing data from file:', error);
      res.status(500).json({
        success: false,
        message: `Failed to preview data: ${error.message}`
      });
    }
  }
};

module.exports = flatFileController;