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

router.get('/customer-type', (req, res) => {
  try {
    const data = readJsonData('Customer Type.json') as CustomerType[];
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Customer Type data' });
  }
});

export default router; 