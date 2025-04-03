/**
 * Customer Routes
 * 
 * Handles all customer-related API endpoints.
 * Provides data for customer analytics and reporting.
 * 
 * Endpoints:
 * - GET /customer-type: Returns customer type distribution
 * - GET /customers: Returns all customers
 * - GET /customers/type/:type: Returns customers by type
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { CustomerType } from '../types';

const router = express.Router();

const readJsonData = (filename: string) => {
  const filePath = path.join(__dirname, '../data', filename);
  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
};

/**
 * GET /customer-type
 * Returns customer type distribution data
 */
router.get('/customer-type', (req, res) => {
  try {
    const data = readJsonData('Customer Type.json') as CustomerType[];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Customer Type data' });
  }
});

export default router; 