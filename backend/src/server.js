import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import { allArticles, getViewerContext, addDelay } from './data/articles.js';
import { initializeDatabase, queryDatabase } from './data/database.js';

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
    console.log('Fetching all articles...');
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
    
    console.log(`Returned ${allArticles.length} articles`);
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
    console.log('Starting recommendation engine...');
    // Add artificial delay between 200-900ms as per requirements 8.4
    await addDelay(200, 900);
    
    // Simulate external API call for ML recommendations
    console.log('Calling ML recommendation service...');
    await addDelay(100, 300);
    
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
    
    console.log(`Generated ${recommendations.length} recommendations`);
    res.json({ recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// NEW: Heavy computation endpoint for backend performance demo
app.post('/api/analyze', async (req, res) => {
  try {
    console.log('Starting heavy analysis...');
    const startTime = Date.now();
    
    // Simulate CPU-intensive work
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.sqrt(i) * Math.sin(i);
    }
    
    // Simulate database operations
    console.log('Querying database...');
    await addDelay(500, 800);
    
    const duration = Date.now() - startTime;
    console.log(`Analysis completed in ${duration}ms`);
    
    res.json({ 
      result: result.toFixed(2), 
      duration,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// NEW: Flaky service endpoint (30% error rate)
app.get('/api/flaky-service', async (req, res) => {
  try {
    console.log('Calling flaky external service...');
    
    // 30% chance of failure
    if (Math.random() < 0.3) {
      console.error('External service unavailable!');
      return res.status(503).json({ error: 'External service temporarily unavailable' });
    }
    
    await addDelay(100, 500);
    console.log('External service responded successfully');
    res.json({ status: 'success', data: 'External service data' });
  } catch (error) {
    console.error('Flaky service error:', error);
    res.status(500).json({ error: 'Service error' });
  }
});

// NEW: Database simulation endpoint
app.get('/api/database-query', async (req, res) => {
  try {
    console.log('Executing database query...');
    
    // Simulate complex database query with multiple operations
    console.log('Running SELECT query...');
    const articles = await queryDatabase('SELECT COUNT(*) as count FROM articles');
    await addDelay(200, 400);
    
    console.log('Running JOIN operations...');
    const authors = await queryDatabase('SELECT DISTINCT author FROM articles');
    await addDelay(300, 600);
    
    console.log('Aggregating results...');
    const recentArticles = await queryDatabase(
      'SELECT * FROM articles ORDER BY publishedAt DESC LIMIT 5'
    );
    await addDelay(100, 200);
    
    const mockData = {
      totalArticles: articles[0].count,
      totalAuthors: authors.length,
      recentArticles: recentArticles.length,
      queryTime: Date.now()
    };
    
    console.log('Database query completed');
    res.json(mockData);
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// NEW: External API simulation endpoint
app.get('/api/external-weather', async (req, res) => {
  try {
    console.log('Fetching weather data from external API...');
    
    // Simulate actual external API call to httpbin for realistic HTTP traces
    try {
      const response = await fetch('https://httpbin.org/delay/1');
      const data = await response.json();
      console.log('External API call completed');
    } catch (fetchError) {
      console.log('External API call failed, using mock data');
    }
    
    // Add additional delay to simulate processing
    await addDelay(300, 700);
    
    const mockWeatherData = {
      location: 'San Francisco',
      temperature: Math.floor(Math.random() * 30) + 10,
      condition: ['sunny', 'cloudy', 'rainy', 'foggy'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 100),
      timestamp: new Date().toISOString()
    };
    
    console.log('Weather data retrieved successfully');
    res.json(mockWeatherData);
  } catch (error) {
    console.error('Weather API failed:', error);
    res.status(500).json({ error: 'Weather service unavailable' });
  }
});

// NEW: File operations endpoint
app.post('/api/file-operations', async (req, res) => {
  try {
    console.log('Starting file operations...');
    
    const tempDir = path.join(process.cwd(), 'temp');
    const fileName = `temp-${Date.now()}.txt`;
    const filePath = path.join(tempDir, fileName);
    
    // Create temp directory if it doesn't exist
    try {
      await fs.mkdir(tempDir, { recursive: true });
      console.log('Temp directory created/verified');
    } catch (err) {
      console.log('Temp directory already exists');
    }
    
    // Write file
    console.log('Writing file...');
    const content = `Temporary file created at ${new Date().toISOString()}\nRandom data: ${Math.random()}`;
    await fs.writeFile(filePath, content);
    await addDelay(100, 200);
    
    // Read file
    console.log('Reading file...');
    const readContent = await fs.readFile(filePath, 'utf8');
    await addDelay(50, 100);
    
    // Delete file
    console.log('Cleaning up file...');
    await fs.unlink(filePath);
    
    console.log('File operations completed');
    res.json({ 
      operation: 'success',
      fileName,
      contentLength: readContent.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('File operations failed:', error);
    res.status(500).json({ error: 'File operations failed' });
  }
});

// NEW: Cache simulation endpoint
app.get('/api/cache-demo/:key', async (req, res) => {
  try {
    const { key } = req.params;
    console.log(`Checking cache for key: ${key}`);
    
    // Simulate cache lookup
    await addDelay(10, 30);
    
    // 70% cache hit rate
    const cacheHit = Math.random() < 0.7;
    
    if (cacheHit) {
      console.log('Cache HIT');
      res.json({ 
        source: 'cache',
        key,
        data: `Cached data for ${key}`,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('Cache MISS - fetching from database');
      // Simulate database fetch
      await addDelay(200, 500);
      
      console.log('Storing in cache');
      await addDelay(20, 50);
      
      res.json({ 
        source: 'database',
        key,
        data: `Fresh data for ${key}`,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Cache operation failed:', error);
    res.status(500).json({ error: 'Cache operation failed' });
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
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
      console.log(`Health check available at http://localhost:${PORT}/api/health`);
      console.log(`CORS configured for frontend at http://localhost:3000`);
      console.log(`API endpoints ready: /api/articles, /api/search, /api/recommendation`);
      console.log(`Enhanced telemetry endpoints: /api/analyze, /api/flaky-service, /api/database-query`);
      console.log(`External API endpoints: /api/external-weather`);
      console.log(`File operations: /api/file-operations`);
      console.log(`Cache demo: /api/cache-demo/:key`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;