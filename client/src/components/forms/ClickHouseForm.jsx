import React, { useState } from 'react';
import { useIngestion } from '../../contexts/IngestionContext';
import { api } from '../../lib/api';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const ClickHouseForm = () => {
  const {
    clickHouseParams,
    selectedColumns,
    setClickHouseParams,
    setAvailableTables,
    setAvailableColumns,
    setSelectedColumns,
    setStatus,
    setError,
    setIsConnected,
    availableTables,
    setPreviewData
  } = useIngestion();
  
  const [selectedTable, setSelectedTable] = useState('');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClickHouseParams(prev => ({ ...prev, [name]: value }));
  };
  
  const handleConnect = async () => {
    try {
      setStatus('connecting');
      setError(null);
      
      // Test connection
      const result = await api.clickhouse.connect(clickHouseParams);
      
      if (result.success) {
        // Get tables
        const tablesResult = await api.clickhouse.getTables(clickHouseParams);
        
        if (tablesResult.success) {
          setAvailableTables(tablesResult.data);
          setIsConnected(true);
          setStatus('idle');
        } else {
          throw new Error(tablesResult.message || 'Failed to fetch tables');
        }
      } else {
        throw new Error(result.message || 'Connection failed');
      }
    } catch (error) {
      console.error('Connection error:', error);
      setStatus('error');
      setError(error.message);
      setIsConnected(false);
    }
  };
  
  const handleTableChange = async (value) => {
    setSelectedTable(value);
    try {
      setStatus('loading');
      
      // Get columns for selected table
      const result = await api.clickhouse.getColumns({
        ...clickHouseParams,
        table: value
      });
      
      if (result.success) {
        setAvailableColumns(result.data);
        setSelectedColumns([]);
        setStatus('idle');
      } else {
        throw new Error(result.message || 'Failed to fetch columns');
      }
    } catch (error) {
      console.error('Error fetching columns:', error);
      setStatus('error');
      setError(error.message);
    }
  };
  
  const handlePreview = async () => {
    try {
      setStatus('loading');
      
      const result = await api.clickhouse.previewData({
        ...clickHouseParams,
        table: selectedTable,
        columns: selectedColumns
      });
      
      if (result.success) {
        setPreviewData(result.data);
        setStatus('idle');
      } else {
        throw new Error(result.message || 'Failed to fetch preview data');
      }
    } catch (error) {
      console.error('Error fetching preview data:', error);
      setStatus('error');
      setError(error.message);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            name="host"
            value={clickHouseParams.host}
            onChange={handleInputChange}
            placeholder="localhost"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            name="port"
            value={clickHouseParams.port}
            onChange={handleInputChange}
            placeholder="8123"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="database">Database</Label>
        <Input
          id="database"
          name="database"
          value={clickHouseParams.database}
          onChange={handleInputChange}
          placeholder="default"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={clickHouseParams.username}
            onChange={handleInputChange}
            placeholder="default"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="token">JWT Token</Label>
          <Input
            id="token"
            name="token"
            type="password"
            value={clickHouseParams.token}
            onChange={handleInputChange}
            placeholder="JWT Token"
          />
        </div>
      </div>
      
      <Button onClick={handleConnect} className="w-full">
        Connect to ClickHouse
      </Button>
      
      {availableTables.length > 0 && (
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="table-select">Select Table</Label>
            <Select value={selectedTable} onValueChange={handleTableChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                {availableTables.map(table => (
                  <SelectItem key={table} value={table}>
                    {table}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedColumns.length > 0 && (
            <Button onClick={handlePreview} className="w-full">
              Preview Data
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ClickHouseForm;