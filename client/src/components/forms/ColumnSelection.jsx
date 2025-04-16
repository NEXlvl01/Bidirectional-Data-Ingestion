import React from 'react';
import { motion } from 'framer-motion';
import { useIngestion } from '../../contexts/IngestionContext';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { ScrollArea } from '../ui/scroll-area';
import { Columns, CheckSquare, Database } from 'lucide-react';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      className="space-y-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="border-b pb-3 flex items-center space-x-3"
        variants={itemVariants}
      >
        <div className="bg-purple-100 p-2 rounded-md">
          <Columns className="h-5 w-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-medium text-purple-800">Column Selection</h3>
      </motion.div>

      <motion.div 
        className="border-b pb-2 flex items-center space-x-2 hover:bg-purple-50 p-2 rounded-md transition-colors duration-200"
        variants={itemVariants}
      >
        <Checkbox 
          id="select-all" 
          checked={selectedColumns.length === availableColumns.length && availableColumns.length > 0}
          onCheckedChange={handleSelectAll}
          className="border-purple-400 text-purple-600 data-[state=checked]:bg-purple-600"
        />
        <Label htmlFor="select-all" className="flex items-center gap-2 cursor-pointer">
          <CheckSquare className="h-4 w-4 text-purple-600" />
          <span>Select All Columns</span>
        </Label>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <ScrollArea className="h-64 rounded-md border border-purple-200 bg-white p-4 shadow-sm">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {availableColumns.map((column, index) => (
              <motion.div 
                key={column.name} 
                className="flex items-center space-x-2 hover:bg-purple-50 p-2 rounded-md transition-colors duration-200"
                variants={itemVariants}
                transition={{ delay: index * 0.03 }}
              >
                <Checkbox 
                  id={`col-${column.name}`}
                  checked={selectedColumns.includes(column.name)}
                  onCheckedChange={(checked) => handleColumnToggle(column.name, checked)}
                  className="border-purple-400 text-purple-600 data-[state=checked]:bg-purple-600"
                />
                <div className="space-y-1 leading-none">
                  <Label htmlFor={`col-${column.name}`} className="cursor-pointer font-medium">{column.name}</Label>
                  <p className="text-xs text-purple-600/70">{column.type}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </ScrollArea>
      </motion.div>
      
      <motion.div 
        className="py-2 flex items-center justify-between bg-purple-50 px-4 rounded-md"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-purple-600" />
          <p className="text-sm font-medium text-purple-800">Selected {selectedColumns.length} of {availableColumns.length} columns</p>
        </div>
        <span className="text-xs text-purple-600/70">{Math.round((selectedColumns.length / Math.max(availableColumns.length, 1)) * 100)}% selected</span>
      </motion.div>
    </motion.div>
  );
};

export default ColumnSelection;