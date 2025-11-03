import { useState, useEffect } from 'react';
import { getComentarios, createComentario, getMockComentarios } from '../lib/api';
import { validateComentarioForm } from '../lib/validators';
import { formatDateTime, isDevelopment } from '../lib/utils';
import './Comentarios.css';

export default function Comentarios() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    comentario: ''
  });
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const fetchComentarios = async () => {
    const result = isDevelopment()
      ? getMockComentarios()
      : await getComentarios();

    if (result.success) {
      setComentarios(result.data);
    }
  };

  useEffect(() => {
    fetchComentarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateComentarioForm(form);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setSubmitStatus(null);
    setErrors({});

    const result = await createComentario(form);

    if (result.success) {
      setForm({ nombre: '', email: '', comentario: '' });
      setSubmitStatus('success');
      fetchComentarios(); // Recargar lista

      setTimeout(() => setSubmitStatus(null), 3000);
    } else {
      setSubmitStatus('error');
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  return (
    <div className="comentarios">
      <div className="page-header">
        <h1>Comments</h1>
        <p>Share your thoughts and connect with the community. No regristation required!</p>
      </div>

      <div className="comentarios-layout">
        <div className="form-section">
          <h2>Add a comment</h2>

          {submitStatus === 'success' && (
            <div className="alert alert-success">
              ✅ Comment send successfully
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="alert alert-error">
              ❌ Error while sending comment. Please try again later.
            </div>
          )}

          <form onSubmit={handleSubmit} className="comment-form">
            <div className="form-group">
              <label htmlFor="nombre">Name *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Your name"
                className={errors.nombre ? 'error' : ''}
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your email@example.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="comentario">Comment *</label>
              <textarea
                id="comentario"
                name="comentario"
                value={form.comentario}
                onChange={handleChange}
                rows="5"
                placeholder="Share your thoughts..."
                className={errors.comentario ? 'error' : ''}
              />
              {errors.comentario && <span className="error-message">{errors.comentario}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}>
              {loading ? 'Posting comment...' : 'Post comment'}
            </button>
          </form>
        </div>

        <div className="comments-section">
          <h2>Recent comments ({comentarios.length})</h2>

          {comentarios.length === 0 ? (
            <div className="empty-state">
              No recent comments yet. ¡Be the first one!
            </div>
          ) : (
            <div className="comments-list">
              {comentarios.map(c => (
                <div key={c.id} className="comment-item">
                  <div className="comment-header">
                    <strong className="comment-author">{c.nombre}</strong>
                    <small className="comment-date">
                      {formatDateTime(c.created_at / 1000)}
                    </small>
                  </div>
                  <p className="comment-text">{c.comentario}</p>
                  <small className="comment-email">{c.email}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}