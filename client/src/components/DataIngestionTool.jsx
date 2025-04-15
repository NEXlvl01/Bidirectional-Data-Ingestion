import React from 'react';
import { useIngestion } from '../contexts/IngestionContext';
import SourceSelection from './SourceSelection';
import ClickHouseForm from './forms/ClickHouseForm';
import FlatFileForm from './forms/FlatFileForm';
import ColumnSelection from './forms/ColumnSelection';
import DataPreview from './data/DataPreview';
import ProgressStatus from './ingestion/ProgressStatus';
import IngestClickHouseToFile from './ingestion/IngestClickHouseToFile';
import IngestFileToClickHouse from './ingestion/IngestFileToClickHouse';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const DataIngestionTool = () => {
  const { source, setSource, isConnected, availableColumns } = useIngestion();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Bidirectional Data Ingestion Tool</h1>
      
      <Tabs 
        value={source} 
        onValueChange={setSource}
        className="w-full mb-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="clickhouse">ClickHouse to Flat File</TabsTrigger>
          <TabsTrigger value="flatfile">Flat File to ClickHouse</TabsTrigger>
        </TabsList>
        
        <TabsContent value="clickhouse">
          <Card>
            <CardHeader>
              <CardTitle>ClickHouse Source Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <ClickHouseForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="flatfile">
          <Card>
            <CardHeader>
              <CardTitle>Flat File Source Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <FlatFileForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {isConnected && availableColumns.length > 0 && (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Column Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <ColumnSelection />
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <DataPreview />
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Ingestion</CardTitle>
            </CardHeader>
            <CardContent>
              {source === 'clickhouse' ? (
                <IngestClickHouseToFile />
              ) : (
                <IngestFileToClickHouse />
              )}
            </CardContent>
          </Card>
        </>
      )}
      
      <ProgressStatus />
    </div>
  );
};

export default DataIngestionTool;