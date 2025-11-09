import { useState, useEffect } from 'react';
import { getArticulos, getArticuloById } from '../lib/api';

// Función para formatear tiempo relativo
function formatRelativeTime(timestamp) {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

// Función para truncar texto
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Componente simple para renderizar Markdown
function MarkdownRenderer({ content }) {
  const html = content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// Mock data para desarrollo
function getMockArticulos() {
  return {
    success: true,
    items: [
      {
        id: '1',
        title: 'Cloud Computing en 2024',
        content: '# Introducción\n\nEste es un artículo sobre cloud computing...\n\n## Ventajas\n\n- Escalabilidad\n- Flexibilidad\n- Costos optimizados',
        created_at: Date.now() / 1000,
        topic: 'technology',
        metadata: {
          word_count: 150,
          model: 'claude-3-haiku'
        }
      },
      {
        id: '2',
        title: 'Serverless Architecture',
        content: '# Overview\n\nServerless permite ejecutar código sin servidores...\n\n## Beneficios\n\n- No gestión de infraestructura\n- Pago por uso',
        created_at: Date.now() / 1000 - 3600,
        topic: 'cloud',
        metadata: {
          word_count: 200,
          model: 'claude-3-haiku'
        }
      },
    ],
  };
}

// Función para hacer fetch con retry
async function fetchWithRetryaa(url, options = {}, retries = 3) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retry attempt ${4 - retries}...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

export default function AIArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [expandedArticle, setExpandedArticle] = useState(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getArticulos();

      if (result.success) {
        setArticles(result.data || result.items || []);
        setLastUpdate(new Date());
      } else {
        setError(result.error || 'Error fetching articles');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();

    const interval = setInterval(fetchArticles, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleExpand = (articleId) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🤖 AI Articles</h1>
        <p style={styles.subtitle}>Auto-generated articles by AWS Bedrock (Claude), every 15 minutes</p>

        {lastUpdate && (
          <div style={styles.lastUpdate}>
            Last Update: {lastUpdate.toLocaleTimeString()}
            <button
              onClick={fetchArticles}
              style={styles.btnRefresh}
              disabled={loading}
              aria-label="Refresh articles"
            >
              {loading ? '⏳' : '🔄'} Update
            </button>
          </div>
        )}

        {error && (
          <div style={styles.alertError} role="alert">
            ❌ {error}
          </div>
        )}
      </header>

      {loading && articles.length === 0 ? (
        <div style={styles.loading} role="status">
          ⏳ Fetching articles...
        </div>
      ) : articles.length === 0 ? (
        <div style={styles.empty}>
          <p>📭 No articles yet</p>
          <p>The first article will be generated automatically in a few minutes</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {articles.map(article => {
            const isExpanded = expandedArticle === article.id;
            const displayContent = isExpanded
              ? article.content
              : truncateText(article.content, 300);

            return (
              <article key={article.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>{article.title || 'Untitled Article'}</h2>
                  <small style={styles.date}>
                    {formatRelativeTime(article.created_at)}
                  </small>
                </div>

                <div style={styles.metadata}>
                  {article.topic && (
                    <span style={styles.badgeTopic}>{article.topic}</span>
                  )}
                  {article.metadata?.word_count && (
                    <span style={styles.badgeCount}>
                      {article.metadata.word_count} words
                    </span>
                  )}
                </div>

                <div style={styles.content}>
                  <MarkdownRenderer content={displayContent} />
                </div>

                {article.content.length > 300 && (
                  <button
                    style={styles.btnExpand}
                    onClick={() => toggleExpand(article.id)}
                  >
                    {isExpanded ? '📖 Show Less' : '📄 Read More'}
                  </button>
                )}

                <div style={styles.footer}>
                  <span style={styles.badgeAi}>
                    🤖 AI Generated
                  </span>
                  {article.metadata?.model && (
                    <span style={styles.badgeModel}>
                      {article.metadata.model}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {articles.length > 0 && (
        <div style={styles.stats}>
          <p>📊 Showing {articles.length} article{articles.length !== 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    margin: '0 0 1rem 0',
  },
  lastUpdate: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem',
    color: '#666',
  },
  btnRefresh: {
    padding: '0.5rem 1rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  alertError: {
    padding: '1rem',
    backgroundColor: '#fee',
    color: '#c00',
    borderRadius: '4px',
    marginTop: '1rem',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.2rem',
    color: '#666',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHeader: {
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0',
    color: '#1a1a1a',
  },
  date: {
    color: '#999',
    fontSize: '0.85rem',
  },
  metadata: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  badgeTopic: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  badgeCount: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#f3e5f5',
    color: '#7b1fa2',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  content: {
    marginBottom: '1rem',
    lineHeight: '1.6',
    color: '#333',
  },
  btnExpand: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  footer: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  badgeAi: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  badgeModel: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#fff3e0',
    color: '#e65100',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  stats: {
    textAlign: 'center',
    marginTop: '2rem',
    padding: '1rem',
    color: '#666',
  },
};