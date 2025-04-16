import React from 'react';
import { motion } from 'framer-motion';
import { useIngestion } from '../../contexts/IngestionContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';
import { Database, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge'; 

const DataPreview = () => {
  const { previewData, selectedColumns } = useIngestion();
  
  if (!previewData || previewData.length === 0) {
    return (
      <motion.div 
        className="p-8 text-center border-2 border-dashed border-purple-200 rounded-lg bg-purple-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Database className="h-12 w-12 mx-auto mb-3 text-purple-400 opacity-70" />
        <p className="text-purple-800">No preview data available. Click "Preview Data" to load a sample.</p>
      </motion.div>
    );
  }
  
  // Get column headers from first row
  const headers = Object.keys(previewData[0]).filter(
    header => !selectedColumns.length || selectedColumns.includes(header)
  );
  
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            {previewData.length} records
          </Badge>
          <span className="text-gray-500">Sample data from selected source</span>
        </p>
      </div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <ScrollArea className="h-72 rounded-lg border border-purple-100 shadow-inner">
          <Table>
            <TableHeader className="bg-purple-50 sticky top-0 z-10">
              <TableRow>
                {headers.map(header => (
                  <TableHead key={header} className="text-purple-900 font-medium">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((row, rowIndex) => (
                <TableRow 
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-purple-50/30'}
                >
                  {headers.map(header => (
                    <TableCell key={`${rowIndex}-${header}`} className="py-2">
                      {row[header] !== null && row[header] !== undefined ? 
                        String(row[header]) : 
                        <span className="text-gray-400 italic">null</span>
                      }
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </motion.div>
      
      {headers.length < Object.keys(previewData[0]).length && (
        <div className="flex items-center text-xs text-amber-700 gap-1 mt-1">
          <AlertCircle className="h-3 w-3" />
          <span>Only showing selected columns. {Object.keys(previewData[0]).length - headers.length} columns are hidden.</span>
        </div>
      )}
    </motion.div>
  );
};

export default DataPreview;