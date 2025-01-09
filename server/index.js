import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { eventsRouter } from './routes/events.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get directory name for ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables before creating the app
dotenv.config();

if (!process.env.EVENTBRITE_API_KEY) {
  console.error('EVENTBRITE_API_KEY is required');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// API Routes
app.use('/api/events', eventsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve static files from the dist directory
app.use(express.static(join(__dirname, '../dist')));

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  // Handle Eventbrite API errors
  if (err.response?.data) {
    return res.status(err.response.status || 500).json({
      error: 'Eventbrite API Error',
      message: err.response.data.error_description || err.message
    });
  }
  
  // Handle other errors
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});