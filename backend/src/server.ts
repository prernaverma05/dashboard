import express from 'express';
import cors from 'cors';
import acvRoutes from './routes/acv';
import customerRoutes from './routes/customers';
import teamRoutes from './routes/teams';

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', acvRoutes);
app.use('/api', customerRoutes);
app.use('/api', teamRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 