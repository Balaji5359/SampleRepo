import { useState } from 'react';
import '../styles/landing.css';

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="landing">
      {/* Header / Navbar */}
      <header className="header">
        <div className="container header-content">
          <a href="#" className="logo">
            <div className="logo-icon">S</div>
            <span>Skill Route</span>
          </a>

          <button 
            className="nav-toggle" 
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav-menu ${menuOpen ? 'active' : ''}`}>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#activities" className="nav-link">Activities</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="#contact" className="nav-link">Contact</a>
            <button className="btn btn-primary">Get Started</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-badge">
                <span className="hero-badge-dot"></span>
                AI-Powered Learning
              </div>
              <h1 className="hero-title">
                Speak with TaraAI, <br />
                <span className="hero-title-highlight">Speak with Confidence</span>
              </h1>
              <p className="hero-description">
                Enhance your communication skills with AI-driven practice sessions, 
                real-time feedback, and personalized learning paths tailored just for you.
              </p>
              <div className="hero-actions">
                <button className="btn btn-primary btn-lg">
                  Start Learning Free
                </button>
                <button className="btn btn-outline btn-lg">
                  → Watch Demo
                </button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image-container">
                <div className="hero-image" style={{
                  background: 'linear-gradient(135deg, hsl(168, 76%, 90%) 0%, hsl(168, 76%, 80%) 100%)',
                  height: '400px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem'
                }}>
                  🎯
                </div>
                <div className="hero-floating-card top-right">
                  <div className="hero-floating-icon">📊</div>
                  <div>
                    <strong>Track Progress</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Real-time analytics</div>
                  </div>
                </div>
                <div className="hero-floating-card bottom-left">
                  <div className="hero-floating-icon">💬</div>
                  <div>
                    <strong>AI Feedback</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>Instant responses</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section how-it-works" id="how-it-works">
        <div className="container">
          <h2 className="section-title">How Skill Route Works</h2>
          <p className="section-subtitle">
            A simple four-step process to transform your communication skills
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Access Tasks</h3>
              <p className="feature-description">
                Get personalized learning tasks based on your skill level and goals.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎙️</div>
              <h3 className="feature-title">Practice Daily</h3>
              <p className="feature-description">
                Engage in daily speaking exercises with our AI-powered conversation partner.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3 className="feature-title">Track Progress</h3>
              <p className="feature-description">
                Monitor your improvement with detailed analytics and progress reports.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3 className="feature-title">Earn Rewards</h3>
              <p className="feature-description">
                Complete milestones and earn badges as you master new skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Learning Activities */}
      <section className="section learning-activities" id="activities">
        <div className="container">
          <h2 className="section-title">Interactive Learning Activities</h2>
          <p className="section-subtitle">
            Explore our range of AI-powered learning activities designed to boost your confidence
          </p>

          <div className="activities-grid">
            <div className="activity-card">
              <div className="activity-icon">💬</div>
              <h3 className="activity-title">Skill Surveys</h3>
              <p className="activity-description">
                Assess your current skill level with comprehensive surveys tailored to your goals.
              </p>
              <button className="btn btn-primary">Start Survey</button>
            </div>

            <div className="activity-card">
              <div className="activity-icon">🎤</div>
              <h3 className="activity-title">Pronunciation Test</h3>
              <p className="activity-description">
                Perfect your pronunciation with real-time AI feedback and correction.
              </p>
              <button className="btn btn-primary">Practice Now</button>
            </div>

            <div className="activity-card">
              <div className="activity-icon">📚</div>
              <h3 className="activity-title">Vocabulary Building</h3>
              <p className="activity-description">
                Expand your vocabulary with contextual learning and spaced repetition.
              </p>
              <button className="btn btn-primary">Learn Words</button>
            </div>

            <div className="activity-card">
              <div className="activity-icon">🖼️</div>
              <h3 className="activity-title">Image-Based Speaking</h3>
              <p className="activity-description">
                Describe images and scenarios to improve your descriptive abilities.
              </p>
              <button className="btn btn-primary">Try Activity</button>
            </div>

            <div className="activity-card">
              <div className="activity-icon">📖</div>
              <h3 className="activity-title">Story Telling</h3>
              <p className="activity-description">
                Create and narrate stories to enhance your narrative communication skills.
              </p>
              <button className="btn btn-primary">Tell Stories</button>
            </div>

            <div className="activity-card">
              <div className="activity-icon">🎭</div>
              <h3 className="activity-title">Role Play Sessions</h3>
              <p className="activity-description">
                Practice real-world scenarios with our AI in simulated conversations.
              </p>
              <button className="btn btn-primary">Start Role Play</button>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Activities Path */}
      <section className="section interview-path">
        <div className="container">
          <h2 className="section-title">Interview Activities Path</h2>
          <p className="section-subtitle">
            Master your interview skills with our structured learning pathway
          </p>

          <div className="path-category">
            <h3 className="path-category-title">Basic Interview Skills</h3>
            <div className="path-steps">
              <div className="path-step">
                <div className="path-step-icon">👋</div>
                <div className="path-step-title">Self Introduction</div>
              </div>
              <div className="path-connector"></div>
              <div className="path-step">
                <div className="path-step-icon">💡</div>
                <div className="path-step-title">Common Questions</div>
              </div>
              <div className="path-connector"></div>
              <div className="path-step">
                <div className="path-step-icon">🎯</div>
                <div className="path-step-title">Body Language</div>
              </div>
              <div className="path-connector"></div>
              <div className="path-step">
                <div className="path-step-icon">📝</div>
                <div className="path-step-title">Mock Interview</div>
              </div>
            </div>
          </div>

          <div className="path-category">
            <h3 className="path-category-title">Advanced Interview Skills</h3>
            <div className="path-steps">
              <div className="path-step">
                <div className="path-step-icon">🧠</div>
                <div className="path-step-title">Behavioral Questions</div>
              </div>
              <div className="path-connector"></div>
              <div className="path-step">
                <div className="path-step-icon">💼</div>
                <div className="path-step-title">Case Studies</div>
              </div>
              <div className="path-connector"></div>
              <div className="path-step">
                <div className="path-step-icon">🎤</div>
                <div className="path-step-title">Technical Rounds</div>
              </div>
              <div className="path-connector"></div>
              <div className="path-step">
                <div className="path-step-icon">🏆</div>
                <div className="path-step-title">Final Assessment</div>
              </div>
            </div>
          </div>

          <div className="path-cta">
            <button className="btn btn-primary btn-lg">
              Start Your Interview Journey
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section pricing" id="pricing">
        <div className="container">
          <h2 className="section-title">Choose Your Learning Path</h2>
          <p className="section-subtitle">
            Flexible plans designed to fit your learning goals and budget
          </p>

          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Free</h3>
                <div className="pricing-price">
                  £0<span>/month</span>
                </div>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>5 AI conversations daily</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Basic progress tracking</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Community access</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Email support</span>
                </div>
              </div>
              <button className="btn btn-outline">Try Free</button>
            </div>

            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Starter</h3>
                <div className="pricing-price">
                  £99<span>/month</span>
                </div>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Unlimited AI conversations</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Detailed analytics</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Pronunciation feedback</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Priority support</span>
                </div>
              </div>
              <button className="btn btn-secondary">Learn More</button>
            </div>

            <div className="pricing-card featured">
              <div className="pricing-badge">Most Popular</div>
              <div className="pricing-header">
                <h3 className="pricing-name">Pro</h3>
                <div className="pricing-price">
                  £249<span>/month</span>
                </div>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Everything in Starter</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Interview simulations</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>1-on-1 coaching session</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Custom learning paths</span>
                </div>
              </div>
              <button className="btn btn-primary">Upgrade Now</button>
            </div>

            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-name">Enterprise</h3>
                <div className="pricing-price">
                  £699<span>/month</span>
                </div>
              </div>
              <div className="pricing-features">
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Everything in Pro</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Team management</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>API access</span>
                </div>
                <div className="pricing-feature">
                  <span className="pricing-feature-icon">✓</span>
                  <span>Dedicated account manager</span>
                </div>
              </div>
              <button className="btn btn-secondary">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section contact" id="contact">
        <div className="container">
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-subtitle">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>

          <div className="contact-content">
            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="form-input" 
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input" 
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone (Optional)</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="form-input" 
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea 
                  id="message" 
                  className="form-textarea" 
                  placeholder="Write your message here..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-lg">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <div className="logo-icon">S</div>
              <span>Skill Route</span>
            </div>

            <nav className="footer-links">
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Contact Us</a>
            </nav>
          </div>

          <div className="footer-divider"></div>

          <div className="footer-content">
            <p className="footer-bottom">
              © 2024 Skill Route. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
