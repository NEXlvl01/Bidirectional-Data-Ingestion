import React from 'react';
import { useIngestion } from '../../contexts/IngestionContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { ScrollArea } from '../ui/scroll-area';

const DataPreview = () => {
  const { previewData, selectedColumns } = useIngestion();
  
  if (!previewData || previewData.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No preview data available. Click "Preview Data" to load a sample.</p>
      </div>
    );
  }
  
  // Get column headers from first row
  const headers = Object.keys(previewData[0]).filter(
    header => !selectedColumns.length || selectedColumns.includes(header)
  );
  
  return (
    <div className="space-y-2">
      <p className="text-sm">Showing {previewData.length} records from dataset</p>
      
      <ScrollArea className="h-64 rounded border">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map(header => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map(header => (
                  <TableCell key={`${rowIndex}-${header}`}>
                    {row[header] !== null && row[header] !== undefined ? row[header].toString() : '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default DataPreview;