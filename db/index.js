require('dotenv').config();
const { Pool } = require('pg');

// Connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

module.exports = {
  async query (text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  },

  async getClient() {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;

    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 5 seconds!');
      console.error(`The last executed query on the client was: ${client.lastQuery}`);
    }, 5000);

    client.query = (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    }

    client.release = () => {
      clearTimeout(timeout);

      client.query = query;
      client.release = release;
      return relase.apply(client);
    }
    return client;
  }
}