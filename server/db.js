const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '5d22176948c292ce3735df4863a7562f098cbeba82d90ba3f774463bf087a7c4',
  database: 'admindb',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
    createDatabaseAndTables();
  }
});

function createDatabaseAndTables() {
  db.query('CREATE DATABASE IF NOT EXISTS admindb', (err) => {
    if (err) {
      console.error('Error creating database:', err);
    } else {
      console.log('Database created (or already exists)');
      db.query('USE admindb', (useDbErr) => {
        if (useDbErr) {
          console.error('Error selecting database:', useDbErr);
        } else {
          createTables();
        }
      });
    }
  });
}

function createTables() {
  const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
  );
    `;

  const createEmployeesTable = `
  CREATE TABLE IF NOT EXISTS employees (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    photo_path VARCHAR(255),
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
  )
    `;

  db.query(createUsersTable, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table created (or already exists)');
    }
  });

  db.query(createEmployeesTable, (err) => {
    if (err) {
      console.error('Error creating employees table:', err);
    } else {
      console.log('Employees table created (or already exists)');
    }
  });
}

module.exports = db;
