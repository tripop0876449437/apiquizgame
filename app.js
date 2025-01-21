require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./models');

// เริ่มต้นแอป
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));

// Start Server
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);

  // Sync ตาราง
  await sequelize.sync({ alter: true }); // สร้างหรืออัปเดตตาราง
  console.log('Database synced');
});
