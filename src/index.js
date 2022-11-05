require('dotenv').config();
const express = require("express");

const authorize = require('./middleware/auth.js');
const qaRoutes = require('./routes/qaRoutes');

const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;

console.log(new Date());

const app = express();
app.use(express.json());
app.use(authorize);
app.use('/qa', qaRoutes);


app.listen(PORT);
console.log(`Listening at ${BASE_URL}:${PORT}`);

module.exports = app;