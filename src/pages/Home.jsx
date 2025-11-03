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
            <h3>AI Articles</h3>
            <p>Auto-generated articles by AWS Bedrock, every 15 minutes</p>
            <Link to="/ai-articles" className="btn btn-primary">
              View Articles →
            </Link>
          </div>

          <div className="feature-card">
            <h3>Comments</h3>
            <p>Share your thoughts and connect with the community. No regristation required!</p>
            <Link to="/comentarios" className="btn btn-primary">
              View Comments →
            </Link>
          </div>
        </div>
      </section>

      <section className="tech-stack">
        <h2>Technologies</h2>
        <div className="tech-grid">
          <div className="tech-item">
            <strong>Frontend:</strong> React + Vite
          </div>
          <div className="tech-item">
            <strong>Hosting:</strong> AWS Amplify + Github Repo
          </div>
          <div className="tech-item">
            <strong>API:</strong> API Gateway + Lambda
          </div>
          <div className="tech-item">
            <strong>Data Base:</strong> RDS PostgreSQL
          </div>
          <div className="tech-item">
            <strong>NoSQL:</strong> DynamoDB
          </div>
          <div className="tech-item">
            <strong>AI:</strong> AWS Bedrock (Claude)
          </div>
          <div className="tech-item">
            <strong>Security:</strong> WAF + VPC
          </div>
          <div className="tech-item">
            <strong>IaC:</strong> Terraform
          </div>
        </div>
      </section>
    </div>
  );
}