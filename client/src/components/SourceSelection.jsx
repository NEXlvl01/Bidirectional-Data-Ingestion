import React from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { useIngestion } from '../contexts/IngestionContext';

const SourceSelection = () => {
  const { source, setSource, resetForm } = useIngestion();
  
  const handleSourceChange = (value) => {
    // Reset form when changing source
    resetForm();
    setSource(value);
  };
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-2">Select Data Source</h2>
      <RadioGroup
        value={source}
        onValueChange={handleSourceChange}
        className="flex space-x-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="clickhouse" id="clickhouse" />
          <Label htmlFor="clickhouse">ClickHouse</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="flatfile" id="flatfile" />
          <Label htmlFor="flatfile">Flat File</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SourceSelection;