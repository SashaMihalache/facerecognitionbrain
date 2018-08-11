const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }

  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx.insert({
      hash,
      email
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name,
            joined: new Date()
          })
          .then(result => {
            res.json(result[0]);
          })

      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
    .catch(err => {
      res.status(400).json('Error registering user');
    })
};

const handleSignin = (req, res, db, bcrypt) => {
  const { password, email } = req.body;

  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isMatching = bcrypt.compareSync(password, data[0].hash);
      if (isMatching) {
        return db.select('*')
          .from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
  handleRegister,
  handleSignin
}