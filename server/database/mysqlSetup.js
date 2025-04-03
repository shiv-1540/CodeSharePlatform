// db.js
const mysql = require('mysql2');
require('dotenv').config();

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',     
  user: 'shiv',           
  password: '4102',   
  database: 'file_storage_database',
});

// Connect to the MySQL server
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }
  console.log('Connected to the MySQL database');
});

module.exports = connection;