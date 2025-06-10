import express, { Request, Response, NextFunction } from 'express';
import { playnote, delay,PianoNotes } from './piano';
import cors from 'cors';
import helmet from 'helmet';

async function playSequence() {

    console.log('Starting piano sequence...');
    
    // Play A4
    playnote(PianoNotes.A4);
    // Wait 2 seconds
    await delay(200);
    // Play E4
    playnote(PianoNotes.E4);
    // Wait 1.5 seconds
    await delay(800);
    // Play Middle C
    playnote(PianoNotes.C4);
    
    console.log('Sequence complete!');
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Basic routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello World!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Play sequence route
app.get('/play', async (req: Request, res: Response) => {
    try {
      console.log('Play sequence requested');
      await playSequence();
      res.json({
        message: 'Piano sequence played successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error playing sequence:', error);
      res.status(500).json({
        error: 'Failed to play sequence',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

// Error handling middleware (but not for 404s yet)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler - MUST be last
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;