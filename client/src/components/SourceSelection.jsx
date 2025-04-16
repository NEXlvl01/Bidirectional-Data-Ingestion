import React from 'react';
import { motion } from 'framer-motion';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useIngestion } from '../contexts/IngestionContext';
import { Database, FileText, ArrowRightLeft, Filter } from 'lucide-react';

const SourceSelection = () => {
  const { source, setSource, resetForm } = useIngestion();
  
  const handleSourceChange = (value) => {
    // Reset form when changing source
    resetForm();
    setSource(value);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const sourceOptions = [
    {
      value: 'clickhouse',
      label: 'ClickHouse',
      icon: Database,
      color: 'blue',
      description: 'Connect to a ClickHouse database'
    },
    {
      value: 'flatfile',
      label: 'Flat File',  
      icon: FileText,
      color: 'green',
      description: 'Upload and process CSV, TSV or TXT files'
    }
  ];
  
  return (
    <motion.div 
      className="mb-8 bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-xl border shadow-sm"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex items-center gap-3 mb-6" variants={itemVariants}>
        <div className="bg-indigo-100 p-2 rounded-md">
          <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Select Data Source</h2>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <RadioGroup
          value={source}
          onValueChange={handleSourceChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {sourceOptions.map((option) => {
            const Icon = option.icon;
            return (
              <motion.div 
                key={option.value}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
                }}
                whileTap={{ scale: 0.98 }}
                variants={itemVariants}
                className={`relative border-2 rounded-lg p-5 cursor-pointer transition-all duration-300 ${
                  source === option.value 
                    ? `border-${option.color}-500 bg-${option.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <RadioGroupItem 
                  value={option.value} 
                  id={option.value} 
                  className="absolute right-4 top-4"
                />
                <Label 
                  htmlFor={option.value} 
                  className="cursor-pointer h-full w-full flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`bg-${option.color}-100 p-3 rounded-lg inline-flex`}>
                      <Icon className={`h-6 w-6 text-${option.color}-600`} />
                    </div>
                    <span className={`text-lg font-medium text-${option.color}-700`}>
                      {option.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 ml-12">
                    {option.description}
                  </p>
                </Label>
              </motion.div>
            );
          })}
        </RadioGroup>
      </motion.div>

      <motion.div 
        className="mt-4 flex items-center text-sm text-gray-500 gap-2 p-3 bg-gray-100 rounded-md"
        variants={itemVariants}
      >
        <Filter className="h-4 w-4" />
        <p>Changing the data source will reset any current selections</p>
      </motion.div>
    </motion.div>
  );
};

export default SourceSelection;