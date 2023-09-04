const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const multer = require('multer');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use('/api', routes);

const port = process.env.PORT || 3001;
const hostname = '127.0.0.1';
app.listen(port, hostname, () => {
  console.log(`Server is running on port ${port}`);
});

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  const selectUserQuery = 'SELECT * FROM users WHERE username = ?';

  db.query(selectUserQuery, [username], (selectErr, results) => {
    if (selectErr) {
      console.error('Error selecting user:', selectErr);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];
    console.log(user);

    bcrypt.compare(password, user.password, (compareErr, isMatch) => {
      if (compareErr || !isMatch) {
        console.log('Authentication failed');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log('Authentication successful');
      return res.status(200).json({ message: 'Login successful' });
    });
  });
});

app.post('/api/users', (req, res) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10, (hashErr, hash) => {
    if (hashErr) {
      console.error('Error hashing password:', hashErr);
      return res.status(500).json({ message: 'Internal server error' });
    }

    const insertQuery =
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

    db.query(insertQuery, [username, email, hash], (err, result) => {
      if (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      return res.status(201).json({ message: 'User created successfully' });
    });
  });
});

app.get('/api/users', (req, res) => {
  const selectQuery = 'SELECT * FROM users';

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.status(200).json(results);
  });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const deleteQuery = 'DELETE FROM users WHERE id=?';

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  });
});

app.post('/api/employees', upload.single('photo'), (req, res) => {
  const { name, position } = req.body;
  const photoPath = req.file ? req.file.path : '';

  const insertQuery =
    'INSERT INTO employees (name, position, photo_path) VALUES (?, ?, ?)';

  db.query(insertQuery, [name, position, photoPath], (err, result) => {
    if (err) {
      console.error('Error creating employee:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.status(201).json({ message: 'Employee created successfully' });
  });
});

app.get('/api/employees', (req, res) => {
  const selectQuery = 'SELECT * FROM employees';

  db.query(selectQuery, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.status(200).json(results);
  });
});

app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const deleteQuery = 'DELETE FROM employees WHERE id=?';

  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error deleting employee:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.status(200).json({ message: 'Employee deleted successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
