require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./models');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const authenticateToken = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Route ตัวอย่าง
app.get('/', (req, res) => {
  res.send('Welcome to the QuizGame API!');
});

// Routes
app.use('/auth', authRoutes);
app.use('/users', authenticateToken, userRoutes);

// Start Server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await sequelize.authenticate();
  console.log('Database connected');
});
