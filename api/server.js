const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: '',
    password: '',
    database: 'smartbrain'
  }
});

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json(database.users);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('Could not sign in user')
      }
    })
    .catch(err => res.status(400).json('Error getting the user'));
});

app.post('/signin', (req, res) => {
  // bcrypt.compare('cookies', '$2a$10$JLqzE.hvNi4faI.4sTTR6OF5N8kK7gGTQyCgCQMys5mRo8YQjdXNq', (err, result) => {
  //   console.log(result);
  // })
  const { email, password } = req.body;
  const foundUserIndex = database.users.findIndex(user => user.email === email && user.password === password)

  if (foundUserIndex > -1) {
    res.json(database.users[foundUserIndex]);
  } else {
    res.status(400).json('error logging in');
  }
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  db('users')
    .returning('*')
    .insert({
      email,
      name,
      joined: new Date()
    })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(400).json('Error registering user');
    })
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => req.status(400).json('unable to get entries'))
})

app.listen(5000, () => {
  console.log('Listening on port 5000...');
})