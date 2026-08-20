export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-header">
          <h2>Professional Experience</h2>
        </div>

        <div className="experience-timeline">
          <div className="timeline-item">
            <div className="timeline-content">
              <div className="timeline-header">
                <div className="timeline-logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://resources.wa-cricket.pulselive.com/wa-cricket/photo/2023/10/11/acf4f93a-d52a-4cfb-af5a-d969e2069d67/PlayHQ-logo.png"
                    alt="PlayHQ Sports Logo"
                  />
                </div>
                <div className="timeline-main-info">
                  <h3>Data Scientist</h3>
                  <p className="company">PlayHQ Sports</p>
                  <p className="role-history">Promoted from Junior Data Scientist · Nov 2024 - Jul 2026</p>
                </div>
                <div className="timeline-meta">
                  <p className="period">Nov 2024 - Present</p>
                  <span className="job-type">Full Time</span>
                </div>
              </div>
              <div className="timeline-body">
                <p className="timeline-summary">
                  Supporting PlayHQ&apos;s mission to power community sport across Australia, New
                  Zealand, the UK, and Canada through data-driven insights and cross-functional
                  collaboration.
                </p>
                <div className="timeline-achievements">
                  <ul>
                    <li>
                      Building data products that empower community sport across Australia, New
                      Zealand, the UK, and Canada - supporting tens of thousands of games every
                      week through analytics and insights
                    </li>
                    <li>
                      Cross-functional collaboration with Product, Engineering, Finance and
                      Community teams to deliver data-driven solutions using SQL, Python, dbt,
                      Snowflake, Tableau, Omni, and Lightdash
                    </li>
                    <li>
                      End-to-end data work - from refactoring models and building dashboards to
                      analysing user behaviour and designing data pipelines for our first-party
                      data platform
                    </li>
                    <li>
                      Impact-driven analysis - running regressions on participant churn/retention,
                      defining success metrics, and translating complex data into actionable
                      business insights
                    </li>
                    <li>
                      Startup environment working with cloud technologies and modern data stack,
                      moving quickly to solve problems from first principles while supporting
                      PlayHQ&apos;s mission in community sport
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-content">
              <div className="timeline-header">
                <div className="timeline-logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://cdn.revolutionise.com.au/logos/ndf9nf5hluhzmmpk.png"
                    alt="Boccia Australia Logo"
                  />
                </div>
                <div className="timeline-main-info">
                  <h3>Data Support and App Developer</h3>
                  <p className="company">Boccia Australia</p>
                </div>
                <div className="timeline-meta">
                  <p className="period">Jul 2024 - Sep 2024</p>
                  <span className="job-type">Contract</span>
                </div>
              </div>
              <div className="timeline-body">
                <p className="timeline-summary">
                  Enhanced R Shiny application for Paralympic Boccia analysis, integrated
                  Snowflake data architecture, and contributed to Australia&apos;s historic
                  Paralympic performance (two silver medals).
                </p>
                <div className="timeline-achievements">
                  <ul>
                    <li>Enhanced R Shiny application for Pairs and Teams match analysis</li>
                    <li>Integrated historical match data into Snowflake for scalable analytics</li>
                    <li>Collaborated with AIS, VIS, and Paralympics Australia analysts</li>
                    <li>Contributed to Australia&apos;s best-ever Paralympic Boccia performance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-content">
              <div className="timeline-header">
                <div className="timeline-logo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/1/17/Victorian_Institute_of_Sport_Primary_Logo.jpg"
                    alt="Victorian Institute of Sport Logo"
                  />
                </div>
                <div className="timeline-main-info">
                  <h3>Data Science Intern</h3>
                  <p className="company">Victorian Institute of Sport</p>
                </div>
                <div className="timeline-meta">
                  <p className="period">Jul 2023 - Oct 2023</p>
                  <span className="job-type">Internship</span>
                </div>
              </div>
              <div className="timeline-body">
                <p className="timeline-summary">
                  Developed custom R Shiny performance analysis application, replacing expensive
                  commercial software and providing real-time athlete monitoring capabilities.
                </p>
                <div className="timeline-achievements">
                  <ul>
                    <li>Built R Shiny application replacing Hudl Sportscode</li>
                    <li>Created interactive, filterable performance dashboards</li>
                    <li>Cleaned and integrated historical match data</li>
                    <li>Collaborated with stakeholders in high-performance environment</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
