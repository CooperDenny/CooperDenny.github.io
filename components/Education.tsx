export default function Education() {
  return (
    <section id="education" className="section bg-light">
      <div className="container">
        <div className="section-header">
          <h2>Education</h2>
        </div>

        <div className="education-card">
          <div className="education-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Monash_University_logo.svg"
              alt="Monash University Logo"
            />
          </div>
          <div className="education-content">
            <h3>Bachelor of Applied Data Science</h3>
            <p className="education-institution">Monash University</p>
            <p className="education-period">Feb 2021 - Jun 2024</p>
            <div className="education-details">
              <div className="detail-item">
                <strong>GPA:</strong> 3.292 | <strong>WAM:</strong> 77.600
              </div>
              <p>
                Acquired skills in R and Python, data analysis, data visualisation, machine
                learning, and mathematical modelling. Developed the ability to present complex
                data science projects clearly and concisely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
