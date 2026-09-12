import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Life RPG API is running!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
