const router = require('express').Router();
const Post = require('../models/Post');

// create a post
router.post('/', async (req, res) => {
  const { userId, desc, img, likes } = req.body;

  try {
    const newPost = new Post({ userId, desc, img, likes });
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;