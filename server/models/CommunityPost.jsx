const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const communityPostSchema = new mongoose.Schema({
  user: String,
  content: String,
  likes: {
    type: Number,
    default: 0,
  },
  reports: {
    type: Number,
    default: 0,
  },
  comments: [commentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);
