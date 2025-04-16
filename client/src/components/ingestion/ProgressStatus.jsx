import React from 'react';
import { motion } from 'framer-motion';
import { useIngestion } from '../../contexts/IngestionContext';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Progress } from '../ui/progress';
import { CheckCircle, AlertCircle, Loader2, Download, Upload, FileText, Database } from 'lucide-react';
import { Button } from '../ui/button';

const ProgressStatus = () => {
  const { status, error, resultData, source } = useIngestion();
  
  if (status === 'idle' || status === 'connecting' || status === 'loading') {
    return null;
  }
  
  if (status === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Alert variant="destructive" className="mt-6 border-2">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
            <div>
              <AlertTitle className="text-lg mb-1">Error</AlertTitle>
              <AlertDescription className="text-sm">{error || 'An unknown error occurred'}</AlertDescription>
            </div>
          </div>
        </Alert>
      </motion.div>
    );
  }
  
  if (status === 'ingesting') {
    return (
      <motion.div 
        className="mt-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="p-6 border border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            </div>
            <div>
              <h3 className="font-medium text-blue-800 text-lg">Processing Data</h3>
              <p className="text-blue-700 text-sm">Please wait while your data is being processed...</p>
            </div>
          </div>
          
          <Progress value={70} className="h-2 bg-blue-200" indicatorClassName="bg-blue-600" />
          
          <div className="mt-4 text-sm text-blue-700">
            {source === 'clickhouse' ? (
              <div className="flex items-center">
                <Database className="h-4 w-4 mr-1" />
                <span>Exporting from ClickHouse to file...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                <span>Importing from file to ClickHouse...</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
  
  if (status === 'completed' && resultData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Alert className="mt-6 bg-green-50 border-2 border-green-200">
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <AlertTitle className="text-lg text-green-800 mb-2">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                {resultData.recordsProcessed 
                  ? `Successfully processed ${resultData.recordsProcessed.toLocaleString()} records.` 
                  : 'Ingestion completed successfully.'
                }
                
                {resultData.outputFile && (
                  <div className="flex items-center mt-3 p-2 bg-green-100 rounded border border-green-200">
                    <FileText className="h-4 w-4 text-green-700 mr-2" />
                    <span className="text-green-800">Output file: {resultData.outputFile}</span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="ml-auto text-green-700 hover:text-green-900 hover:bg-green-200"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
                
                {resultData.targetTable && (
                  <div className="flex items-center mt-3 p-2 bg-green-100 rounded border border-green-200">
                    <Database className="h-4 w-4 text-green-700 mr-2" />
                    <span className="text-green-800">Target table: {resultData.targetTable}</span>
                  </div>
                )}
                
                <Button 
                  className="mt-4 bg-green-600 hover:bg-green-700 w-full"
                >
                  Start New Operation
                </Button>
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </motion.div>
    );
  }
  
  return null;
};

export default ProgressStatus;