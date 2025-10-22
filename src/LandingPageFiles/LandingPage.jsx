import React, { useState } from 'react';
import './landing.css';



function LandingPage() {
  const [activeModal, setActiveModal] = useState(null);

  const activities = [
    {
      id: 'jam',
      title: 'JAM Sessions',
      description: 'Just A Minute speaking sessions to improve spontaneous communication',
      icon: <img src="https://cdn2.iconfinder.com/data/icons/timer-flat/64/timer-11-512.png" alt="timer" style={{ width: 80, height: 75 }} />,
      color: '#aeb5c0ff'
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation Test',
      description: 'Perfect your pronunciation with AI-powered feedback',
      icon: <img src="https://cdn1.iconfinder.com/data/icons/miscellaneous-306-solid/128/accent_pronunciation_talk_pronouncing_diction_parlance_language-128.png" alt="timer" style={{ width: 70, height: 70 }} />,
      color: '#aeb5c0ff'
    },
    {
      id: 'image',
      title: 'Image-Based Speaking',
      description: 'Describe images to enhance vocabulary and fluency',
      icon: <img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-128.png" alt="timer" style={{ width: 80, height: 75 }} />,
      color: '#aeb5c0ff'
    },
    {
      id: 'story',
      title: 'Story Building',
      description: 'Create and narrate stories to boost creative communication',
      icon: <img src="https://cdn2.iconfinder.com/data/icons/refugee-crisis/64/storytelling-story-teach-method-plan-128.png" alt="timer" style={{ width: 80, height: 75 }} />,
      color: '#aeb5c0ff'
    }
  ];

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">Skill Route</span>
            <div className="nav-links">
              <a href="#home">Home</a>
              <a href="#features">Features</a>
              <a href="#activities">Activities</a>
              <a href="#pricing">Pricing</a>
              <a href="#contact">Contact</a>    
            </div>       
          </div>

          <div className="auth-buttons">
            <button className="btn-signup" onClick={() => { window.location.href = '/signup'; }}>Get started now !</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Speak with AI first,<br></br>Speak with Confidence next with world!...</h1>
            <p>Transform your communication skills with AI-powered speaking practice, personalized feedback, and interactive learning experiences designed for students and professionals.</p>
            <div className="hero-buttons">
              <button className="btn-start"
                      onClick={() => { window.location.href = '/signup'; }}
                      >Get Started
              </button>
              
              <h2 style={{color:"wheat"}}> - Speak you first word now!...</h2>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card">
              <div className="card-icon">🎯</div>
              <div className="card-text">
                <h4>AI Feedback</h4>
                <p>Real-time analysis</p>
              </div>
            </div>
            <div className="floating-card">
              <div className="card-icon">📈</div>
              <div className="card-text">
                <h4>Progress Tracking</h4>
                <p>Visual insights</p>
              </div>
            </div>
            <div className="floating-card">
              <div className="card-icon">🏆</div>
              <div className="card-text">
                <h4>Achievements</h4>
                <p>Milestone rewards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">25%+</div>
            <div className="stat-label">Improvement in 6 weeks</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Active learners</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.8/5</div>
            <div className="stat-label">Student rating</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Practice activities</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-header">
          <h2>How Skill Route Works</h2>
          <p>Three simple steps to transform your communication skills</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-number">01</div>
            <div className="feature-icon">📊</div>
            <h3>Assess Your Level</h3>
            <p>Take our comprehensive assessment to understand your current speaking abilities and get personalized recommendations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">02</div>
            <div className="feature-icon">🎯</div>
            <h3>Practice Daily</h3>
            <p>Engage with interactive activities, JAM sessions, and AI-powered exercises tailored to your learning goals.</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">03</div>
            <div className="feature-icon">📈</div>
            <h3>Track Progress</h3>
            <p>Monitor your improvement with detailed analytics, feedback, and milestone achievements to stay motivated.</p>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="activities">
        <div className="section-header">
          <h2>Interactive Learning Activities</h2>
          <p>Discover engaging ways to practice and improve your communication skills</p>
        </div>
        <div className="activities-grid">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="activity-card"
              onClick={() => setActiveModal(activity.id)}
            >
              <div className="activity-icon" style={{ backgroundColor: activity.color }}>
                {activity.icon}
              </div>
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
              <button className="activity-btn">
                Try Now <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="section-header">
          <h2>Choose Your Learning Path</h2>
          <p>Flexible plans designed for every learner's needs</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="plan-badge">Free</div>
            <div className="plan-price">
              <span className="currency">$</span>
              <span className="amount">0</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features">
              <li>✓ Basic JAM sessions</li>
              <li>✓ Limited AI feedback</li>
              <li>✓ Progress tracking</li>
              <li>✗ Advanced analytics</li>
              <li>✗ Premium activities</li>
            </ul>
            <button className="plan-btn">Start Free</button>
          </div>
          
          <div className="pricing-card featured">
            <div className="plan-badge popular">Most Popular</div>
            <div className="plan-price">
              <span className="currency">$</span>
              <span className="amount">9</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features">
              <li>✓ All free features</li>
              <li>✓ Advanced AI feedback</li>
              <li>✓ All practice activities</li>
              <li>✓ Detailed analytics</li>
              <li>✓ Priority support</li>
            </ul>
            <button className="plan-btn">Upgrade Now</button>
          </div>
          
          <div className="pricing-card">
            <div className="plan-badge">Premium</div>
            <div className="plan-price">
              <span className="currency">$</span>
              <span className="amount">19</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features">
              <li>✓ Everything in Pro</li>
              <li>✓ 1-on-1 coaching</li>
              <li>✓ Custom learning paths</li>
              <li>✓ Certification prep</li>
              <li>✓ 24/7 support</li>
            </ul>
            <button className="plan-btn">Go Premium</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Communication Skills?</h2>
          <p>Join thousands of learners who have improved their speaking confidence with Skill Route</p>
          <button className="btn-profile">
            <span className="sparkle">✨</span>
            Complete Your Profile
            <div className="btn-glow"></div>
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Have questions? We're here to help you on your learning journey.</p>
            <div className="contact-methods">
              <div className="contact-method">
                <span className="method-icon">📧</span>
                <span>support@skillroute.com</span>
              </div>
              <div className="contact-method">
                <span className="method-icon">💬</span>
                <span>Live Chat Support</span>
              </div>
              <div className="contact-method">
                <span className="method-icon">📱</span>
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <form>
              <input type="text" placeholder="Your Name" />
              <input type="email" placeholder="Your Email" />
              <textarea placeholder="Your Message" rows="4"></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">🚀</span>
              <span className="logo-text">Skill Route</span>
            </div>
            <p>Empowering learners worldwide with AI-driven communication skills.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#activities">Activities</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="link-group">
              <h4>Support</h4>
              <a href="#contact">Contact</a>
              <a href="#help">Help Center</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
              <a href="#privacy">Privacy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Skill Route. All rights reserved.</p>
        </div>
      </footer>

      {/* Activity Modals */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal(null)}>×</button>
            <div className="modal-body">
              <h3>{activities.find(a => a.id === activeModal)?.title}</h3>
              <p>{activities.find(a => a.id === activeModal)?.description}</p>
              <button className="modal-btn">Start Activity</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;