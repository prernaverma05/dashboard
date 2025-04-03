/**
 * ACV Range Routes
 * 
 * Handles all ACV (Annual Contract Value) range related endpoints.
 * Provides data for ACV range analytics and reporting.
 * 
 * Features:
 * - JSON data reading from local files
 * - Error handling for file operations
 * - Typed responses using TypeScript interfaces
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { ACVRange } from '../types';

const router = express.Router();

/**
 * Utility function to read JSON data from files
 * @param filename - Name of the JSON file to read
 * @returns Parsed JSON data
 */
const readJsonData = (filename: string) => {
  const filePath = path.join(__dirname, '../data', filename);
  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
};

/**
 * GET /acv-range
 * Returns ACV range distribution data
 */
router.get('/acv-range', (req, res) => {
  try {
    const data = readJsonData('ACV Range.json') as ACVRange[];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ACV Range data' });
  }
});

export default router; 