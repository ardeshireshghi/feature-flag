const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const app = express();
const apiRouter = require('./routes/api');

app.use(bodyParser.json());
app.use('/', apiRouter);

const startApp = () =>
  app.listen(PORT, () => {
    console.log(`Auth service started on port: ${PORT}!`);
  });

exports.getApp = () => {
  return app;
};

if (require.main === module) {
  startApp();
}
