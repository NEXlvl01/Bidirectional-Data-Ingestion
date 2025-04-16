import React from 'react';
import { motion } from 'framer-motion';
import { useIngestion } from '../../contexts/IngestionContext';
import { api } from '../../lib/api';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Database, Server, Key, User, ChevronRight } from 'lucide-react';

const ClickHouseForm = () => {
  const {
    clickHouseParams,
    selectedColumns,
    selectedTable,
    setSelectedTable,
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

  const formItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6" 
        variants={formItemVariants}
      >
        <div className="space-y-2">
          <Label htmlFor="host" className="flex items-center gap-2">
            <Server className="h-4 w-4 text-blue-600" />
            Host
          </Label>
          <Input
            id="host"
            name="host"
            value={clickHouseParams.host}
            onChange={handleInputChange}
            placeholder="localhost"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="port" className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-blue-600" />
            Port
          </Label>
          <Input
            id="port"
            name="port"
            value={clickHouseParams.port}
            onChange={handleInputChange}
            placeholder="8123"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
      </motion.div>
      
      <motion.div className="space-y-2" variants={formItemVariants}>
        <Label htmlFor="database" className="flex items-center gap-2">
          <Database className="h-4 w-4 text-blue-600" />
          Database
        </Label>
        <Input
          id="database"
          name="database"
          value={clickHouseParams.database}
          onChange={handleInputChange}
          placeholder="default"
          className="border-blue-200 focus:border-blue-400"
        />
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={formItemVariants}
      >
        <div className="space-y-2">
          <Label htmlFor="username" className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            Username
          </Label>
          <Input
            id="username"
            name="username"
            value={clickHouseParams.username}
            onChange={handleInputChange}
            placeholder="default"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="token" className="flex items-center gap-2">
            <Key className="h-4 w-4 text-blue-600" />
            JWT Token
          </Label>
          <Input
            id="token"
            name="token"
            type="password"
            value={clickHouseParams.token}
            onChange={handleInputChange}
            placeholder="JWT Token"
            className="border-blue-200 focus:border-blue-400"
          />
        </div>
      </motion.div>
      
      <motion.div variants={formItemVariants}>
        <Button 
          onClick={handleConnect} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300"
        >
          <Database className="h-4 w-4 mr-2" />
          Connect to ClickHouse
        </Button>
      </motion.div>
      
      {availableTables.length > 0 && (
        <motion.div 
          className="space-y-4 pt-4 border-t border-blue-100"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2">
            <Label htmlFor="table-select">Select Table</Label>
            <Select value={selectedTable} onValueChange={handleTableChange}>
              <SelectTrigger className="border-blue-200 focus:border-blue-400">
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
            <Button 
              onClick={handlePreview} 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Preview Data
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ClickHouseForm;