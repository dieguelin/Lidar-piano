import express, { Request, Response, NextFunction } from 'express';
import { playnote, delay, PianoNotes } from './piano';
import cors from 'cors';
import helmet from 'helmet';

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
    message: 'Ready to play music!',
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

// Play note route
app.post('/playnote', async (req: Request, res: Response) => {
  try {
    console.log('Play note requested');
    
    const { note } = req.body;
    
    if (!note || typeof note !== 'string') {
      res.status(400).json({
        error: 'Invalid payload',
        message: 'Note parameter is required and must be a string'
      });
      return;
    }
    
    if (note === 'C') {
      await playnote(PianoNotes.C4);
      res.json({
        message: 'Piano note C played successfully',
        note: note,
        timestamp: new Date().toISOString()
      });
    } 
    else if (note === 'D') {
      await playnote(PianoNotes.D4);
      res.json({
        message: 'Piano note D played successfully',
        note: note,
        timestamp: new Date().toISOString()
      });
    }
    else if (note === 'E') {
      await playnote(PianoNotes.E4);
      res.json({
        message: 'Piano note E played successfully',
        note: note,
        timestamp: new Date().toISOString()
      });
    }
    else if (note === 'F') {
      await playnote(PianoNotes.F4);
      res.json({
        message: 'Piano note F played successfully',
        note: note,
        timestamp: new Date().toISOString()
      });
    }
    else if (note === 'G') {
      await playnote(PianoNotes.G4);
      res.json({
        message: 'Piano note G played successfully',
        note: note,
        timestamp: new Date().toISOString()
      });
    }
    else if (note === 'A') {
      await playnote(PianoNotes.A4);
      res.json({
        message: 'Piano note A played successfully',
        note: note,
        timestamp: new Date().toISOString()
      });
    }
    else if (note === 'B') {
      await playnote(PianoNotes.B4);
      res.json({
        message: 'Piano note B played successfully',
        note: note,
        timestamp: new Date().toISOString()
      });
    }
    else {
      res.json({
        message: 'Note received but not played',
        note: note,
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('Error playing note:', error);
    res.status(500).json({
      error: 'Failed to play note',
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