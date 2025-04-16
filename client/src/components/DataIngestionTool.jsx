import React from 'react';
import { useIngestion } from '../contexts/IngestionContext';
import ClickHouseForm from './forms/ClickHouseForm';
import FlatFileForm from './forms/FlatFileForm';
import ColumnSelection from './forms/ColumnSelection';
import DataPreview from './data/DataPreview';
import ProgressStatus from './ingestion/ProgressStatus';
import IngestClickHouseToFile from './ingestion/IngestClickHouseToFile';
import IngestFileToClickHouse from './ingestion/IngestFileToClickHouse';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'framer-motion';
import { Database, FileText } from 'lucide-react';

const DataIngestionTool = () => {
  const { source, setSource, isConnected, availableColumns } = useIngestion();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <motion.h1
        className="text-3xl font-bold mb-2 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Bidirectional Data Ingestion Tool
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs
          value={source}
          onValueChange={setSource}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="clickhouse" className="py-3">
              <span className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>ClickHouse to Flat File</span>
              </span>
            </TabsTrigger>
            <TabsTrigger value="flatfile" className="py-3">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Flat File to ClickHouse</span>
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clickhouse">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-md border-blue-100">
                <CardHeader className="bg-blue-50 rounded-t-lg">
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    ClickHouse Source Configuration
                  </CardTitle>
                  <CardDescription>
                    Connect to your ClickHouse database to export data
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ClickHouseForm />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="flatfile">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-md border-green-100">
                <CardHeader className="bg-green-50 rounded-t-lg">
                  <CardTitle className="text-green-700 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Flat File Source Configuration
                  </CardTitle>
                  <CardDescription>
                    Upload a flat file to import data to ClickHouse
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <FlatFileForm />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {isConnected && availableColumns.length > 0 && (
        <>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-md border-indigo-100">
              <CardHeader className="bg-indigo-50 rounded-t-lg">
                <CardTitle className="text-indigo-700">Column Selection</CardTitle>
                <CardDescription>
                  Select the columns you want to include in your data operation
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ColumnSelection />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="shadow-md border-purple-100">
              <CardHeader className="bg-purple-50 rounded-t-lg">
                <CardTitle className="text-purple-700">Data Preview</CardTitle>
                <CardDescription>
                  Preview the data before performing ingestion
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <DataPreview />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="shadow-md border-orange-100">
              <CardHeader className="bg-orange-50 rounded-t-lg">
                <CardTitle className="text-orange-700">Ingestion Configuration</CardTitle>
                <CardDescription>
                  Configure and start the data ingestion process
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {source === 'clickhouse' ? (
                  <IngestClickHouseToFile />
                ) : (
                  <IngestFileToClickHouse />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      <ProgressStatus />
    </div>
  );
};

export default DataIngestionTool;