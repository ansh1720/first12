import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField,
  Button,
  Divider,
  useMediaQuery
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ReportIcon from '@mui/icons-material/Report';
import AddCommentIcon from '@mui/icons-material/AddComment';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

function CommunityPosts({ isAdmin, currentUser }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [commentingId, setCommentingId] = useState(null);
  const [commentText, setCommentText] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchPosts = async () => {
    const res = await axios.get('http://localhost:5000/api/community');
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddPost = async () => {
    if (!newPost.trim()) return;
    await axios.post('http://localhost:5000/api/community', {
      user: currentUser || 'Anonymous',
      content: newPost,
    });
    setNewPost('');
    fetchPosts();
  };

  const handleLike = async (id) => {
    await axios.post(`http://localhost:5000/api/community/${id}/like`);
    fetchPosts();
  };

  const handleReport = async (id) => {
    await axios.post(`http://localhost:5000/api/community/${id}/report`);
    fetchPosts();
  };

  const handleAddComment = async (id) => {
    if (!commentText.trim()) return;
    await axios.post(`http://localhost:5000/api/community/${id}/comment`, {
      user: currentUser || 'Anonymous',
      text: commentText,
    });
    setCommentText('');
    setCommentingId(null);
    fetchPosts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/community/${id}`);
    fetchPosts();
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" gutterBottom>
        Community Forum
      </Typography>

      {/* New Post Input */}
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Share your thoughts..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddPost}>
          Post
        </Button>
      </Box>

      {/* Posts List */}
      {posts.map((post) => (
        <Card key={post._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="body1" gutterBottom>{post.content}</Typography>
            <Typography variant="caption" color="text.secondary">
              By: {post.user} — {new Date(post.createdAt).toLocaleString()}
            </Typography>

            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <IconButton onClick={() => handleLike(post._id)}>
                <ThumbUpIcon fontSize="small" /> {post.likes}
              </IconButton>
              <IconButton onClick={() => handleReport(post._id)}>
                <ReportIcon fontSize="small" /> {post.reports}
              </IconButton>
              <IconButton onClick={() => setCommentingId(post._id)}>
                <AddCommentIcon fontSize="small" />
              </IconButton>
              {(isAdmin || currentUser === post.user) && (
                <IconButton onClick={() => handleDelete(post._id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* Comments */}
            <Box sx={{ mt: 1, ml: 2 }}>
              {post.comments.map((c, index) => (
                <Typography key={index} variant="body2">
                  💬 {c.user}: {c.text}
                </Typography>
              ))}
            </Box>

            {/* Comment Box */}
            {commentingId === post._id && (
              <Box sx={{ mt: 1, ml: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Your comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button
                  onClick={() => handleAddComment(post._id)}
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Submit
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}

      <Divider sx={{ mt: 4 }} />
    </Box>
  );
}

export default CommunityPosts;
