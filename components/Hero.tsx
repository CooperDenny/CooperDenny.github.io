export default function Hero() {
  return (
    <header className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero-image.png" alt="Cooper Denny" className="profile-image" />
          </div>
          <div className="hero-text">
            <h1>Cooper Denny</h1>
            <p className="subtitle">Data Scientist | Melbourne, Victoria</p>
            <p className="description">
              Data Scientist at PlayHQ Sports. Passionate about using data and AI to simplify
              complex problems — turning messy data into clear insights through predictive
              modelling, interactive dashboards, and reporting that drives real decisions. I
              enjoy cross-functional collaboration, working closely with all parts of the
              business to deliver data that&apos;s understood and acted on, using tools like
              SQL, Python, dbt, Snowflake, Tableau, Lightdash, and more.
            </p>

            <p className="last-updated">Last updated: June 2026</p>

            <div className="cta-buttons">
              <a href="#experience" className="btn primary">
                <i className="fas fa-briefcase"></i>
                View Experience
              </a>
              <a href="#contact" className="btn secondary">
                <i className="fas fa-envelope"></i>
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Data Elements */}
      <div className="floating-elements">
        <div className="floating-chart chart-1">
          <svg viewBox="0 0 100 60" className="mini-chart">
            <path
              d="M10,50 Q30,20 50,30 T90,10"
              stroke="var(--accent)"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          <span className="chart-label">Sports Analytics</span>
        </div>
        <div className="floating-chart chart-2">
          <svg viewBox="0 0 60 60" className="mini-chart">
            <circle
              cx="30"
              cy="30"
              r="20"
              fill="none"
              stroke="var(--accent-secondary)"
              strokeWidth="3"
              strokeDasharray="125.6"
              strokeDashoffset="31.4"
            />
          </svg>
          <span className="chart-label">ML Modelling</span>
        </div>
        <div className="floating-chart chart-3">
          <div className="bar-chart-mini">
            <div className="bar" style={{ height: '40%' }}></div>
            <div className="bar" style={{ height: '70%' }}></div>
            <div className="bar" style={{ height: '55%' }}></div>
            <div className="bar" style={{ height: '85%' }}></div>
          </div>
          <span className="chart-label">Data Insights</span>
        </div>
      </div>
    </header>
  );
}
