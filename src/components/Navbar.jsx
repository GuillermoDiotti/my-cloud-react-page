import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <h1>My Cloud Site
          </h1>
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/ai-articles">Artículos IA</Link>
          </li>
          <li>
            <Link to="/comentarios">Comentarios</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}