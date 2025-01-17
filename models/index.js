const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true, // บังคับใช้ SSL
      rejectUnauthorized: false, // อนุญาตใบรับรองที่ไม่ได้ลงทะเบียน
    },
  },
  logging: false, // ปิด Log ถ้าต้องการ
});

module.exports = sequelize;
