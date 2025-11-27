require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

// A simple test route
app.get('/', (req, res) => {
  res.send('Bookdam backend server is running!');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
