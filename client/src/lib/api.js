// API service for handling backend communication
const API_URL = 'http://localhost:5000/api';

export const api = {
  // ClickHouse endpoints
  clickhouse: {
    connect: async (params) => {
      const response = await fetch(`${API_URL}/clickhouse/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await response.json();
    },
    
    getTables: async (params) => {
      const response = await fetch(`${API_URL}/clickhouse/tables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await response.json();
    },
    
    getColumns: async (params) => {
      const response = await fetch(`${API_URL}/clickhouse/columns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await response.json();
    },
    
    previewData: async (params) => {
      const response = await fetch(`${API_URL}/clickhouse/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await response.json();
    }
  },
  
  // Flat File endpoints
  flatFile: {
    upload: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${API_URL}/flatfile/upload`, {
        method: 'POST',
        body: formData
      });
      return await response.json();
    },
    
    getColumns: async (params) => {
      const response = await fetch(`${API_URL}/flatfile/columns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await response.json();
    },
    
    previewData: async (params) => {
      const response = await fetch(`${API_URL}/flatfile/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await response.json();
    }
  },
  
  // Ingestion endpoints
  ingestion: {
    clickhouseToFlatFile: async (params) => {
      const response = await fetch(`${API_URL}/ingestion/clickhouse-to-flatfile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await response.json();
    },
    
    flatFileToClickHouse: async (params) => {
      const response = await fetch(`${API_URL}/ingestion/flatfile-to-clickhouse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await response.json();
    }
  }
};