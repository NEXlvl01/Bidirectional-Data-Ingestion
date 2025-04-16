import React, { useState } from 'react';
import { useIngestion } from '../../contexts/IngestionContext';
import { api } from '../../lib/api';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

const IngestClickHouseToFile = () => {
    const {
        clickHouseParams,
        selectedColumns,
        selectedTable,
        setStatus,
        setError,
        setResultData
    } = useIngestion();

    const [outputFilename, setOutputFilename] = useState('export.csv');
    const [delimiter, setDelimiter] = useState(',');

    const handleStartIngestion = async () => {
        try {
            setStatus('ingesting');
            setError(null);

            const result = await api.ingestion.clickhouseToFlatFile({
                ...clickHouseParams,
                table: selectedTable,
                columns: selectedColumns,
                outputFilename,
                delimiter
            });

            if (result.success) {
                setResultData(result.data);
                setStatus('completed');
            } else {
                throw new Error(result.message || 'Ingestion failed');
            }
        } catch (error) {
            console.error('Ingestion error:', error);
            setStatus('error');
            setError(error.message);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="output-filename">Output Filename</Label>
                <Input
                    id="output-filename"
                    value={outputFilename}
                    onChange={(e) => setOutputFilename(e.target.value)}
                    placeholder="export.csv"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="output-delimiter">Output Delimiter</Label>
                <Input
                    id="output-delimiter"
                    value={delimiter}
                    onChange={(e) => setDelimiter(e.target.value)}
                    placeholder=","
                />
            </div>

            <Button
                onClick={handleStartIngestion}
                className="w-full"
                disabled={selectedColumns.length === 0}
            >
                Start Ingestion
            </Button>

            <div className="text-sm text-muted-foreground">
                <p>This will export data from ClickHouse to a flat file with the selected columns.</p>
            </div>
        </div>
    );
};

export default IngestClickHouseToFile;