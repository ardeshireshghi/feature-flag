const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const app = express();
const apiRouter = require('./routes/api');

app.use(bodyParser.json());
app.use('/', apiRouter);

app.listen(PORT, () => {
  console.log(`Live on port: ${PORT}!`);
});
