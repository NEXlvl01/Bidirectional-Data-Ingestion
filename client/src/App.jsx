import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { IngestionProvider } from './contexts/IngestionContext';
import Layout from './components/common/Layout';
import DataIngestionTool from './components/DataIngestionTool';

function App() {
  return (
    <ThemeProvider>
      <IngestionProvider>
        <Layout>
          <DataIngestionTool />
        </Layout>
      </IngestionProvider>
    </ThemeProvider>
  );
}

export default App;