const { Client } = require('pg');

async function createDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
  });

  try {
    await client.connect();
    console.log('Connected to postgres db');




    await client.query('CREATE DATABASE cms_db;');
    console.log('Database cms_db created successfully.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

createDatabase();
