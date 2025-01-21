const express = require('express');
const User = require('../models/user');

const router = express.Router();

// API: ดึงข้อมูลผู้ใช้
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // ไม่ส่งรหัสผ่านใน Response
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
