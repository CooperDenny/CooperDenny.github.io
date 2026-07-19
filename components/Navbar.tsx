export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="#" className="nav-logo">
          Cooper Denny
        </a>
        <button className="nav-toggle" aria-label="Toggle navigation">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className="nav-links">
          <li>
            <a href="#experience">Experience</a>
          </li>
          <li>
            <a href="#projects">Projects</a>
          </li>
          <li>
            <a href="#skills">Tech Stack</a>
          </li>
          <li>
            <a href="#education">Education</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <div className="nav-controls">
          <button className="theme-toggle" aria-label="Toggle dark/light mode">
            <i className="fas fa-sun"></i>
            <i className="fas fa-moon"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}
