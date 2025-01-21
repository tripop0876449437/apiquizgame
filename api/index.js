try {
  require('pg'); // ลองโหลด pg
  console.log('pg module loaded successfully');
} catch (err) {
  console.error('Error loading pg module:', err);
}

const serverless = require('serverless-http');
const app = require('../app');

module.exports = serverless(app);
