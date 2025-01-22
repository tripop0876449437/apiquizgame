require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// Configurations
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

// Middleware
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

// 1. Create Users Table (ถ้าตารางยังไม่มี)
(async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `;
    await pool.query(createTableQuery);
    console.log('Users table created or already exists.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
})();

// Routes
// 2. Register
app.post('/register', async (req, res) => {
  const { name, username, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const insertQuery = `
      INSERT INTO users (name, username, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, username;
    `;
    const values = [name, username, hashedPassword];

    const result = await pool.query(insertQuery, values);

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === '23505') {
      // Unique constraint violation
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'An unexpected error occurred', details: error.message });
  }
});

// 3. Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const findUserQuery = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(findUserQuery, [username]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get Users (Protected Route)
app.get('/users', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get all users (exclude passwords)
    const findAllUsersQuery = 'SELECT id, name, username FROM users';
    const result = await pool.query(findAllUsersQuery);

    res.json(result.rows);
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
});

app.get('/', async (req, res) => {
  res.status(200).json('Hello World' );
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
