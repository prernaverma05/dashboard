# Analytics Dashboard

A full-stack dashboard application that provides insights into customer segmentation, revenue distribution, and team performance.

## Features

- Multi-dimensional data filtering and segmentation
- Interactive data visualizations using D3.js
- Customer type and industry analysis
- Revenue distribution insights
- Team performance tracking
- Drill-down capabilities for detailed analysis

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- REST API

### Frontend
- React
- Redux Toolkit
- TypeScript
- Material UI
- D3.js

## Project Structure

```
analytics-dashboard/
├── frontend/         # React frontend application
├── backend/          # Node.js + Express backend
└── package.json      # Root package.json for workspace management
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Start the development servers:
   ```bash
   # Start both frontend and backend
   npm run dev

   # Or start them separately:
   npm run start:backend
   npm run start:frontend
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## API Endpoints

- GET /api/customers - Fetch all customer data
- GET /api/industries - Fetch industry-wise segmentation
- GET /api/acv-ranges - Fetch revenue distribution data
- GET /api/teams - Fetch team performance

## Data Sources

The application uses the following JSON files for data:
- Team.json
- ACV Range.json
- Account Industry.json
- Customer Type.json 