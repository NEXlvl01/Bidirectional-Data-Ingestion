import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-4">
        <p className="text-center text-sm text-gray-600">
          Bidirectional ClickHouse & Flat File Data Ingestion Tool &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;