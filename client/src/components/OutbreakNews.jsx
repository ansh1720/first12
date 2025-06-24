// components/OutbreakNews.js
import React, { useEffect, useState } from 'react';
import Parser from 'rss-parser';
import { Box, Typography, Link, Divider } from '@mui/material';

const parser = new Parser();

export default function OutbreakNews() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function loadFeed() {
      try {
        const feed = await parser.parseURL('https://healthmap.org/feeds/current.rss');
        setArticles(feed.items.slice(0, 10));
      } catch (e) {
        console.error('RSS fetch error', e);
      }
    }
    loadFeed();
  }, []);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>Outbreak News</Typography>
      {articles.map((a, idx) => (
        <Box key={idx} sx={{ mb: 2 }}>
          <Link href={a.link} target="_blank" underline="hover">
            <Typography variant="subtitle1">{a.title}</Typography>
          </Link>
          <Typography variant="body2" color="text.secondary" noWrap>
            {a.contentSnippet}
          </Typography>
          <Divider sx={{ mt: 1 }} />
        </Box>
      ))}
    </Box>
  );
}
