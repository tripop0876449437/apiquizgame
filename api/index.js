const app = require('../app'); // นำเข้า Express App

module.exports = (req, res) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  app(req, res); // ส่ง Express App ให้กับ Serverless Function
};
