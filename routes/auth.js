const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// API: ลงทะเบียน (Register)
router.post('/register', async (req, res) => {
  const { name, username, password } = req.body;

  try {
    // แฮชรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
    });

    // ส่งข้อความตอบกลับเมื่อสำเร็จ
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
      },
    });
  } catch (error) {
    // ตรวจสอบ Unique Constraint Error
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: 'Username already exists', // ข้อความแจ้งเตือน
      });
    }

    // ข้อผิดพลาดอื่น ๆ
    res.status(500).json({
      error: 'An unexpected error occurred',
      details: error.message,
    });
  }
});

// API: เข้าสู่ระบบ (Login)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
