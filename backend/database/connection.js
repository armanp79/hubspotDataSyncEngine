const { Pool } = require('pg')

const pool = new Pool({
  user: 'armanp79',
  host: '127.0.0.1',
  database: 'livedocs',
  port: 5432,
})

module.exports = pool;