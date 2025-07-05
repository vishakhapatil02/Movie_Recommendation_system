const mysql = require('mysql2');  
const dotenv = require('dotenv');

dotenv.config();

const conn = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'movieapp'
});

conn.connect((err) => {
  if (err) {
    console.log("Database not connected ", err.message);
  } else {
    console.log("Database is connected");
  }
});
console.log(process.env.DB_NAME);
module.exports = conn;
