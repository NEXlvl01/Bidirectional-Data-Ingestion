import React from 'react';
import { useIngestion } from '../../contexts/IngestionContext';
import { api } from '../../lib/api';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

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
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Select Flat File</Label>
        <Input
          id="file"
          type="file"
          accept=".csv,.tsv,.txt"
          onChange={handleFileChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="delimiter">Delimiter</Label>
        <Input
          id="delimiter"
          value={flatFileParams.delimiter}
          onChange={handleDelimiterChange}
          placeholder=","
        />
      </div>
      
      {flatFileParams.filename && (
        <div className="pt-2">
          <div className="text-sm">
            <span className="font-medium">Selected File:</span> {flatFileParams.originalName}
          </div>
        </div>
      )}
      
      {selectedColumns && selectedColumns.length > 0 && (
        <Button onClick={handlePreview} className="w-full">
          Preview Data
        </Button>
      )}
    </div>
  );
};

export default FlatFileForm;