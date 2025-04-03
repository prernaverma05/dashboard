/**
 * Team and Industry Routes
 * 
 * Handles endpoints related to team performance and industry distribution.
 * Provides data for team analytics and industry insights.
 * 
 * Features:
 * - Combined team and industry data endpoints
 * - JSON file data source
 * - Error handling and type safety
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { Team, Industry } from '../types';

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
 * GET /teams
 * Returns team performance data
 */
router.get('/teams', (req, res) => {
  try {
    const data = readJsonData('Team.json') as Team[];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Team data' });
  }
});

/**
 * GET /industries
 * Returns industry distribution data
 */
router.get('/industries', (req, res) => {
  try {
    const data = readJsonData('Account Industry.json') as Industry[];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Industry data' });
  }
});

export default router; 