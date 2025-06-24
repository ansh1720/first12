const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
});

// Create new post
router.post('/', async (req, res) => {
  const { user, content } = req.body;

  if (!user || !content) {
    return res.status(400).json({ error: 'Missing user or content' });
  }

  try {
    const post = new CommunityPost({ user, content });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Server error while creating post' });
  }
});

// Like a post
router.post('/:id/like', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.likes++;
    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Server error while liking post' });
  }
});

// Comment on post
router.post('/:id/comment', async (req, res) => {
  const { user, text } = req.body;
  if (!user || !text) {
    return res.status(400).json({ error: 'Missing comment user or text' });
  }

  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.comments.push({ user, text });
    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Server error while adding comment' });
  }
});

// Report a post
router.post('/:id/report', async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.reports++;
    await post.save();
    res.json(post);
  } catch (error) {
    console.error('Error reporting post:', error);
    res.status(500).json({ error: 'Server error while reporting post' });
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  const { user, isAdmin } = req.query;

  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user !== user && isAdmin !== 'true') {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Server error while deleting post' });
  }
});

module.exports = router;
