const bcrypt = require('bcryptjs');
const { findUserByUsername, createUser } = require('../models/userModel');

// ฟังก์ชันสำหรับลงทะเบียน
async function registerUser(req, res) {
  const { name, username, password } = req.body;

  // ตรวจสอบว่าข้อมูลครบถ้วน
  if (!name || !username || !password) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  try {
    // ตรวจสอบว่า username ซ้ำหรือไม่
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const newUser = await createUser(name, username, hashedPassword);

    res.status(201).json({
      message: 'ลงทะเบียนสำเร็จ',
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        created_at: newUser.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
  }
}

module.exports = { registerUser };
