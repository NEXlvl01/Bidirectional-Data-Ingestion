import React, { createContext, useState, useContext } from 'react';

const IngestionContext = createContext();

export const useIngestion = () => useContext(IngestionContext);

export const IngestionProvider = ({ children }) => {
  // Source selection
  const [source, setSource] = useState('clickhouse'); // 'clickhouse' or 'flatfile'
  
  // ClickHouse connection params
  const [clickHouseParams, setClickHouseParams] = useState({
    host: '',
    port: '',
    database: '',
    username: '',
    token: ''
  });
  
  // FlatFile params
  const [flatFileParams, setFlatFileParams] = useState({
    filename: '',
    originalName: '',
    path: '',
    delimiter: ','
  });
  
  // Target table settings
  const [targetTable, setTargetTable] = useState('');
  const [createTable, setCreateTable] = useState(false);
  
  // Available data
  const [availableTables, setAvailableTables] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  
  // Data preview
  const [previewData, setPreviewData] = useState([]);
  
  // Process status
  const [status, setStatus] = useState('idle'); // idle, connecting, loading, ingesting, completed, error
  const [error, setError] = useState(null);
  const [resultData, setResultData] = useState(null);
  
  // Connection status
  const [isConnected, setIsConnected] = useState(false);
  
  // Reset form
  const resetForm = () => {
    setClickHouseParams({
      host: '',
      port: '',
      database: '',
      username: '',
      token: ''
    });
    setFlatFileParams({
      filename: '',
      originalName: '',
      path: '',
      delimiter: ','
    });
    setTargetTable('');
    setCreateTable(false);
    setAvailableTables([]);
    setAvailableColumns([]);
    setSelectedColumns([]);
    setPreviewData([]);
    setStatus('idle');
    setError(null);
    setResultData(null);
    setIsConnected(false);
  };

  // File upload handler
  const handleFileUpload = (fileData) => {
    setFlatFileParams({
      ...flatFileParams,
      filename: fileData.filename,
      originalName: fileData.originalName,
      path: fileData.path
    });
  };

  const value = {
    source,
    setSource,
    clickHouseParams,
    setClickHouseParams,
    flatFileParams,
    setFlatFileParams,
    targetTable,
    setTargetTable,
    createTable,
    setCreateTable,
    availableTables,
    setAvailableTables,
    availableColumns,
    setAvailableColumns,
    selectedColumns,
    setSelectedColumns,
    previewData,
    setPreviewData,
    status,
    setStatus,
    error,
    setError,
    resultData,
    setResultData,
    isConnected,
    setIsConnected,
    resetForm,
    handleFileUpload
  };

  return (
    <IngestionContext.Provider value={value}>
      {children}
    </IngestionContext.Provider>
  );
};