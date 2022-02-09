const router = require('express').Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({ username, email, password })

  try {
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err)
  }
  
});

module.exports = router;