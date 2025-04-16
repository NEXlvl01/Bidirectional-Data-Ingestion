# Bidirectional Data Ingestion Tool

A web-based application that enables seamless data transfer between ClickHouse databases and flat files. This tool supports bidirectional data flow, allowing users to move data from ClickHouse to flat files and vice versa with column selection capabilities and detailed processing reports.

## Features

- **Bidirectional Data Flow**: Transfer data in both directions (ClickHouse ↔ Flat File)
- **Flexible Source/Target Selection**: Choose which system serves as the data source or target
- **Column Selection**: Select specific columns for data transfer rather than entire datasets
- **JWT Authentication**: Secure connection to ClickHouse using JWT token-based authentication
- **Schema Discovery**: Automatically discover and present available tables and columns
- **Processing Reports**: View the total count of records processed upon completion
- **Error Handling**: User-friendly error messages for connection, authentication, and query issues
- **Data Preview**: Preview data before starting the full ingestion process

## Tech Stack

- **Frontend**: React with Vite
- **Backend**: Node.js
- **Database**: ClickHouse
- **Authentication**: JWT tokens

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 16.x or higher)
- npm (version 8.x or higher) or yarn
- Git
- ClickHouse (local installation or access to a remote instance)
- Web browser (Chrome, Firefox, Safari, or Edge)

## Installation

### Clone the Repository

```bash
git clone https://github.com/NEXlvl01/Bidirectional-Data-Ingestion.git
cd Bidirectional-Data-Ingestion
```

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with necessary configuration:
   ```
   PORT=5000
   CLICKHOUSE_HOST= [Your Host]
   CLICKHOUSE_PORT= [Your Port]
   CLICKHOUSE_DB=default
   CLICKHOUSE_USER=default
   CLICKHOUSE_PASSWORD= [Your Password]
   JWT_SECRET= [Your Secret]
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Start the Backend Server

1. In the backend directory:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

### Start the Frontend Development Server

1. In the frontend directory:

   ```bash
   npm run dev
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:5173
   ```

## Usage Guide

### ClickHouse to Flat File Transfer

1. On the main page, select "ClickHouse" as the source and "Flat File" as the target.
2. Enter ClickHouse connection details:
   - Host (e.g., localhost)
   - Port (e.g., 9000 for HTTP, 8443 for HTTPS)
   - Database name
   - Username
   - JWT Token (if required)
3. Click "Connect" to establish a connection to the ClickHouse database.
4. Select the table you wish to export data from.
5. Choose specific columns to include in the export (or select all).
6. Specify the output flat file details:
   - File name/path
   - Delimiter (e.g., comma, tab)
7. Click "Preview" (optional) to see the first 100 records before proceeding.
8. Click "Start Ingestion" to begin the data transfer process.
9. Upon completion, the application will display the total number of records processed.

### Flat File to ClickHouse Transfer

1. On the main page, select "Flat File" as the source and "ClickHouse" as the target.
2. Specify the input flat file details:
   - File name/path
   - Delimiter (e.g., comma, tab)
3. Click "Load Columns" to analyze the flat file and display its schema.
4. Select specific columns to include in the import (or select all).
5. Enter ClickHouse connection details:
   - Host (e.g., localhost)
   - Port (e.g., 9000 for HTTP, 8443 for HTTPS)
   - Database name
   - Username
   - JWT Token (if required)
6. Specify the target table name (existing or new).
7. Click "Preview" (optional) to see the first 100 records before proceeding.
8. Click "Start Ingestion" to begin the data transfer process.
9. Upon completion, the application will display the total number of records processed.



## Project Structure

```
Bidirectional-Data-Ingestion/
├── frontend/                  # React Vite frontend
│   ├── src/                   # Source files
│   │   ├── components/        # UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── public/                # Static assets
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
│
├── backend/                   # Node.js backend
│   ├── controllers/           # Route controllers
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── utils/                 # Utility functions
│   ├── server.js              # Server entry point
│   └── package.json           # Backend dependencies
│
└── README.md                  # Project documentation
```

## API Endpoints

The backend provides the following API endpoints:

### ClickHouse Operations

- `POST /api/clickhouse/connect` - Test connection to ClickHouse
- `GET /api/clickhouse/tables` - Get list of tables in the database
- `POST /api/clickhouse/columns` - Get columns for a specific table
- `POST /api/clickhouse/preview` - Preview data from selected table(s)
- `POST /api/clickhouse/export` - Export data to a flat file

### Flat File Operations

- `POST /api/flatfile/upload` - Upload a flat file
- `POST /api/flatfile/analyze` - Analyze and extract schema from flat file
- `POST /api/flatfile/preview` - Preview data from flat file
- `POST /api/flatfile/import` - Import data from flat file to ClickHouse

## Error Handling

The application includes comprehensive error handling for common issues:

- Connection failures
- Authentication errors
- Schema discovery problems
- Data type mismatches
- File access permission issues

Error messages are displayed in the UI with suggestions for resolution.

## Troubleshooting

### Common Issues

1. **ClickHouse Connection Errors**:

   - Verify host and port are correct
   - Ensure JWT token is valid
   - Check network connectivity

2. **File Upload Issues**:

   - Check if the file format is supported (CSV, TSV, etc.)
   - Ensure file size is within limits
   - Verify file encoding (UTF-8 recommended)

3. **Data Type Mismatches**:

   - When transferring from flat files to ClickHouse, ensure data types are compatible
   - Use the preview feature to validate data before full ingestion

4. **Server Not Starting**:
   - Check if ports are already in use
   - Verify Node.js version compatibility
   - Ensure all dependencies are installed correctly

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- ClickHouse for providing example datasets
- React and Node.js communities for their excellent libraries and tools
