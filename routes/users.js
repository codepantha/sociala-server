const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// update user
router.put('/:id', async (req, res) => {
  // if the ids don't match, it's not the same user
  if (req.params.id !== req.body.userId || req.body.isAdmin)
    res.status(403).json('You can only update your account');

  // if the user supplied the password, encrypt it
  if (req.body.password) {
    try {
      const saltRounds = 10;
      req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    } catch (err) {
      res.status(500).json('An error occured.');
    }
  }

  // update the user with the details submitted
  try {
    const user = await User.findByIdAndUpdate(req.body.userId, {
      $set: req.body,
    });
    res.status(200).json('User updated successfully');
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a user
router.delete('/:id', async (req, res) => {
  if (req.params.id !== req.body.userId || req.body.isAdmin)
    res.status(403).json('You can only delete your account.');

  try {
    await User.findByIdAndDelete(req.body.userId);
    res.status(200).json('User record deleted.');
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a user
router.get('/:id', async (req, res) => {
  try {
    // get the user details minus the password and updatedAt fields
    const user = await User.findById(req.params.id).select([
      '-password',
      '-updatedAt',
    ]);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
