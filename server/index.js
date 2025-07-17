const express = require('express');
const cors = require('cors');
const connectToMongo = require('./db');
const app = express();
const path = require('path');

// Set view engine and static files
app.set('view engine', 'ejs');
app.use(express.static('public'));

const PORT = process.env.PORT || 8181;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectToMongo();

// Routes
app.use('/api/auth', require('./routes/auth'));

// Serve static files from the build folder (for production)
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route for client-side routing (for production)
app.get('*', (req, res) => {
  // Check if build folder exists and serve React app
  try {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  } catch (error) {
    // Fallback for development
    res.send('Hello World! Server is running.');
  }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});