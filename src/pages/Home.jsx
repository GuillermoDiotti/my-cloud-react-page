import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>🚀 Welcome to my Cloud Site</h1>
        <p className="hero-subtitle">
          React Web Page hosted on AWS with infrastructure as code
        </p>

        <div className="hero-features">
          <div className="feature-card">
            <h3>Artículos IA</h3>
            <p>Contenido generado automáticamente con AWS Bedrock cada 15 minutos</p>
            <Link to="/ai-articles" className="btn btn-primary">
              Ver artículos →
            </Link>
          </div>

          <div className="feature-card">
            <h3>Comentarios</h3>
            <p>Deja tu opinión guardada de forma segura en RDS PostgreSQL</p>
            <Link to="/comentarios" className="btn btn-primary">
              Comentar →
            </Link>
          </div>
        </div>
      </section>

      <section className="tech-stack">
        <h2>Stack Tecnológico</h2>
        <div className="tech-grid">
          <div className="tech-item">
            <strong>Frontend:</strong> React + Vite
          </div>
          <div className="tech-item">
            <strong>Hosting:</strong> AWS Amplify
          </div>
          <div className="tech-item">
            <strong>API:</strong> API Gateway + Lambda
          </div>
          <div className="tech-item">
            <strong>Base de Datos:</strong> RDS PostgreSQL
          </div>
          <div className="tech-item">
            <strong>NoSQL:</strong> DynamoDB
          </div>
          <div className="tech-item">
            <strong>IA:</strong> AWS Bedrock (Claude)
          </div>
          <div className="tech-item">
            <strong>Seguridad:</strong> WAF + VPC
          </div>
          <div className="tech-item">
            <strong>IaC:</strong> Terraform
          </div>
        </div>
      </section>
    </div>
  );
}