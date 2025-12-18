import { Routes, Route } from 'react-router-dom'
import { ToastProvider } from './contexts/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import SearchPage from './pages/SearchPage'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:id" element={<ArticleDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App