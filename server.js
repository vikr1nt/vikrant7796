const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.static('public')); // Serve static HTML files

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // Change this to your database host
  user: 'root', // Change this to your database username
  password: '', // Change this to your database password
  database: 'shop_db', // Replace with your actual database name
});

// Check database connection
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});

// API route for user login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Query to check if the email and password match
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

  db.execute(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }

    if (results.length > 0) {
      // User found
      res.status(200).json({ message: 'Login successful' });
    } else {
      // Invalid credentials
      res.status(400).json({ error: 'Invalid email or password' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
