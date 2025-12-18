import express from 'express';
import cors from 'cors';
import { allArticles, getViewerContext, addDelay } from './data/articles.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS middleware for frontend development
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Common Vite and React dev server ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-user']
}));

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// GET /api/articles - List all articles with 50-150ms delay
app.get('/api/articles', async (req, res) => {
  try {
    // Add artificial delay between 50-150ms as per requirements 8.1
    await addDelay(50, 150);
    
    const viewer = getViewerContext(req);
    
    // Return articles with viewer context if present
    const response = {
      articles: allArticles.map(article => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        tags: article.tags,
        publishedAt: article.publishedAt,
        author: article.author
      }))
    };
    
    if (viewer) {
      response.viewer = viewer;
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// GET /api/articles/:id - Get single article with 800-1200ms delay
app.get('/api/articles/:id', async (req, res) => {
  try {
    // Add artificial delay between 800-1200ms as per requirements 8.2
    await addDelay(800, 1200);
    
    const { id } = req.params;
    const viewer = getViewerContext(req);
    
    const article = allArticles.find(a => a.id === id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    const response = {
      article: {
        id: article.id,
        title: article.title,
        body: article.body,
        tags: article.tags,
        publishedAt: article.publishedAt,
        author: article.author
      }
    };
    
    if (viewer) {
      response.viewer = viewer;
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

// GET /api/search - Search articles with 100-400ms delay and 20% error rate
app.get('/api/search', async (req, res) => {
  try {
    // Add artificial delay between 100-400ms as per requirements 8.3
    await addDelay(100, 400);
    
    // 20% chance of returning HTTP 500 error as per requirements 8.3
    if (Math.random() < 0.2) {
      return res.status(500).json({ error: 'Search service temporarily unavailable' });
    }
    
    const { q: query } = req.query;
    
    if (!query || query.trim() === '') {
      return res.json({ results: [], query: query || '' });
    }
    
    // Simple search implementation - search in title, excerpt, and tags
    const searchTerm = query.toLowerCase().trim();
    const results = allArticles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.excerpt.toLowerCase().includes(searchTerm) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    ).map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      tags: article.tags,
      publishedAt: article.publishedAt,
      author: article.author
    }));
    
    res.json({ results, query });
  } catch (error) {
    console.error('Error searching articles:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /api/recommendation - Get recommended articles with 200-900ms delay
app.get('/api/recommendation', async (req, res) => {
  try {
    // Add artificial delay between 200-900ms as per requirements 8.4
    await addDelay(200, 900);
    
    // Get 3 random articles as recommendations
    const shuffled = [...allArticles].sort(() => 0.5 - Math.random());
    const recommendations = shuffled.slice(0, 3).map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      tags: article.tags,
      publishedAt: article.publishedAt,
      author: article.author
    }));
    
    res.json({ recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📋 Health check available at http://localhost:${PORT}/api/health`);
  console.log(`🔗 CORS configured for frontend at http://localhost:3000`);
  console.log(`📊 API endpoints ready: /api/articles, /api/search, /api/recommendation`);
});

export default app;