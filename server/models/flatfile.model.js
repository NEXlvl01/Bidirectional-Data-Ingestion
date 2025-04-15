const fs = require('fs');
const csv = require('csv-parser');

// Model for Flat File operations
const flatFileModel = {
  // Get columns from a flat file
  getColumns: async (filePath, delimiter = ',') => {
    return new Promise((resolve, reject) => {
      const columns = [];
      
      fs.createReadStream(filePath)
        .pipe(csv({ separator: delimiter }))
        .on('headers', (headers) => {
          headers.forEach(header => {
            columns.push({
              name: header,
              // Infer types based on data later if needed
              type: 'String' 
            });
          });
          
          // Stop after getting headers
          resolve(columns);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  },
  
  // Preview data from a flat file
  previewData: async (filePath, delimiter = ',', columns = [], limit = 100) => {
    return new Promise((resolve, reject) => {
      const rows = [];
      let count = 0;
      
      fs.createReadStream(filePath)
        .pipe(csv({ separator: delimiter }))
        .on('data', (row) => {
          if (count < limit) {
            // Filter columns if specified
            if (columns && columns.length > 0) {
              const filteredRow = {};
              columns.forEach(col => {
                if (row[col] !== undefined) {
                  filteredRow[col] = row[col];
                }
              });
              rows.push(filteredRow);
            } else {
              rows.push(row);
            }
            count++;
          }
        })
        .on('end', () => {
          resolve(rows);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  },
  
  // Get total rows count
  getRowCount: async (filePath, delimiter = ',') => {
    return new Promise((resolve, reject) => {
      let count = 0;
      
      fs.createReadStream(filePath)
        .pipe(csv({ separator: delimiter }))
        .on('data', () => {
          count++;
        })
        .on('end', () => {
          resolve(count);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  },
  
  // Import data to ClickHouse
  importToClickHouse: async (client, filePath, delimiter = ',', columns = [], targetTable, createTable = false) => {
    try {
      // First determine schema from file
      const fileColumns = await this.getColumns(filePath, delimiter);
      
      // Filter columns if needed
      const selectedColumns = columns.length > 0 ? columns : fileColumns.map(col => col.name);
      
      // Create table if requested
      if (createTable) {
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS ${targetTable} (
            ${fileColumns.map(col => `${col.name} String`).join(', ')}
          ) ENGINE = MergeTree() ORDER BY tuple()
        `;
        
        await client.query({
          query: createTableQuery
        });
      }
      
      // Read and stream data in batches
      const data = await new Promise((resolve, reject) => {
        const rows = [];
        
        fs.createReadStream(filePath)
          .pipe(csv({ separator: delimiter }))
          .on('data', (row) => {
            // Filter columns
            const filteredRow = {};
            selectedColumns.forEach(col => {
              if (row[col] !== undefined) {
                filteredRow[col] = row[col];
              }
            });
            rows.push(filteredRow);
          })
          .on('end', () => {
            resolve(rows);
          })
          .on('error', (error) => {
            reject(error);
          });
      });
      
      // Insert data into ClickHouse
      if (data.length > 0) {
        // Insert query with selected columns
        const columnsStr = selectedColumns.join(', ');
        const insertQuery = `INSERT INTO ${targetTable} (${columnsStr})`;
        
        await client.insert({
          table: targetTable,
          values: data,
          format: 'JSONEachRow'
        });
      }
      
      return {
        count: data.length
      };
    } catch (error) {
      console.error('Error importing to ClickHouse:', error);
      throw error;
    }
  }
};

module.exports = flatFileModel;