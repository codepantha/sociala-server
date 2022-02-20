const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await new User({ username, email, password: hashedPassword })
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }

});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    !user && res.status(400).json('Sorry, user does not exist!');

    const correctPassword = await bcrypt.compare(password, user.password);
    !correctPassword && res.status(400).json('Incorrect password');

    // if login successful
    // return the user without password and updatedAt
    delete user._doc.password
    delete user._doc.updatedAt

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;