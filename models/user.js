const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // เชื่อมต่อกับฐานข้อมูล

// กำหนด Model User
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false, // ไม่อนุญาตให้เป็น null
  },
  username: {
    type: DataTypes.STRING,
    unique: true, // username ต้องไม่ซ้ำ
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // เปิดใช้งาน createdAt และ updatedAt
});

module.exports = User;
