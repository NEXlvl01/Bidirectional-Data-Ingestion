import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useIngestion } from '../../contexts/IngestionContext';
import { api } from '../../lib/api';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { FileUp, Database, ArrowRight, Table2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

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
        className="flex items-center justify-center p-4 bg-orange-50 border border-orange-100 rounded-lg mb-2"
        variants={formItemVariants}
      >
        <FileUp className="h-5 w-5 text-orange-600 mr-2" />
        <ArrowRight className="h-4 w-4 text-orange-500 mx-2" />
        <Database className="h-5 w-5 text-orange-600" />
        <span className="ml-2 text-orange-800 font-medium">File to ClickHouse Import</span>
      </motion.div>

      <motion.div variants={formItemVariants}>
        <Card className="border-orange-100 bg-orange-50/30">
          <CardContent className="p-4">
            <div className="text-sm text-orange-700 flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
              <span className="font-medium flex items-center">
                <FileUp className="h-4 w-4 mr-1" /> Source:
              </span>
              <span>{flatFileParams.originalName || 'No file selected'}</span>
            </div>
            <div className="text-sm text-orange-700">
              <span className="font-medium">Columns:</span>{' '}
              <span className="italic">{selectedColumns.length} columns selected</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div className="space-y-2" variants={formItemVariants}>
        <Label htmlFor="target-table" className="flex items-center gap-2">
          <Table2 className="h-4 w-4 text-orange-600" />
          Target ClickHouse Table
        </Label>
        <Input
          id="target-table"
          value={targetTable}
          onChange={(e) => setTargetTable(e.target.value)}
          placeholder="Enter table name"
          className="border-orange-200 focus:border-orange-400"
        />
      </motion.div>
      
      <motion.div 
        className="flex items-center space-x-2 p-3 bg-orange-50 rounded-md border border-orange-100"
        variants={formItemVariants}
      >
        <Checkbox
          id="create-table"
          checked={createTable}
          onCheckedChange={setCreateTable}
          className="border-orange-300"
        />
        <Label htmlFor="create-table" className="text-orange-800">
          Create table if not exists
        </Label>
      </motion.div>
      
      <motion.div variants={formItemVariants}>
        <Button 
          onClick={handleStartIngestion} 
          className="w-full bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-2"
          disabled={selectedColumns.length === 0 || !targetTable}
        >
          <Database className="h-4 w-4" />
          Start Import to ClickHouse
        </Button>
      </motion.div>
      
      <motion.div 
        className="text-sm text-gray-600 bg-orange-50 p-3 rounded-md border border-orange-100"
        variants={formItemVariants}
      >
        <p>This will import data from the flat file to ClickHouse with the {selectedColumns.length} selected columns.</p>
      </motion.div>
    </motion.div>
  );
};

export default IngestFileToClickHouse;