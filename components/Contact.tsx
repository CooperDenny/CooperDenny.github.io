import { siteConfig } from '@/config/site';

export default function Contact() {
  const { email, linkedin, github, twitter } = siteConfig.social;

  return (
    <section id="contact" className="section contact-dark">
      <div className="container">
        <div className="contact-hero">
          <div className="contact-content">
            <h2>Ready to Connect?</h2>
            <p>If you&apos;ve made it this far, let&apos;s have a chat!</p>
          </div>

          <div className="contact-methods">
            <a href={`mailto:${email}`} className="contact-method">
              <div className="method-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="method-info">
                <h3>Email</h3>
                <span>{email}</span>
              </div>
            </a>

            <a href={linkedin} className="contact-method">
              <div className="method-icon">
                <i className="fab fa-linkedin"></i>
              </div>
              <div className="method-info">
                <h3>LinkedIn</h3>
                <span>/in/cooperdenny/</span>
              </div>
            </a>

            <a href={github} className="contact-method">
              <div className="method-icon">
                <i className="fab fa-github"></i>
              </div>
              <div className="method-info">
                <h3>GitHub</h3>
                <span>@CooperDenny</span>
              </div>
            </a>

            <a href={twitter} className="contact-method">
              <div className="method-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div className="method-info">
                <h3>X</h3>
                <span>@CooperCDenny</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
