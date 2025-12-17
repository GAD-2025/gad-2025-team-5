
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const booksRoutes = require('./routes/books');
const likesRoutes = require('./routes/likes');

const app = express();
const port = process.env.PORT || 3001;

// CORS options
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://route.nois.club:3005',
  'https://route.nois.club',
  'http://bookdam.shop',
  'https://bookdam.shop'
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log(`[CORS] Request Origin: ${origin}`);
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('[CORS] Origin is null, allowing request.');
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      console.error(`[CORS] Blocking request from origin: ${origin}`);
      return callback(new Error(msg), false);
    }
    console.log(`[CORS] Allowing request from origin: ${origin}`);
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};


// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // for parsing application/json

// Pre-flight OPTIONS handler for all routes
app.options('*', cors(corsOptions)); // This ensures all OPTIONS requests are handled by CORS

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/likes', likesRoutes);

// Health check endpoint to test DB connection
app.get('/api/health-check', async (req, res) => {
    try {
        console.log('[Health Check] Attempting to get a DB connection...');
        const pool = require('./db'); // Make sure we have the pool
        const connection = await pool.getConnection();
        console.log('[Health Check] DB connection successful!');
        connection.release();
        res.status(200).json({ status: 'ok', message: 'Database connection successful.' });
    } catch (error) {
        console.error('[Health Check] DB connection failed:', error);
        res.status(500).json({ status: 'error', message: 'Database connection failed.', error: error.message });
    }
});

// A simple test route
app.get('/', (req, res) => {
  res.send('Bookdam backend server is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('An error occurred:');
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'An internal server error occurred.',
    error: err.message
  });
});


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  console.log(`Backend server running on http://localhost:${port}`);
});
