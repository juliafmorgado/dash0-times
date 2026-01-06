import sqlite3 from 'sqlite3';
import { allArticles } from './articles.js';

// Simple in-memory database simulation
let db = null;

export async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(':memory:', (err) => {
      if (err) {
        console.error('Database initialization failed:', err);
        reject(err);
        return;
      }
      
      console.log('In-memory SQLite database initialized');
      
      // Create articles table
      db.run(`
        CREATE TABLE articles (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          excerpt TEXT,
          body TEXT,
          author TEXT,
          publishedAt TEXT,
          tags TEXT
        )
      `, (err) => {
        if (err) {
          console.error('Failed to create articles table:', err);
          reject(err);
          return;
        }
        
        // Insert sample articles
        const stmt = db.prepare(`
          INSERT INTO articles (id, title, excerpt, body, author, publishedAt, tags)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        allArticles.forEach(article => {
          stmt.run(
            article.id,
            article.title,
            article.excerpt,
            article.body,
            article.author,
            article.publishedAt,
            JSON.stringify(article.tags)
          );
        });
        
        stmt.finalize((err) => {
          if (err) {
            console.error('Failed to insert articles:', err);
            reject(err);
            return;
          }
          
          console.log(`Database initialized with ${allArticles.length} articles`);
          resolve(db);
        });
      });
    });
  });
}

export async function queryDatabase(query, params = []) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'));
      return;
    }
    
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

export function getDatabase() {
  return db;
}