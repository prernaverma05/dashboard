import express from 'express';
import path from 'path';
import fs from 'fs';
import { ACVRange } from '../types';

const router = express.Router();

const readJsonData = (filename: string) => {
  const filePath = path.join(__dirname, '../data', filename);
  const rawData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(rawData);
};

router.get('/acv-range', (req, res) => {
  try {
    const data = readJsonData('ACV Range.json') as ACVRange[];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ACV Range data' });
  }
});

export default router; 