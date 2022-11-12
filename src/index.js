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

const app2 = express();
app2.use(express.json());
app2.use(authorize);
app2.use('/qa', qaRoutes);

const app3 = express();
app3.use(express.json());
app3.use(authorize);
app3.use('/qa', qaRoutes);


app.listen(PORT);
console.log(`Server 1 listening at ${BASE_URL}:${PORT}`);

app2.listen(Number(PORT) + 1);
console.log(`Server 2 listening at ${BASE_URL}:${Number(PORT) + 1}`);

app3.listen(Number(PORT) + 2);
console.log(`Server 3 listening at ${BASE_URL}:${Number(PORT) + 2}`);

module.exports = app;