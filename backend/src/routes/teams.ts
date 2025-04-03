import express from 'express';
import path from 'path';
import fs from 'fs';
import { Team, Industry } from '../types';

const router = express.Router();

const readJsonData = (filename: string) => {
  const filePath = path.join(__dirname, '../data', filename);
  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
};

router.get('/teams', (req, res) => {
  try {
    const data = readJsonData('Team.json') as Team[];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Team data' });
  }
});

router.get('/industries', (req, res) => {
  try {
    const data = readJsonData('Account Industry.json') as Industry[];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Industry data' });
  }
});

export default router; 