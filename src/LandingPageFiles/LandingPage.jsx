import React, { useState, useEffect } from 'react';
import './landing.css';
import logo from '../assets/logo.png';

function LandingPage() {
  const [activeModal, setActiveModal] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
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

  useEffect(() => {
    if (showPremiumModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPremiumModal]);

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

  const handleButtonClick = (planTag) => {
    if (planTag === "Free") {
      window.location.href = '/signup';
    } else {
      setShowPremiumModal(true);
    }
  };

  const plans = [
    {
      tag: "Free",
      price: "₹0",
      duration: "/Free Trail",
      button: "Try Free",
      highlight: false,
      features: [
        "✓ 2-Free Communication Tests - Basic Level",
        "✓ 1-Free trial for Image-Based Speaking",
        "✓ 1-Free trial for 3 Interview Modules - Basic",
        "✓ Limited AI feedback and Speech Analytics",
        "✗ Advanced interview & communication modules locked",
        "✓ AI Feedback on Every Attempt",
        "<h3>Your Progress tracking</h3>",
        "✗ Advanced analytics, Confident scores",
        "<h3>Premium Features</h3>",
        "✗ Audio replay & AI pronunciation insights",
        "✗ Advanced analytics dashboard",
        "✗ Leaderboards & streak rewards",
      ],
    },
    {
      tag: "1 Month",
      price: "₹99",
      duration: "/1 month",
      button: "Start 1-Month Plan",
      highlight: false,
      features: [
        "✓ 2 Communication Tests (Daily) - All Level",
        "✓ 1 Image-Based Speaking (Daily) - All Level",
        "✓ TaraAI-guided 2 practice modules daily",
        "✓ 2-free trials for Image-Based Speaking",
        "✓ Interview Modules Basic, Advance and communication all Levels - Unlock",
        "✓ AI Feedback on Every Attempt",
        "<h3>Your Progress tracking</h3>",
        "✓ Advanced analytics, Confident scores",
        "<h3>Premium Features</h3>",
        "✓ Audio replay & AI pronunciation insights",
        "✓ Advanced analytics dashboard",
        "✓ Leaderboards & streak rewards",
      ],
    },
    {
      tag: "Most Popular",
      price: "₹249",
      duration: "/3 months",
      button: "Upgrade Now",
      highlight: true,
      features: [
        "✓ 2 Communication Tests (Daily) - All Level",
        "✓ 1 Image-Based Speaking (Daily) - All Level",
        "✓ TaraAI-guided 2 practice modules daily",
        "✓ 2-free trials for Image-Based Speaking",
        "✓ Interview Modules Basic, Advance and communication all Levels - Unlock",
        "✓ AI Feedback on Every Attempt",
        "<h3>Your Progress tracking</h3>",
        "✓ Advanced analytics, Confident scores",
        "<h3>Premium Features</h3>",
        "✓ Audio replay & AI pronunciation insights",
        "✓ Advanced analytics dashboard",
        "✓ Leaderboards & streak rewards",
      ],
    },
    {
      tag: "Best Value",
      price: "₹699",
      duration: "/Year ✨",
      button: "Go Premium",
      highlight: false,
      features: [
        "✓ 2 Communication Tests (Daily) - All Level",
        "✓ 1 Image-Based Speaking (Daily) - All Level",
        "✓ TaraAI-guided 2 practice modules daily",
        "✓ 2-free trials for Image-Based Speaking",
        "✓ Interview Modules Basic, Advance and communication all Levels - Unlock",
        "✓ AI Feedback on Every Attempt",
        "<h3>Your Progress tracking</h3>",
        "✓ Advanced analytics, Confident scores",
        "<h3>Premium Features</h3>",
        "✓ Audio replay & AI pronunciation insights",
        "✓ Advanced analytics dashboard",
        "✓ Leaderboards & streak rewards",
      ],
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const apiUrl = import.meta.env.VITE_CONTACT_API_URL 
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
          <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: '-50px' }}>
            <img src={logo} alt="Skill Route logo" className="logo-img" style={{ width: 65, height: 60, borderRadius: '50%', border: 'none' }} />
            <span className="logo-text">Skill Route</span>
          </div>
          <div className="nav-links">
            <a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
            <a href="#features" onClick={(e) => handleNavClick(e, 'features')}>Features</a>
            <a href="#activities" onClick={(e) => handleNavClick(e, 'activities')}>Activities</a>
            <a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')}>Pricing</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
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
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Project Discussion</h4>
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
              <div className="step-number">6</div>
              <div className="step-content">
                <h4>Hobbies & Interests</h4>
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
              <div className="step-number">11</div>
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
              <div className="step-number">13</div>
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
      <section id="pricing" className="pricing" style={{ background: 'rgb(247, 247, 247)', padding: '6rem 2rem', top: '-220px' }}>
        <div className="section-header">
          <h2>Choose Your Learning Path</h2>
          <p>Flexible plans designed for every learner's needs</p>
        </div>

        <div className="pricing-container" style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)',
        }}>
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`pricing-card ${
                plan.highlight ? "featured" : ""
              }`}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                border: plan.highlight ? '2px solid #3B9797' : '1px solid rgba(255, 255, 255, 0.2)',
                flex: 1,
                transform: 'translateX(0) translateY(0)',
                opacity: 1,
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
            >
              <div style={{ marginBottom: '-1.2rem' }}>
                <span className={`plan-badge ${plan.highlight ? 'popular' : ''}`} style={{
                  background: plan.highlight ? 'linear-gradient(135deg, #3B9797, #5bb5b5)' : '#f1f5f9',
                  color: plan.highlight ? 'white' : '#000000',
                  padding: '0.5rem 1rem',
                  borderRadius: '16px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  display: 'inline-block'
                }}>
                  {plan.tag}
                </span>
                
                <div className="plan-price" style={{ marginBottom: '1.5rem' }}>
                  <span className="amount" style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: '#000000'
                  }}>{plan.price}</span>
                  <span className="period" style={{
                    fontSize: '1rem',
                    color: '#666',
                    marginLeft: '0.25rem'
                  }}>{plan.duration}</span>
                </div>
              </div>

              <ul className="plan-features" style={{
                listStyle: 'none',
                marginBottom: '2rem',
                textAlign: 'left',
                flex: 1,
                padding: 0
              }}>
                {plan.features.map((feature, i) => {
                  if (feature.startsWith('<h3>')) {
                    return (
                      <li key={i} style={{
                        color: '#3B9797',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        marginTop: '1rem',
                        marginBottom: '0.5rem',
                        textAlign: 'center'
                      }}>
                        <div dangerouslySetInnerHTML={{ __html: feature }} />
                      </li>
                    );
                  }
                  return (
                    <li key={i} style={{
                      color: '#000000',
                      fontSize: '0.8rem',
                      lineHeight: '1.4',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{
                        color: feature.startsWith('✓') ? '#3B9797' : '#ef4444',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginTop: '0.125rem',
                        flexShrink: 0
                      }}>
                        {feature.startsWith('✓') ? '✓' : '✗'}
                      </span>
                      <span>{feature.substring(2)}</span>
                    </li>
                  );
                })}
              </ul>

              <button
                onClick={() => handleButtonClick(plan.tag)}
                className="plan-btn"
                style={{
                  width: '100%',
                  marginTop: '-20px',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #3B9797, #5bb5b5)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(59, 151, 151, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {plan.button}
              </button>
            </div>
          ))}
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
                  <span>linkedin.com/rrbalaji</span>
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
                  <span>skillrouteai@gmail.com</span>
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
                  <span>+91 9398350217</span>
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
              <span className="logo-text">Skill Route</span>
            </div>
            <p>📍 India - Andhra Pradesh </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Skill-Route. All rights reserved.</p>
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

      {/* Premium Access Modal */}
      {showPremiumModal && (
        <div className="modal-overlay" onClick={() => setShowPremiumModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPremiumModal(false)}>×</button>
            <div className="modal-body">
              <h3>Premium Access Required</h3>
              <p>To access premium features and unlock your full learning potential, please follow our simple payment flow:</p>
              <div className="premium-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>New User?</h4>
                    <p>Sign up → Create Profile → Login → Access Profile & Buy Premium</p>
                  </div>
                </div>
                
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Existing User?</h4>
                    <p>Login → Access Profile Page → Buy Premium</p>
                  </div>
                </div>
              </div>
              
              <div className="premium-benefits">
                <h4>Premium Benefits:</h4>
                <ul>
                  <li>✓ Unlimited AI-powered practice sessions</li>
                  <li>✓ Advanced analytics & progress tracking</li>
                  <li>✓ All interview modules unlocked</li>
                  <li>✓ Premium feedback & pronunciation insights</li>
                </ul>
              </div>
              <center>
              <button className="modal-btn" onClick={() => window.location.href = '/signup'}>
                Proceed to Sign Up
              </button>
              </center>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;