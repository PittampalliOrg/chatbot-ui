const { Client } = require('pg')

const client = new Client({
  host: '172.19.0.4',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'your_postgres_password' // Replace with your actual password
})

async function testConnection() {
  try {
    await client.connect()
    const result = await client.query('SELECT NOW()')
    console.log('Connection successful. Current time:', result.rows[0].now)
  } catch (err) {
    console.error('Connection error', err.stack)
  } finally {
    await client.end()
  }
}

testConnection()
