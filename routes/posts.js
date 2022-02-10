const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

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

// update a post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (req.body.userId !== post.userId)
      res.status(403).json('You are not the owner of this post.');
    else {
      await post.updateOne({ $set: req.body })
      res.status(200).json('Updated successfully.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (req.body.userId !== post.userId)
      res.status(403).json('You are not the owner of this post.');
    else {
      await post.deleteOne();
      res.status(200).json('Post deleted successfully.');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// like or dislike a post
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // unlike if the user has previously like the post
    if (post.likes.includes(req.body.userId)) {
      await post.updateOne({ $pull: { likes: req.body.userId } })
      res.status(200).json("Post unliked");
    }
    else {
      await post.updateOne({ $push: { likes: req.body.userId } })
      res.status(200).json("Post liked")
    }
  } catch (err) {
    res.status(500).json(err);
  }

});

// get a post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get posts on timeline - user posts + followed users' posts
router.get('/timeline/all', async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const currentUserPosts = await Post.find({ userId: currentUser._id });
  
    // get posts made by the people the user follows
    const followedUsersPosts = await Promise.all(
      currentUser.following.map((followedUserId) =>
        Post.find({ userId: followedUserId }))
    );
  
    const posts = currentUserPosts.concat(followedUsersPosts);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
})


module.exports = router;
