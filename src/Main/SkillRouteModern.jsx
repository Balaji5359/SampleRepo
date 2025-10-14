import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SkillRouteModern.css';

const SkillRouteModern = () => {
  const [theme, setTheme] = useState('light');
  const [scrolled, setScrolled] = useState(false);
  const [activeModule, setActiveModule] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const modules = [
    {
      id: 'jam',
      title: 'JAM Session',
      description: 'Just A Minute speaking challenges',
      icon: '🎤',
      progress: 75,
      color: '#6366f1'
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation Test',
      description: 'AI-powered speech analysis',
      icon: '🗣️',
      progress: 60,
      color: '#8b5cf6'
    },
    {
      id: 'story',
      title: 'Story Builder',
      description: 'Creative storytelling exercises',
      icon: '📚',
      progress: 45,
      color: '#06b6d4'
    },
    {
      id: 'interview',
      title: 'Mock Interview',
      description: 'AI interview simulation',
      icon: '💼',
      progress: 30,
      color: '#10b981'
    }
  ];

  const leaderboard = [
    { name: 'Alex Chen', score: 2450, avatar: '👨‍💻' },
    { name: 'Sarah Kim', score: 2380, avatar: '👩‍🎓' },
    { name: 'Mike Johnson', score: 2290, avatar: '👨‍🚀' },
    { name: 'Emma Davis', score: 2150, avatar: '👩‍💼' }
  ];

  const motivationalQuotes = [
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Innovation distinguishes between a leader and a follower.",
    "Your limitation—it's only your imagination."
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`skill-route-modern ${theme}`}>
      {/* Header */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">Skill Route</span>
          </div>
          
          <nav className="nav-menu">
            <a href="#dashboard" className="nav-link">Dashboard</a>
            <a href="#modules" className="nav-link">Modules</a>
            <a href="#progress" className="nav-link">Progress</a>
            <a href="#leaderboard" className="nav-link">Leaderboard</a>
          </nav>

          <div className="header-actions">
            <button className="theme-toggle" onClick={toggleTheme}>
              <span className="toggle-slider">
                <span className="toggle-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
              </span>
            </button>
            <div className="user-profile">
              <span className="user-avatar">👤</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="dashboard">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Master Your Skills with
              <span className="gradient-text"> AI Guidance</span>
            </h1>
            <p className="hero-subtitle">
              Personalized learning paths, real-time feedback, and career guidance powered by advanced AI
            </p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn-primary">
                <span>Get Started</span>
                <span className="btn-icon">→</span>
              </Link>
              <button className="btn-secondary">
                <span>Watch Demo</span>
                <span className="btn-icon">▶</span>
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="floating-card">
              <div className="progress-ring">
                <svg className="progress-svg" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" className="progress-bg"/>
                  <circle cx="50" cy="50" r="45" className="progress-fill" style={{strokeDasharray: `${75 * 2.83} 283`}}/>
                </svg>
                <div className="progress-text">75%</div>
              </div>
              <p className="card-text">Overall Progress</p>
            </div>
          </div>
        </div>

        <div className="motivational-quote">
          <p className="quote-text">{motivationalQuotes[currentQuote]}</p>
        </div>
      </section>

      {/* Modules Section */}
      <section className="modules-section" id="modules">
        <div className="section-header">
          <h2 className="section-title">Practice Modules</h2>
          <p className="section-subtitle">Choose your learning path and start improving</p>
        </div>

        <div className="modules-grid">
          {modules.map((module) => (
            <div 
              key={module.id}
              className={`module-card ${activeModule === module.id ? 'active' : ''}`}
              onMouseEnter={() => setActiveModule(module.id)}
              onMouseLeave={() => setActiveModule(null)}
            >
              <div className="module-header">
                <div className="module-icon" style={{background: `${module.color}20`}}>
                  <span>{module.icon}</span>
                </div>
                <div className="module-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill-bar" 
                      style={{width: `${module.progress}%`, background: module.color}}
                    ></div>
                  </div>
                  <span className="progress-text">{module.progress}%</span>
                </div>
              </div>
              
              <h3 className="module-title">{module.title}</h3>
              <p className="module-description">{module.description}</p>
              
              <button className="module-btn" style={{background: module.color}}>
                Start Practice
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="stats-section" id="progress">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3 className="stat-number">1,247</h3>
              <p className="stat-label">Practice Sessions</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <h3 className="stat-number">89%</h3>
              <p className="stat-label">Success Rate</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h3 className="stat-number">24</h3>
              <p className="stat-label">Day Streak</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3 className="stat-number">156</h3>
              <p className="stat-label">Skills Mastered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="leaderboard-section" id="leaderboard">
        <div className="section-header">
          <h2 className="section-title">Top Performers</h2>
          <p className="section-subtitle">See how you rank among peers</p>
        </div>

        <div className="leaderboard-card">
          {leaderboard.map((user, index) => (
            <div key={index} className="leaderboard-item">
              <div className="rank-badge">
                <span className="rank-number">#{index + 1}</span>
              </div>
              <div className="user-info">
                <span className="user-avatar">{user.avatar}</span>
                <span className="user-name">{user.name}</span>
              </div>
              <div className="user-score">{user.score.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Career?</h2>
          <p className="cta-subtitle">Join thousands of learners who have already started their journey</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-primary large">
              Start Your Journey
            </Link>
            <Link to="/mentor" className="btn-outline large">
              Become a Mentor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkillRouteModern;