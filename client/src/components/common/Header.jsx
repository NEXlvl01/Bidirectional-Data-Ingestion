import React from 'react';
import { Database, FileText } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-white/10 p-2 rounded-md">
            <Database className="h-6 w-6 mr-1" />
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">ClickHouse & Flat File Data Ingestion Tool</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;