import React from 'react';
import { Database, FileText, ArrowLeftRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center bg-white/20 p-2 rounded-lg shadow-inner">
            <Database className="h-6 w-6 mr-1" />
            <ArrowLeftRight className="h-5 w-5 mx-1 text-blue-200" />
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold">ClickHouse & Flat File Data Ingestion</h1>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;