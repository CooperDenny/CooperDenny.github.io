export default function Projects() {
  return (
    <section id="projects" className="section bg-light">
      <div className="container">
        <div className="section-header">
          <h2>Featured Projects</h2>
        </div>

        {/* Featured project: full-width card */}
        <div className="project-card project-card--featured">
          <div className="project-content">
            <div className="project-icon">
              <i className="fas fa-medal"></i>
            </div>
            <h3>AFL Brownlow Prediction Model</h3>
            <p>
              Ordinal logistic regression model predicting AFL Brownlow Medal votes, applied
              across the 2023 and 2024 seasons. Correctly predicted Patrick Cripps to break the
              all-time vote record in 2024.
            </p>
            <div className="project-tags">
              <span className="tag">R</span>
              <span className="tag">Machine Learning</span>
              <span className="tag">Sports Analytics</span>
            </div>
            <div className="project-links-row">
              <a href="/projects/afl-brownlow-2024/" className="project-link">
                View 2024 Model <i className="fas fa-arrow-right"></i>
              </a>
              <a href="/projects/afl-brownlow-2023/" className="project-link">
                View 2023 Model <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="projects-grid">
          <div className="project-card">
            <div className="project-content">
              <div className="project-icon">
                <i className="fas fa-globe"></i>
              </div>
              <h3>Eildon Park Cricket Club Website</h3>
              <p>
                Full club website built with Claude Code featuring a historical player stats
                dashboard that automatically populates all senior club records from compiled
                historical data.
              </p>
              <div className="project-tags">
                <span className="tag">Claude Code</span>
                <span className="tag">Web Development</span>
                <span className="tag">Sports Analytics</span>
                <span className="tag">Cricket</span>
              </div>
              <a href="/projects/eildon-park-cricket-club/" className="project-link">
                View Project <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <div className="project-card">
            <div className="project-content">
              <div className="project-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Australian Arbitrage Betting Finder</h3>
              <p>
                API-driven system identifying arbitrage opportunities in H2H betting markets
                across Australian bookmakers using real-time odds data.
              </p>
              <div className="project-tags">
                <span className="tag">R</span>
                <span className="tag">API</span>
                <span className="tag">Finance</span>
              </div>
              <a href="/projects/h2h-arbitrage-finder/" className="project-link">
                View Project <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <div className="project-card">
            <div className="project-content">
              <div className="project-icon">
                <i className="fas fa-walking"></i>
              </div>
              <h3>Melbourne Pedestrian Counting System</h3>
              <p>
                Interactive Power BI dashboard analysing pedestrian traffic patterns across
                Melbourne CBD with temporal and spatial visualisations.
              </p>
              <div className="project-tags">
                <span className="tag">Power BI</span>
                <span className="tag">Data Visualisation</span>
                <span className="tag">Python</span>
              </div>
              <a href="/projects/melbourne-pedestrian-counting/" className="project-link">
                View Project <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <div className="project-card">
            <div className="project-content">
              <div className="project-icon">
                <i className="fas fa-home"></i>
              </div>
              <h3>Victorian Property Prices Dashboard</h3>
              <p>
                Comprehensive Power BI dashboard providing insights into Victorian property
                market trends with interactive maps and filterable analysis tools.
              </p>
              <div className="project-tags">
                <span className="tag">Power BI</span>
                <span className="tag">Real Estate</span>
                <span className="tag">Geospatial</span>
              </div>
              <a href="/projects/victorian-property-prices-dashboard/" className="project-link">
                View Project <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>

          <div className="project-card">
            <div className="project-content">
              <div className="project-icon">
                <i className="fas fa-table"></i>
              </div>
              <h3>CricketStatsHub</h3>
              <p>
                Comprehensive cricket statistics repository containing batting and bowling data
                from international and domestic competitions with standardised formats.
              </p>
              <div className="project-tags">
                <span className="tag">Data Engineering</span>
                <span className="tag">Sports Data</span>
                <span className="tag">GitHub</span>
              </div>
              <a href="https://github.com/CooperDenny/CricketStatsHub" className="project-link">
                View Project <i className="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
