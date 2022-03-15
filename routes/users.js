const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { json } = require("express/lib/response");

// update user
router.put("/:id", async (req, res) => {
  // if the ids don't match, it's not the same user
  if (req.params.id !== req.body.userId || req.body.isAdmin)
    res.status(403).json("You can only update your account");

  // if the user supplied the password, encrypt it
  if (req.body.password) {
    try {
      const saltRounds = 10;
      req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    } catch (err) {
      res.status(500).json("An error occured.");
    }
  }

  // update the user with the details submitted
  try {
    const user = await User.findByIdAndUpdate(req.body.userId, {
      $set: req.body
    });
    res.status(200).json("User updated successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a user
router.delete("/:id", async (req, res) => {
  if (req.params.id !== req.body.userId || req.body.isAdmin)
    res.status(403).json("You can only delete your account.");

  try {
    await User.findByIdAndDelete(req.body.userId);
    res.status(200).json("User record deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    // get the user details minus the password and updatedAt fields
    const user = userId
      ? await User.findById(userId).select(["-password", "-updatedAt"])
      : await User.findOne({ username }).select(["-password", "-updatedAt"]);

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId === req.params.id)
    res.status(403).json("You may not follow yourself.");

  try {
    const currentUser = await User.findById(req.body.userId);
    const userToFollow = await User.findById(req.params.id);

    if (userToFollow.followers.includes(req.body.userId))
      res.status(403).json("You already follow this user");
    else {
      // update the userToFollow followers and currentUser following
      await userToFollow.updateOne({ $push: { followers: req.body.userId } });
      await currentUser.updateOne({ $push: { following: req.params.id } });

      res.status(200).json(`You are now following ${userToFollow.username}`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId === req.params.id)
    res.status(403).status("You may not unfollow yourself.");

  try {
    const currentUser = await User.findById(req.body.userId);
    const userToUnfollow = await User.findById(req.params.id);

    if (!currentUser.following.includes(req.params.id))
      res.status(403).json("You do not follow this user");
    else {
      // update currentUser's following and userToUnfollow's followers
      await currentUser.updateOne({ $pull: { following: req.params.id } });
      await userToUnfollow.updateOne({ $pull: { followers: req.body.userId } });

      res.status(200).json(`You have unfollowed ${userToUnfollow.username}`);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get friends (people you follow)
router.get('/:id/friends', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const friends = await Promise.all(
      user.following.map(friendId => User.findById(friendId))
    );
    // take only the _id, profilePic, and username
    const friendList = friends.map(friend => (
      {_id: friend._id, username: friend.username, profilePic: friend.profilePic})
    )
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;
