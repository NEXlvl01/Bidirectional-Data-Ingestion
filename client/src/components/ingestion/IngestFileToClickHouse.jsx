import React, { useState } from 'react';
import { useIngestion } from '../../contexts/IngestionContext';
import { api } from '../../lib/api';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

const IngestFileToClickHouse = () => {
  const {
    clickHouseParams,
    flatFileParams,
    selectedColumns,
    setStatus,
    setError,
    setResultData
  } = useIngestion();
  
  const [targetTable, setTargetTable] = useState('');
  const [createTable, setCreateTable] = useState(false);
  
  const handleStartIngestion = async () => {
    try {
      if (!targetTable) {
        throw new Error('Target table name is required');
      }
      
      setStatus('ingesting');
      setError(null);
      
      const result = await api.ingestion.flatFileToClickHouse({
        // ClickHouse connection params
        host: clickHouseParams.host,
        port: clickHouseParams.port,
        database: clickHouseParams.database,
        username: clickHouseParams.username,
        token: clickHouseParams.token,
        
        // Flat file params
        filename: flatFileParams.filename,
        delimiter: flatFileParams.delimiter,
        
        // Ingestion params
        columns: selectedColumns,
        targetTable,
        createTable
      });
      
      if (result.success) {
        setResultData(result.data);
        setStatus('completed');
      } else {
        throw new Error(result.message || 'Ingestion failed');
      }
    } catch (error) {
      console.error('Ingestion error:', error);
      setStatus('error');
      setError(error.message);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="target-table">Target ClickHouse Table</Label>
        <Input
          id="target-table"
          value={targetTable}
          onChange={(e) => setTargetTable(e.target.value)}
          placeholder="Enter table name"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="create-table"
          checked={createTable}
          onCheckedChange={setCreateTable}
        />
        <Label htmlFor="create-table">Create table if not exists</Label>
      </div>
      
      <Button 
        onClick={handleStartIngestion} 
        className="w-full"
        disabled={selectedColumns.length === 0 || !targetTable}
      >
        Start Ingestion
      </Button>
      
      <div className="text-sm text-muted-foreground">
        <p>This will import data from the flat file to ClickHouse with the selected columns.</p>
      </div>
    </div>
  );
};

export default IngestFileToClickHouse;