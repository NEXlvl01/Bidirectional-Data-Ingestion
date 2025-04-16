import React from 'react';
import { motion } from 'framer-motion';
import { useIngestion } from '../../contexts/IngestionContext';
import { api } from '../../lib/api';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { FileUp, FileText, SplitSquareVertical } from 'lucide-react';

const FlatFileForm = () => {
  const {
    flatFileParams,
    setFlatFileParams,
    selectedColumns,
    handleFileUpload,
    setAvailableColumns,
    setSelectedColumns,
    setStatus,
    setError,
    setIsConnected,
    setPreviewData
  } = useIngestion();
  
  const handleDelimiterChange = (e) => {
    const { value } = e.target;
    setFlatFileParams(prev => ({ ...prev, delimiter: value }));
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setStatus('loading');
      setError(null);
      
      // Upload file
      const result = await api.flatFile.upload(file);
      
      if (result.success) {
        handleFileUpload(result.data);
        
        // Get columns from the uploaded file
        const columnsResult = await api.flatFile.getColumns({
          filename: result.data.filename,
          delimiter: flatFileParams.delimiter
        });
        
        if (columnsResult.success) {
          setAvailableColumns(columnsResult.data);
          setSelectedColumns([]);
          setIsConnected(true);
          setStatus('idle');
        } else {
          throw new Error(columnsResult.message || 'Failed to fetch columns');
        }
      } else {
        throw new Error(result.message || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setStatus('error');
      setError(error.message);
      setIsConnected(false);
    }
  };
  
  const handlePreview = async () => {
    try {
      setStatus('loading');
      
      const result = await api.flatFile.previewData({
        filename: flatFileParams.filename,
        delimiter: flatFileParams.delimiter,
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
      <motion.div className="space-y-3" variants={formItemVariants}>
        <Label htmlFor="file" className="flex items-center gap-2">
          <FileUp className="h-4 w-4 text-green-600" />
          Select Flat File
        </Label>
        <div className="border-2 border-dashed border-green-200 rounded-lg p-6 text-center hover:bg-green-50 transition-colors duration-300">
          <Input
            id="file"
            type="file"
            accept=".csv,.tsv,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="file" className="cursor-pointer block">
            <FileText className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <span className="text-green-700 font-medium">Click to browse or drag and drop</span>
            <p className="text-sm text-green-600 mt-1">Support for CSV, TSV, TXT files</p>
          </label>
        </div>
      </motion.div>
      
      <motion.div className="space-y-2" variants={formItemVariants}>
        <Label htmlFor="delimiter" className="flex items-center gap-2">
          <SplitSquareVertical className="h-4 w-4 text-green-600" />
          Delimiter
        </Label>
        <Input
          id="delimiter"
          value={flatFileParams.delimiter}
          onChange={handleDelimiterChange}
          placeholder=","
          className="border-green-200 focus:border-green-400"
        />
      </motion.div>
      
      {flatFileParams.filename && (
        <motion.div 
          className="pt-2 bg-green-50 p-4 rounded-md border border-green-200"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            <div>
              <span className="font-medium text-green-800">Selected File:</span>{' '}
              <span className="text-green-700">{flatFileParams.originalName}</span>
            </div>
          </div>
        </motion.div>
      )}
      
      {selectedColumns && selectedColumns.length > 0 && (
        <motion.div variants={formItemVariants}>
          <Button 
            onClick={handlePreview} 
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Preview Data
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FlatFileForm;