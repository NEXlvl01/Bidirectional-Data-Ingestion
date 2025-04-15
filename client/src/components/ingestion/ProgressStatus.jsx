import React from 'react';
import { useIngestion } from '../../contexts/IngestionContext';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Progress } from '../ui/progress';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ProgressStatus = () => {
  const { status, error, resultData } = useIngestion();
  
  if (status === 'idle' || status === 'connecting' || status === 'loading') {
    return null;
  }
  
  if (status === 'error') {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error || 'An unknown error occurred'}</AlertDescription>
      </Alert>
    );
  }
  
  if (status === 'ingesting') {
    return (
      <div className="mt-6 space-y-2">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p>Processing data...</p>
        </div>
        <Progress value={undefined} className="h-2" />
      </div>
    );
  }
  
  if (status === 'completed' && resultData) {
    return (
      <Alert className="mt-6 bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Success</AlertTitle>
        <AlertDescription className="text-green-700">
          {resultData.recordsProcessed 
            ? `Successfully processed ${resultData.recordsProcessed} records.` 
            : 'Ingestion completed successfully.'
          }
          {resultData.outputFile && (
            <p className="mt-2">
              Output file: {resultData.outputFile}
            </p>
          )}
          {resultData.targetTable && (
            <p className="mt-2">
              Target table: {resultData.targetTable}
            </p>
          )}
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default ProgressStatus;