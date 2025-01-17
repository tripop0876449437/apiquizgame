require('dotenv').config();
const express = require('express');
const sequelize = require('./models');
const User = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route ตัวอย่าง
app.get('/', (req, res) => {
  res.send('Welcome to the QuizGame API!');
});

// Sync Database
sequelize.sync().then(() => {
  console.log('Database connected');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
