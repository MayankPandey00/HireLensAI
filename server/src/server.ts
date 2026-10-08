import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HireLens AI Backend',
    timestamp: new Date().toISOString(),
  });
});

// Mount API router
app.use('/api', apiRoutes);

// Serve static frontend build assets (for single deployment)
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// For SPA routing, serve index.html for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

function startServer(port: number, attempts = 0) {
  const server = app.listen(port, HOST, () => {
    console.log(`🚀 HireLens AI Server listening on http://localhost:${port}`);
    console.log(`🔍 Health check: http://localhost:${port}/api/health`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      if (attempts < 5) {
        console.warn(`⚠️ Port ${port} is busy or in TIME_WAIT. Retrying in 1 second... (Attempt ${attempts + 1}/5)`);
        setTimeout(() => startServer(port, attempts + 1), 1000);
      } else {
        console.error(`❌ Port ${port} is permanently in use by another process. Please stop the process using port ${port}.`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
    }
  });

  // Graceful shutdown on reload/stop
  const shutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };

  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}

startServer(PORT);
