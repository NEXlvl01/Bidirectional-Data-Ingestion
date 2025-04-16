const fs = require("fs");
const csv = require("csv-parser");

const BATCH_SIZE = 1000;

// Model for Flat File operations
const flatFileModel = {
  // Get columns from a flat file
  getColumns: async (filePath, delimiter = ",") => {
    return new Promise((resolve, reject) => {
      const columns = [];

      fs.createReadStream(filePath)
        .pipe(csv({ separator: delimiter }))
        .on("headers", (headers) => {
          headers.forEach((header) => {
            columns.push({
              name: header,
              // Infer types based on data later if needed
              type: "String",
            });
          });

          // Stop after getting headers
          resolve(columns);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  },

  // Preview data from a flat file
  previewData: async (filePath, delimiter = ",", columns = [], limit = 100) => {
    return new Promise((resolve, reject) => {
      const rows = [];
      let count = 0;

      fs.createReadStream(filePath)
        .pipe(csv({ separator: delimiter }))
        .on("data", (row) => {
          if (count < limit) {
            // Filter columns if specified
            if (columns && columns.length > 0) {
              const filteredRow = {};
              columns.forEach((col) => {
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
        .on("end", () => {
          resolve(rows);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  },

  // Get total rows count
  getRowCount: async (filePath, delimiter = ",") => {
    return new Promise((resolve, reject) => {
      let count = 0;

      fs.createReadStream(filePath)
        .pipe(csv({ separator: delimiter }))
        .on("data", () => {
          count++;
        })
        .on("end", () => {
          resolve(count);
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  },

  // Import data to ClickHouse
  importToClickHouse: async (
    client,
    filePath,
    delimiter = ",",
    columns = [],
    targetTable,
    createTable = false
  ) => {
    try {
      const fileColumns = await flatFileModel.getColumns(filePath, delimiter);

      // Filter out invalid column names (e.g. with spaces or special characters)
      const isValidColumn = (name) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
      const validFileColumns = fileColumns.filter(
        (col) => col.name && isValidColumn(col.name.trim())
      );

      const ignoredColumns = fileColumns
        .filter((col) => !isValidColumn(col.name?.trim()))
        .map((col) => col.name);

      if (ignoredColumns.length) {
        console.warn("Ignored invalid columns:", ignoredColumns);
      }

      const selectedColumns =
        columns.length > 0
          ? columns.filter((col) => isValidColumn(col))
          : validFileColumns.map((col) => col.name.trim());

      if (createTable) {
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS ${targetTable} (
            ${validFileColumns
              .map((col) => `\`${col.name.trim()}\` String`)
              .join(", ")}
          ) ENGINE = MergeTree() ORDER BY tuple()
        `;
        await client.query({ query: createTableQuery });
      }

      const insertBatch = async (batch) => {
        if (batch.length === 0) return;
        await client.insert({
          table: targetTable,
          values: batch,
          format: "JSONEachRow",
        });
      };

      return await new Promise((resolve, reject) => {
        const batch = [];
        let totalRows = 0;

        const stream = fs
          .createReadStream(filePath)
          .pipe(csv({ separator: delimiter }));

        stream
          .on("data", async (row) => {
            const filteredRow = {};
            selectedColumns.forEach((col) => {
              filteredRow[col] = row[col] ?? "";
            });

            batch.push(filteredRow);

            if (batch.length >= BATCH_SIZE) {
              stream.pause();
              const currentBatch = [...batch];
              batch.length = 0;

              try {
                await insertBatch(currentBatch);
                totalRows += currentBatch.length;
                stream.resume();
              } catch (err) {
                reject(err);
              }
            }
          })
          .on("end", async () => {
            try {
              if (batch.length > 0) {
                await insertBatch(batch);
                totalRows += batch.length;
              }
              resolve({ count: totalRows, ignoredColumns });
            } catch (err) {
              reject(err);
            }
          })
          .on("error", (error) => {
            reject(error);
          });
      });
    } catch (err) {
      throw new Error(`Error in importToClickHouse: ${err.message}`);
    }
  },
};

module.exports = flatFileModel;
