import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { getArticulos, getMockArticulos } from '../lib/api';
import { formatRelativeTime, truncateText, isDevelopment } from '../lib/utils';
import './AIArticles.css';

export default function AIArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = isDevelopment()
        ? getMockArticulos()
        : await getArticulos();

      if (result.success) {
        setArticles(result.data);
        setLastUpdate(new Date());
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="ai-articles">
      <header className="page-header">
        <h1>AI Articles</h1>
        <p>Auto-generated articles by AWS Bedrock, every 15 minutes</p>

        {lastUpdate && (
          <div className="last-update">
            Last Update: {lastUpdate.toLocaleTimeString()}
            <button onClick={fetchArticles} className="btn-refresh" disabled={loading}>
              {loading ? '⏳' : '🔄'} Update
            </button>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            ❌ {error}
          </div>
        )}
      </header>

      {loading && articles.length === 0 ? (
        <div className="loading">⏳ Fetching articles...</div>
      ) : articles.length === 0 ? (
        <div className="empty">No recent articles yet</div>
      ) : (
        <div className="articles-grid">
          {articles.map(article => (
            <article key={article.id} className="article-card">
              <div className="article-header">
                <h2>{article.title}</h2>
                <small className="article-date">
                  {formatRelativeTime(article.created_at)}
                </small>
              </div>

              <div className="article-content">
                <ReactMarkdown>
                  {truncateText(article.content, 300)}
                </ReactMarkdown>
              </div>

              <div className="article-footer">
                <span className="badge">AI Auto-generated</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}