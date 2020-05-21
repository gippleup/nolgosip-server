const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const router = require('./router');
const config = require('./config');
const db = require('./model/index');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({
  origin: ['http://localhost:5000'],
  credentials: true,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.db = db;
  next();
});

app.use(session(config.session));

app.use('/', router);


app.listen(PORT, () => {
  console.log(`app started listening from PORT ${PORT}`);
});
