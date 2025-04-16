import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-inner">
      <motion.div 
        className="container mx-auto px-4 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="text-center text-sm text-gray-600">
          Bidirectional ClickHouse & Flat File Data Ingestion Tool &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;