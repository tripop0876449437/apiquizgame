const app = require('../app'); // นำเข้า Express App

module.exports = (req, res) => {
  app(req, res); // ส่ง Express App ให้กับ Serverless Environment
};
