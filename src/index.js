require('dotenv').config();
const express = require("express");
const qaRoutes = require('./qaRoutes');
const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;

console.log(new Date(Number('1618931727704')));

const app = express();
app.use('/qa', qaRoutes);


app.listen(PORT);
console.log(`Listening at ${BASE_URL}:${PORT}`);