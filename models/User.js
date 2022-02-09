const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    min: 3,
    max: 30,
    unique: true,
    required: true
  },
  email: {
    type: String,
    max: 50,
    unique: true,
    required: true
  },
  password: {
    type: String,
    min: 6,
    required: true
  },
  profilePic: {
    type: String,
    default: ''
  },
  coverPic: {
    type: String,
    default: ''
  },
  followers: {
    type: Array,
    default: [],
  },
  following: {
    type: Array,
    default: [],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
    max: 50,
  },
  city: {
    type: String,
    max: 50,
  },
  from: {
    type: String,
    max: 50,
  },
  relationship: {
    type: Number,
    enum: [1, 2, 3]
  }
},
{ timestamps: true }
)

module.exports = mongoose.model('User', userSchema);