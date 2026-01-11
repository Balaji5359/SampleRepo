import React, { useState, useEffect } from 'react';
import './landing.css';

function LandingPage() {
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.stats, .features, .activities, .pricing');
    animateElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const apiUrl = 'https://nrkg7cmta3.execute-api.ap-south-1.amazonaws.com/dev/skillroute_landingpagecontactsection_api';
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        })
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage('Your message has been received! Thank you from Skill-Route');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('API Error:', error);
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activities = [
    {
      id: 'jam',
      title: 'JAM Sessions',
      description: 'Just A Minute speaking sessions to improve spontaneous communication',
      icon: <img src="https://cdn2.iconfinder.com/data/icons/timer-flat/64/timer-11-512.png" alt="timer" style={{ width: 50, height: 50 }} />
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation Test',
      description: 'Perfect your pronunciation with AI-powered feedback',
      icon: <img src="https://cdn1.iconfinder.com/data/icons/miscellaneous-306-solid/128/accent_pronunciation_talk_pronouncing_diction_parlance_language-128.png" alt="pronunciation" style={{ width: 50, height: 50 }} />
    },
    {
      id: 'listening',
      title: 'Listening Test',
      description: 'Enhance comprehension with interactive listening exercises',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 13a9 9 0 0118 0v4a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3" />
          <path d="M7 13v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4" opacity="0.9"/>
          <path d="M21 10a7 7 0 00-18 0" />
        </svg>
      )
    },
    {
      id : 'situational',
      title: 'Situational Speaking',
      description: 'Practice real-life scenarios to build confidence',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-label="situational speaking">
          <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          <path d="M7 8h8M7 12h5" />
        </svg>
      )
    },
    {
      id: 'image',
      title: 'Image-Based Speaking',
      description: 'Describe images to enhance vocabulary and fluency',
      icon: <img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-128.png" alt="image" style={{ width: 50, height: 50 }} />
    },
    {
      id: 'image-story',
      title: 'Image-Based Story Telling',
      description: 'Expand your vocabulary with interactive learning exercises',
      icon: <img src="https://cdn1.iconfinder.com/data/icons/language-courses-3/504/vocabulary-language-translate-studying-learn-128.png" alt="vocabulary" style={{ width: 50, height: 50 }} />
    }
  ];

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-text">Skill Route</span>
            <div className="nav-links">
              <a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
              <a href="#features" onClick={(e) => handleNavClick(e, 'features')}>Features</a>
              <a href="#activities" onClick={(e) => handleNavClick(e, 'activities')}>Activities</a>
              <a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')}>Pricing</a>
              <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
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
            <h1>Speak with TaraAI, Speak with Confidence</h1>
            <p>Enhance your communication skills with AI-driven practice, personalized feedback, and engaging learning experiences for students and professionals.</p>
            <div className="hero-buttons">
              <button className="btn-start"
                      onClick={() => { window.location.href = '/signup'; }}
                      >Get Started
              </button>
              <h2 style={{color:"#392103ff", fontWeight: "bold", textShadow: "2px 2px 4px rgba(0,0,0,0.3)"}}>- Speak your first word now!</h2>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card">
              <div className="card-icon"><img src="https://cdn0.iconfinder.com/data/icons/business-management-3-4/256/m-21-128.png" alt="progress" style={{ width: 40, height: 40 }} /></div>
              <div className="card-text">
                <h4>Progress Tracking</h4>
                <p>Visual insights</p>
              </div>
            </div>
            <div className="floating-card">
              <div className="card-icon"><img src="https://cdn0.iconfinder.com/data/icons/business-startup-10/50/33-128.png" alt="achievements" style={{ width: 40, height: 40 }} /></div>
              <div className="card-text">
                <h4>Achievements</h4>
                <p>Milestone rewards</p>
              </div>
            </div>
            <div className="floating-card">
              <div className="card-icon"><img src="https://cdn2.iconfinder.com/data/icons/artificial-intelligence-6/64/ArtificialIntelligence5-128.png" alt="speak with ai" style={{ width: 40, height: 40 }} /></div>
              <div className="card-text">
                <h4>Speak with AI</h4>
                <p>Voice interaction</p>
              </div>
            </div>
            <div className="floating-card">
              <div className="card-icon"><img src="https://cdn2.iconfinder.com/data/icons/xomo-basics/128/document-05-128.png" alt="feedback" style={{ width: 40, height: 40 }} /></div>
              <div className="card-text">
                <h4>AI Feedback</h4>
                <p>Real-time analysis</p>
              </div>
            </div>
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
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>ACCESS TARA</h3>
            <p>Sign up to access TARA and get personalized feedback made just for you!</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">02</div>
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3>Practice Daily</h3>
            <p>Engage with interactive activities, JAM sessions,Image-Based Speaking and AI-powered exercises to your learning goals.</p>
          </div>
          <div className="feature-card">
            <div className="feature-number">03</div>
            <div className="feature-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
              </svg>
            </div>
            <h3>Track Progress</h3>
            <p>Monitor your improvement with detailed analytics, feedback, and milestone achievements to stay motivated.</p>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="activities">
        <div className="section-header">
          <h2>Interactive Learning Activities</h2>
          <p>Access TARA to practice and improve your communication skills through interactive activities.</p>
        </div>
        <div className="activities-grid">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="activity-card"
              onClick={() => setActiveModal(activity.id)}
            >
              <div className="activity-icon">
                {activity.icon}
              </div>
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
              <button className="activity-btn">
                WATCH DEMO <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Interview Activities Roadmap Section */}
      <section id="interview-activities" className="interview-roadmap">
        <div className="section-header">
          <h2>Interview Activities Path</h2>
          <p>Master your interview skills step by step with our structured learning path</p>
        </div>
        
        {/* Basic Interview Skills */}
        <div className="roadmap-section">
          <div className="section-title">
            <h3>Basic Interview Skills</h3>
          </div>
          
          {/* Row 1: Left to Right */}
          <div className="roadmap-row">
            <div className="roadmap-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>JD-Based Self Introduction</h4>
              </div>
            </div>
            <div className="roadmap-connector horizontal"></div>
            <div className="roadmap-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Programming Knowledge</h4>
              </div>
            </div>
            <div className="roadmap-connector horizontal"></div>
            <div className="roadmap-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Worked Domain</h4>
              </div>
            </div>
          </div>
          
          {/* Vertical Connector */}
          <div className="roadmap-connector vertical-center"></div>
          
          {/* Row 2: Right to Left */}
          <div className="roadmap-row reverse">
            <div className="roadmap-step">
              <div className="step-number">6</div>
              <div className="step-content">
                <h4>Hobbies & Interests</h4>
              </div>
            </div>
            <div className="roadmap-connector horizontal reverse"></div>
            <div className="roadmap-step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h4>Future Career Planning</h4>
              </div>
            </div>
            <div className="roadmap-connector horizontal reverse"></div>
            <div className="roadmap-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Project Discussion</h4>
              </div>
            </div>
          </div>
          
          {/* Vertical Connector */}
          <div className="roadmap-connector vertical-center"></div>
          
          {/* Row 3: Left to Right */}
          <div className="roadmap-row">
            <div className="roadmap-step">
              <div className="step-number">7</div>
              <div className="step-content">
                <h4>Certifications & Internships</h4>
              </div>
            </div>
          </div>
        </div>
        
        {/* Advanced Interview Skills */}
        <div className="roadmap-section">
          <div className="section-title">
            <h3>Advanced Interview Skills</h3>
          </div>
          
          {/* Vertical Connector from Basic to Advanced */}
          <div className="roadmap-connector vertical-center"></div>
          
          {/* Row 1: Left to Right */}
          <div className="roadmap-row">
            <div className="roadmap-step">
              <div className="step-number">8</div>
              <div className="step-content">
                <h4>Role-Based Interview</h4>
              </div>
            </div>
            <div className="roadmap-connector horizontal"></div>
            <div className="roadmap-step">
              <div className="step-number">9</div>
              <div className="step-content">
                <h4>Resume-Based Interview</h4>
              </div>
            </div>
            <div className="roadmap-connector horizontal"></div>
            <div className="roadmap-step">
              <div className="step-number">10</div>
              <div className="step-content">
                <h4>Technical Interview</h4>
              </div>
            </div>
          </div>
          
          {/* Vertical Connector */}
          <div className="roadmap-connector vertical-center"></div>
          
          {/* Row 2: Right to Left */}
          <div className="roadmap-row reverse">
            <div className="roadmap-step">
              <div className="step-number">13</div>
              <div className="step-content">
                <h4>Logical Puzzles</h4>
              </div>
            </div>
            <div className="roadmap-connector horizontal reverse"></div>
            <div className="roadmap-step">
              <div className="step-number">12</div>
              <div className="step-content">
                <h4>Stress/Pressure Questions</h4>
              </div>
            </div>
            <div className="roadmap-connector horizontal reverse"></div>
            <div className="roadmap-step">
              <div className="step-number">11</div>
              <div className="step-content">
                <h4>Follow-Up Questioning</h4>
              </div>
            </div>
          </div>
        </div>
        
        <div className="roadmap-progress">
          <div className="progress-indicator">
            <div className="progress-bar"></div>
            <div className="progress-text">Complete Your Interview Journey</div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="section-header">
          <h2>Choose Your Learning Path</h2>
          <p>Flexible plans designed for every learner's needs</p>
        </div>
        <div className="pricing-container">
          <div className="pricing-card">
            <div className="plan-badge">Free</div>
            <div className="plan-price">
              <span className="currency"><img src="https://cdn0.iconfinder.com/data/icons/business-469/28/Rupee_Rupees_Currency_Symbol_Money_Indian-Currency-512.png" alt="rupee" style={{ width: 20, height: 20 }} /></span>
              <span className="amount">0</span>
              <span className="period">/Free Trail</span>
            </div>
            <ul className="plan-features">
              <li>✓ 1-Free trail for JAM </li>
              <li>✓ 1-Free trail for Image-Based Speaking </li>
              <li>✓ Limited AI feedback</li>
              <li>✓ Progress tracking</li>
              <li>✗ Advanced analytics</li>
              <li>✗ Premium activities</li>
            </ul>
            <button className="plan-btn">Start Free</button>
          </div>
          
          <div className="pricing-card">
            <div className="plan-badge">1 Month</div>
            <div className="plan-price">
              <span className="currency"><img src="https://cdn0.iconfinder.com/data/icons/business-469/28/Rupee_Rupees_Currency_Symbol_Money_Indian-Currency-512.png" alt="rupee" style={{ width: 20, height: 20 }} /></span>
              <span className="amount">199</span>
              <span className="period">/1 month</span>
            </div>
            <ul className="plan-features">
              <li>✓ Access to all activities</li>
              <li>✓ 1-free trail for every Test</li>
              <li>✓ 10 min of free practise sessions for every activity</li>
              <li>✓ 2-free trails for Image-Based Speaking</li>
              <li>✓ Basic AI feedback</li>
              <li>✓ Progress tracking</li>
            </ul>
            <button className="plan-btn">Get Started</button>
          </div>
          
          <div className="pricing-card featured">
            <div className="plan-badge popular">Most Popular</div>
            <div className="plan-price">
              <span className="currency"><img src="https://cdn0.iconfinder.com/data/icons/business-469/28/Rupee_Rupees_Currency_Symbol_Money_Indian-Currency-512.png" alt="rupee" style={{ width: 20, height: 20 }} /></span>
              <span className="amount">499</span>
              <span className="period">/3 months</span>
            </div>
            <ul className="plan-features">
              <li>✓ Access to all activities </li>
              <li>✓ 2-free trails for every Test</li>
              <li>✓ 20 min of free practise sessions for every activity</li>
              <li>✓ Only 3-free trails for Image-Based Speaking practise sessions</li>
              <li>✓ Advanced AI feedback</li>
              <li>✓ Detailed analytics</li>
              <li>✓ Progress tracking</li>
            </ul>
            <button className="plan-btn">Upgrade Now</button>
          </div>
          
          <div className="pricing-card">
            <div className="plan-badge">Premium</div>
            <div className="plan-price">
              <span className="currency"><img src="https://cdn0.iconfinder.com/data/icons/business-469/28/Rupee_Rupees_Currency_Symbol_Money_Indian-Currency-512.png" alt="rupee" style={{ width: 20, height: 20 }} /></span>
              <span className="amount">1399</span>
              <span className="period">/1 Year🌟</span>
            </div>
            <ul className="plan-features">
              <li>✓ Everything in Pro</li>
              <li>✓ 2-free trails for every Test</li>
              <li>✓ 40 min of free practise sessions for every activity</li>
              <li>✓ 5-free trails for Image-Based Speaking practise sessions</li>
              <li>✓ Advanced AI feedback</li>
              <li>✓ 24/7 support</li>
            </ul>
            <button className="plan-btn">Go Premium</button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Connect with us through our professional channels. We're here to help you on your learning journey.</p>
            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B9797" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </div>
                <div className="method-details">
                  <h4>LinkedIn</h4>
                  <span>linkedin.com/company/skillroute</span>
                </div>
              </div>
              <div className="contact-method">
                <div className="method-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B9797" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div className="method-details">
                  <h4>Email</h4>
                  <span>support@skillroute.com</span>
                </div>
              </div>
              <div className="contact-method">
                <div className="method-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B9797" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div className="method-details">
                  <h4>Phone</h4>
                  <span>+91 9876543210</span>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Your Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input 
                type="email" 
                placeholder="Your Email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <textarea 
                placeholder="Your Message" 
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              ></textarea>
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              {submitMessage && <p className="submit-message">{submitMessage}</p>}
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
            <p>📍 MADANAPALLE-517325 </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Skill-Route. All rights reserved.</p>
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