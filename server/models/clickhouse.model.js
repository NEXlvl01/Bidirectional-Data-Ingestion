const { createObjectCsvWriter } = require("csv-writer");
const fs = require("fs");

// Model for ClickHouse operations
const clickhouseModel = {
  // Get all tables in a database
  getTables: async (client, database) => {
    try {
      const query = `
        SELECT name 
        FROM system.tables 
        WHERE database = '${database}' 
        ORDER BY name
      `;

      const resultSet = await client.query({
        query,
        format: "JSONEachRow",
      });

      const result = await resultSet.json();
      return result.map((row) => row.name);
    } catch (error) {
      console.error("Error fetching tables:", error);
      throw error;
    }
  },

  // Get columns for a specific table
  getColumns: async (client, database, table) => {
    try {
      const query = `
        SELECT 
          name, 
          type
        FROM system.columns
        WHERE database = '${database}' AND table = '${table}'
        ORDER BY position
      `;

      const resultSet = await client.query({
        query,
        format: "JSONEachRow",
      });

      return await resultSet.json();
    } catch (error) {
      console.error("Error fetching columns:", error);
      throw error;
    }
  },

  // Preview data with selected columns
  previewData: async (client, table, columns, limit = 100) => {
    try {
      // Get actual columns from the table
      const tableSchema = await client
        .query({
          query: `DESCRIBE TABLE ${table}`,
          format: "JSONEachRow",
        })
        .then((res) => res.json());

      const actualColumns = tableSchema.map((col) => col.name);

      // Filter and sanitize user-passed columns
      const validColumns = columns.filter((col) => {
        const rawCol = col.includes(" AS ")
          ? col.split(" AS ")[0].trim()
          : col.trim();
        return actualColumns.includes(rawCol);
      });

      if (validColumns.length === 0) {
        throw new Error("No valid columns found in provided list.");
      }

      const columnsStr = validColumns.join(", ");
      const query = `
        SELECT ${columnsStr}
        FROM ${table}
        LIMIT ${limit}
      `;

      const resultSet = await client.query({
        query,
        format: "JSONEachRow",
      });

      return await resultSet.json();
    } catch (error) {
      console.error("Error previewing data:", error);
      throw error;
    }
  },

  // Export data to flat file
  exportToFlatFile: async (
    client,
    table,
    columns,
    outputPath,
    delimiter = ","
  ) => {
    try {
      const columnsStr = columns.join(", ");
      const query = `
        SELECT ${columnsStr}
        FROM ${table}
      `;

      const resultSet = await client.query({
        query,
        format: "JSONEachRow",
      });

      const data = await resultSet.json();

      // Configure CSV writer
      const csvWriter = createObjectCsvWriter({
        path: outputPath,
        header: columns.map((col) => ({ id: col, title: col })),
        fieldDelimiter: delimiter,
      });

      // Write data to CSV
      await csvWriter.writeRecords(data);

      return {
        count: data.length,
        path: outputPath,
      };
    } catch (error) {
      console.error("Error exporting to flat file:", error);
      throw error;
    }
  },

  // Execute a JOIN query and export to flat file
  executeJoinQuery: async (client, joinConfig, outputPath, delimiter = ",") => {
    try {
      const { tables, columns, joinConditions } = joinConfig;

      // Build JOIN query
      let query = "SELECT ";

      // Add selected columns with table prefixes
      const selectedColumns = columns
        .map((col) => {
          if (col.includes(".")) return col;
          return `${tables[0]}.${col}`;
        })
        .join(", ");

      query += selectedColumns;

      // Add FROM clause with first table
      query += ` FROM ${tables[0]} `;

      // Add JOIN clauses
      for (let i = 1; i < tables.length; i++) {
        query += ` JOIN ${tables[i]} ON ${joinConditions[i - 1]} `;
      }

      const resultSet = await client.query({
        query,
        format: "JSONEachRow",
      });

      const data = await resultSet.json();

      // Configure CSV writer
      const csvWriter = createObjectCsvWriter({
        path: outputPath,
        header: columns.map((col) => {
          const colName = col.includes(".") ? col.split(".")[1] : col;
          return { id: col, title: colName };
        }),
        fieldDelimiter: delimiter,
      });

      // Write data to CSV
      await csvWriter.writeRecords(data);

      return {
        count: data.length,
        path: outputPath,
      };
    } catch (error) {
      console.error("Error executing join query:", error);
      throw error;
    }
  },
};

module.exports = clickhouseModel;
