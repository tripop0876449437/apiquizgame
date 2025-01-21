const serverless = require('serverless-http');
const app = require('../app'); // นำเข้า Express App

module.exports = serverless(app);
