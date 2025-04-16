import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useIngestion } from '../../contexts/IngestionContext';
import { api } from '../../lib/api';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { FileDown, Database, ArrowRight, FileType } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

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

    const formItemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
        >
            <motion.div 
                className="flex items-center justify-center p-4 bg-orange-50 border border-orange-100 rounded-lg mb-2"
                variants={formItemVariants}
            >
                <Database className="h-5 w-5 text-orange-600 mr-2" />
                <ArrowRight className="h-4 w-4 text-orange-500 mx-2" />
                <FileDown className="h-5 w-5 text-orange-600" />
                <span className="ml-2 text-orange-800 font-medium">ClickHouse to File Export</span>
            </motion.div>

            <motion.div variants={formItemVariants}>
                <Card className="border-orange-100 bg-orange-50/30">
                    <CardContent className="p-4">
                        <div className="text-sm text-orange-700 flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                            <span className="font-medium flex items-center">
                                <Database className="h-4 w-4 mr-1" /> Source:
                            </span>
                            <span>{clickHouseParams.host}:{clickHouseParams.port}/{clickHouseParams.database}/{selectedTable}</span>
                        </div>
                        <div className="text-sm text-orange-700">
                            <span className="font-medium">Columns:</span>{' '}
                            <span className="italic">{selectedColumns.length} columns selected</span>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div className="space-y-2" variants={formItemVariants}>
                <Label htmlFor="output-filename" className="flex items-center gap-2">
                    <FileType className="h-4 w-4 text-orange-600" />
                    Output Filename
                </Label>
                <Input
                    id="output-filename"
                    value={outputFilename}
                    onChange={(e) => setOutputFilename(e.target.value)}
                    placeholder="export.csv"
                    className="border-orange-200 focus:border-orange-400"
                />
            </motion.div>

            <motion.div className="space-y-2" variants={formItemVariants}>
                <Label htmlFor="output-delimiter" className="flex items-center gap-2">
                    <span className="text-orange-600 font-mono text-sm font-bold">| |</span>
                    Output Delimiter
                </Label>
                <Input
                    id="output-delimiter"
                    value={delimiter}
                    onChange={(e) => setDelimiter(e.target.value)}
                    placeholder=","
                    className="border-orange-200 focus:border-orange-400"
                />
            </motion.div>

            <motion.div variants={formItemVariants}>
                <Button
                    onClick={handleStartIngestion}
                    className="w-full bg-orange-600 hover:bg-orange-700 flex items-center justify-center gap-2"
                    disabled={selectedColumns.length === 0}
                >
                    <FileDown className="h-4 w-4" />
                    Start Export to File
                </Button>
            </motion.div>

            <motion.div 
                className="text-sm text-gray-600 bg-orange-50 p-3 rounded-md border border-orange-100"
                variants={formItemVariants}
            >
                <p>This will export data from ClickHouse to a flat file with the {selectedColumns.length} selected columns.</p>
            </motion.div>
        </motion.div>
    );
};

export default IngestClickHouseToFile;