import React from 'react';
import { useIngestion } from '../../contexts/IngestionContext';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';

const ColumnSelection = () => {
  const { availableColumns, selectedColumns, setSelectedColumns } = useIngestion();
  
  const handleColumnToggle = (columnName, isChecked) => {
    if (isChecked) {
      setSelectedColumns(prev => [...prev, columnName]);
    } else {
      setSelectedColumns(prev => prev.filter(col => col !== columnName));
    }
  };
  
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedColumns(availableColumns.map(col => col.name));
    } else {
      setSelectedColumns([]);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="border-b pb-2 flex items-center space-x-2">
        <Checkbox 
          id="select-all" 
          checked={selectedColumns.length === availableColumns.length}
          onCheckedChange={handleSelectAll}
        />
        <Label htmlFor="select-all">Select All Columns</Label>
      </div>
      
      <ScrollArea className="h-64 rounded border p-4">
        <div className="grid grid-cols-3 gap-4">
          {availableColumns.map((column) => (
            <div key={column.name} className="flex items-center space-x-2">
              <Checkbox 
                id={`col-${column.name}`}
                checked={selectedColumns.includes(column.name)}
                onCheckedChange={(checked) => handleColumnToggle(column.name, checked)}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor={`col-${column.name}`}>{column.name}</Label>
                <p className="text-xs text-muted-foreground">{column.type}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="py-2">
        <p className="text-sm">Selected {selectedColumns.length} of {availableColumns.length} columns</p>
      </div>
    </div>
  );
};

export default ColumnSelection;