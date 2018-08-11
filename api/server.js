const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    { id: 1, name: 'john', email: 'john@gmail.com', password: 'cookies', entries: 0, joined: new Date() },
    { id: 2, name: 'sasha', email: 'sasha@gmail.com', password: 'cookies', entries: 2, joined: new Date() },
  ]
};

const findUser = (id) => database.users.find(user => user.id === parseInt(id));

app.get('/', (req, res) => {
  res.json(database.users);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  const foundUser = findUser(id);
  if (foundUser) {
    res.json(foundUser);
  } else {
    res.status(404).json('user not found');
  }
})

app.post('/signin', (req, res) => {
  bcrypt.compare('cookies', '$2a$10$JLqzE.hvNi4faI.4sTTR6OF5N8kK7gGTQyCgCQMys5mRo8YQjdXNq', (err, result) => {
    console.log(result);
  })

  if (req.body.email === database.users[1].email && req.body.password === database.users[1].password) {
    res.json('success');
  } else {
    res.status(400).json('error logging in');
  }
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, (err, hash) => {
    console.log(hash);
  })
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  const foundUser = findUser(id);
  if (foundUser) {
    foundUser.entries++;
    return res.json(foundUser.entries);
  } else {
    res.status(404).json('user not found');
  }

})

app.listen(5000, () => {
  console.log('Listening on port 5000...');
})