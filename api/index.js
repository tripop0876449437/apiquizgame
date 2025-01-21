require('pg'); // บังคับให้โหลดไลบรารี pg
const serverless = require('serverless-http');
const app = require('../app');

module.exports = serverless(app);
