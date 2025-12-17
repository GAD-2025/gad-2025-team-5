
const express = require('express');
const path = require('path'); // Add path module
const cors = require('cors');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const booksRoutes = require('./routes/books');
const likesRoutes = require('./routes/likes');

const app = express();
const port = process.env.PORT || 3001;

// CORS options
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow both frontend and backend origins
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200 // For legacy browser support
};


// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // for parsing application/json
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public directory


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

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
