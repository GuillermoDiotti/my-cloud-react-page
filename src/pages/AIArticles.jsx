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
        <h1>Artículos generados por IA</h1>
        <p>Contenido creado automáticamente con AWS Bedrock cada 15 minutos</p>

        {lastUpdate && (
          <div className="last-update">
            Última actualización: {lastUpdate.toLocaleTimeString()}
            <button onClick={fetchArticles} className="btn-refresh" disabled={loading}>
              {loading ? '⏳' : '🔄'} Actualizar
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
        <div className="loading">⏳ Cargando artículos...</div>
      ) : articles.length === 0 ? (
        <div className="empty">No hay artículos disponibles todavía</div>
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
                <span className="badge">Generado por IA</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}