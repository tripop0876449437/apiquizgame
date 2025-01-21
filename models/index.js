const { Sequelize } = require('sequelize');
require('dotenv').config();

// เชื่อมต่อกับฐานข้อมูล
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Sync ตาราง
sequelize.sync({ alter: true }) // สร้างหรืออัปเดตตาราง (ไม่ลบข้อมูลเก่า)
  .then(() => {
    console.log('All tables synced successfully');
  })
  .catch((err) => {
    console.error('Error syncing tables:', err);
  });

module.exports = sequelize;
