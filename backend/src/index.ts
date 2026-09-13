import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import meRoutes from './routes/me';
import taskRoutes from './routes/tasks';
import shopRoutes from './routes/shop';
import aiRoutes from './routes/ai';

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://life-rpg-theta-five.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl) or allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, can restrict in production
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Support both /api/* and root routes for client flexibility
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/me', meRoutes);
app.use('/me', meRoutes);

app.use('/api/tasks', taskRoutes);
app.use('/tasks', taskRoutes);

app.use('/api/shop', shopRoutes);
app.use('/shop', shopRoutes);

app.use('/api/ai', aiRoutes);
app.use('/ai', aiRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Life RPG API is running!',
    status: 'online',
    healthCheck: '/health',
    endpoints: ['/api/auth', '/api/tasks', '/api/me', '/api/shop', '/api/ai'],
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Life RPG API',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Life RPG API',
    timestamp: new Date().toISOString(),
  });
});

// Centralized error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`Life RPG API server running on port ${port}`);
});

export default app;
