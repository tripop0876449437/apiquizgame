const { Sequelize } = require('sequelize');
require('dotenv').config();

// Debug Log: แสดง Database URL ที่ใช้งาน
console.log('Database URL:', process.env.DATABASE_URL);

// เชื่อมต่อกับฐานข้อมูล
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // ปิดการแสดง Query Logs (ถ้าไม่ต้องการเห็นใน Console)
});

// Debug Log: ทดสอบการเชื่อมต่อ
sequelize.authenticate()
  .then(() => console.log('Connected to the database successfully'))
  .catch((err) => console.error('Unable to connect to the database:', err));

// Sync ตาราง
sequelize.sync({ alter: true }) // อัปเดตตารางโดยไม่ลบข้อมูลเก่า
  .then(() => {
    console.log('All tables synced successfully'); // Debug Log: การซิงค์สำเร็จ
  })
  .catch((err) => {
    console.error('Error syncing tables:', err); // Debug Log: การซิงค์ล้มเหลว
  });

module.exports = sequelize;
