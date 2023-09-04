// index.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const multer = require('multer');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());

app.use('/api', routes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
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

// API route to create a user
app.post('/api/users', (req, res) => {
  const { username, email, password } = req.body;

  const insertQuery =
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

  db.query(insertQuery, [username, email, password], (err, result) => {
    if (err) {
      console.error('Error creating user:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.status(201).json({ message: 'User created successfully' });
  });
});

// API route to get all users
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

// API route to update a user
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  const updateQuery =
    'UPDATE users SET username=?, email=?, password=? WHERE id=?';

  db.query(updateQuery, [username, email, password, id], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.status(200).json({ message: 'User updated successfully' });
  });
});

// API route to delete a user
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

// API route to create an employee
app.post('/api/employees', upload.single('photo'), (req, res) => {
  const { name, position } = req.body;
  const photoPath = req.file ? req.file.path : ''; // Get the uploaded file path

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

// API route to get all employees
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

// API route to update an employee
app.put('/api/employees/:id', upload.single('photo'), (req, res) => {
  const { id } = req.params;
  const { name, position } = req.body;
  const photoPath = req.file ? req.file.path : ''; // Get the uploaded file path

  const updateQuery =
    'UPDATE employees SET name=?, position=?, photo_path=? WHERE id=?';

  db.query(updateQuery, [name, position, photoPath, id], (err, result) => {
    if (err) {
      console.error('Error updating employee:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    return res.status(200).json({ message: 'Employee updated successfully' });
  });
});

// API route to delete an employee
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
