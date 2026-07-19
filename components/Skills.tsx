export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Tech Stack</h2>
        </div>
        <div className="skills-categories">
          <div className="skills-group">
            <h3 className="skills-group-label">Languages</h3>
            <div className="skills-grid">
              <div className="skill-item">
                <i className="fas fa-file-excel skill-icon" style={{ color: '#217346' }}></i>
                <span>Excel</span>
              </div>
              <div className="skill-item">
                <i className="fas fa-database skill-icon" style={{ color: '#4479A1' }}></i>
                <span>SQL</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/r/r-original.svg"
                  alt="R"
                  width={24}
                  height={24}
                />
                <span>R</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"
                  alt="Python"
                  width={24}
                  height={24}
                />
                <span>Python</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/neo4j/neo4j-original.svg"
                  alt="Neo4j"
                  width={24}
                  height={24}
                />
                <span>Cypher (Neo4j)</span>
              </div>
            </div>
          </div>

          <div className="skills-group">
            <h3 className="skills-group-label">Data Stack</h3>
            <div className="skills-grid">
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/dbt-logo.png" alt="dbt" width={24} height={24} />
                <span>dbt / dbt Cloud</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/snowflake-logo.png" alt="Snowflake" width={24} height={24} />
                <span>Snowflake</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/fivetran-logo.png" alt="Fivetran" width={24} height={24} />
                <span>Fivetran</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.simpleicons.org/make/6D00CC"
                  alt="Make.com"
                  width={24}
                  height={24}
                />
                <span>Make.com</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.simpleicons.org/posthog/E5492E"
                  alt="PostHog"
                  width={24}
                  height={24}
                />
                <span>PostHog</span>
              </div>
            </div>
          </div>

          <div className="skills-group">
            <h3 className="skills-group-label">BI &amp; Visualisation</h3>
            <div className="skills-grid">
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/tableau-logo.png" alt="Tableau" width={24} height={24} />
                <span>Tableau</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/power-bi-logo.png" alt="Power BI" width={24} height={24} />
                <span>Power BI</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/lightdash-logo.png" alt="Lightdash" width={24} height={24} />
                <span>Lightdash</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/omni-logo.jpg" alt="Omni" width={24} height={24} />
                <span>Omni</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.simpleicons.org/googleanalytics/E37400"
                  alt="Google Analytics"
                  width={24}
                  height={24}
                />
                <span>Google Analytics</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://raw.githubusercontent.com/rstudio/shiny/main/man/figures/logo.png"
                  alt="R Shiny"
                  width={24}
                  height={24}
                />
                <span>R Shiny</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/explo-logo.webp" alt="Explo" width={24} height={24} />
                <span>Explo</span>
              </div>
            </div>
          </div>

          <div className="skills-group">
            <h3 className="skills-group-label">Development</h3>
            <div className="skills-grid">
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg"
                  alt="VS Code"
                  width={24}
                  height={24}
                />
                <span>VS Code</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/claude-code-logo.svg" alt="Claude Code" width={24} height={24} />
                <span>Claude Code</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jupyter/jupyter-original.svg"
                  alt="Jupyter"
                  width={24}
                  height={24}
                />
                <span>Jupyter</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg"
                  alt="Git"
                  width={24}
                  height={24}
                />
                <span>Git</span>
              </div>
            </div>
          </div>

          <div className="skills-group">
            <h3 className="skills-group-label">Collaboration</h3>
            <div className="skills-grid">
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/google-drive-logo.png" alt="Google Drive" width={24} height={24} />
                <span>Google Drive</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg"
                  alt="Jira"
                  width={24}
                  height={24}
                />
                <span>Jira</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/confluence/confluence-original.svg"
                  alt="Confluence"
                  width={24}
                  height={24}
                />
                <span>Confluence</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/slack/slack-original.svg"
                  alt="Slack"
                  width={24}
                  height={24}
                />
                <span>Slack</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/microsoft-teams-logo.png"
                  alt="Microsoft Teams"
                  width={24}
                  height={24}
                />
                <span>Microsoft Teams</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/microsoft-office-logo.png"
                  alt="Microsoft Office"
                  width={24}
                  height={24}
                />
                <span>Microsoft Office</span>
              </div>
              <div className="skill-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/google-meets-logo.png" alt="Google Meet" width={24} height={24} />
                <span>Google Meet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
