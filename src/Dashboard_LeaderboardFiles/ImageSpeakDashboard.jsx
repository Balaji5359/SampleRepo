import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

function ImageSpeakDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('main');
  const [selectedSession, setSelectedSession] = useState(null);
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(false);
  const [userEmail] = useState(localStorage.getItem('email'));
  const [theme, setTheme] = useState('light');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [filteredSessions, setFilteredSessions] = useState([]);

  useEffect(() => {
    const root = document.documentElement;
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    if (theme === 'light') {
      document.body.style.background = 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)';
      root.style.setProperty('--bg-primary', 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)');
      root.style.setProperty('--bg-secondary', '#ffffff');
      root.style.setProperty('--text-primary', '#1f2937');
      root.style.setProperty('--text-muted', '#6b7280');
      root.style.setProperty('--accent-blue', '#0ea5e9');
      root.style.setProperty('--border-color', 'rgba(0,0,0,0.1)');
      root.style.setProperty('--card-bg', 'rgba(255,255,255,0.8)');
    } else if (theme === 'custom') {
      document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      root.style.setProperty('--bg-primary', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
      root.style.setProperty('--bg-secondary', 'rgba(255,255,255,0.1)');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-muted', 'rgba(255,255,255,0.8)');
      root.style.setProperty('--accent-blue', '#fbbf24');
      root.style.setProperty('--border-color', 'rgba(255,255,255,0.2)');
      root.style.setProperty('--card-bg', 'rgba(255,255,255,0.1)');
    } else {
      document.body.style.background = 'linear-gradient(180deg, #071028 0%, #07182b 60%)';
      root.style.setProperty('--bg-primary', 'linear-gradient(180deg, #071028 0%, #07182b 60%)');
      root.style.setProperty('--bg-secondary', '#0b1220');
      root.style.setProperty('--text-primary', '#e6eef8');
      root.style.setProperty('--text-muted', '#94a3b8');
      root.style.setProperty('--accent-blue', '#60a5fa');
      root.style.setProperty('--border-color', 'rgba(255,255,255,0.06)');
      root.style.setProperty('--card-bg', 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))');
    }
  }, [theme]);

  useEffect(() => {
    const fetchImageSpeakData = async () => {
      if (!userEmail) return;
      
      setLoading(true);
      try {
        const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_retrivalapi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            college_email: userEmail,
            test_type: 'IMAGETOSPEAK'
          })
        });
        
        const data = await response.json();
        const parsedData = JSON.parse(data.body);
        setApiData(parsedData);
      } catch (error) {
        console.error('Error fetching IMAGETOSPEAK data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchImageSpeakData();
  }, [userEmail]);

  useEffect(() => {
    if (!apiData.sessions) {
      setFilteredSessions([]);
      return;
    }

    let filtered = apiData.sessions.filter(session => {
      const matchesSearch = searchTerm === '' || 
        session.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(session.timestamp).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = dateFilter === '' || 
        new Date(session.timestamp).toDateString() === new Date(dateFilter).toDateString();
      
      return matchesSearch && matchesDate;
    });

    setFilteredSessions(filtered);
  }, [apiData.sessions, searchTerm, dateFilter]);

  const renderFilterHeader = () => (
    <div className="filter-header">
      <div className="filter-container">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by session ID or time..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="date-filter">
          <span className="filter-icon">📅</span>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="date-input"
          />
        </div>
        <button 
          className="clear-filters-btn"
          onClick={() => {
            setSearchTerm('');
            setDateFilter('');
          }}
        >
          Clear Filters
        </button>
      </div>
      <div className="results-count">
        {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} found
      </div>
    </div>
  );

  const renderSessionAnalytics = () => {
    const session = selectedSession;

    return (
      <div className="session-analytics-view">
        <div className="analytics-header">
          <button className="back-btn" onClick={() => setSelectedSession(null)}>← Back to Sessions</button>
          <h2>Image to Speak Analytics — {session.sessionId}</h2>
          <p className="analytics-subtitle">Image description analysis and feedback</p>
        </div>

        <div className="session-summary">
          <div className="summary-card">
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-label">Session Date:</span>
                <span className="stat-value">{new Date(session.timestamp).toLocaleString()}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Test Type:</span>
                <span className="stat-value">Image to Speak</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Session ID:</span>
                <span className="stat-value">{session.sessionId}</span>
              </div>
            </div>
          </div>
        </div><br></br>

        {/* Image and Audio Section */}
        <div className="analytics-grid-layout">
          <div className="analytics-left">
            <div className="analytics-card image-card">
              <h3>Image Prompt</h3>
              {session.images && session.images.length > 0 ? (
                <div className="media-container">
                  <img
                    src={session.images[0].url}
                    alt="Image prompt"
                    onLoad={() => console.log('✅ Image loaded successfully:', session.images[0].url)}
                    onError={(e) => {
                      console.error('❌ Image failed to load:', session.images[0].url);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <div className="media-error" style={{display: 'none'}}>
                    <div className="error-icon">🖼️</div>
                    <div className="error-text">Image not accessible</div>
                    <div className="error-suggestion">S3 bucket CORS policy blocks image access.</div>
                  </div>
                </div>
              ) : (
                <div className="no-media">
                  <div className="error-icon">📷</div>
                  <div className="error-text">No image available</div>
                </div>
              )}
            </div>

            <div className="analytics-card audio-card">
              <h3>Audio Recording</h3>
              {session.audioFiles && session.audioFiles.length > 0 ? (
                <div className="media-container">
                  <audio 
                    controls 
                    style={{width: '100%'}}
                    onLoadedData={() => console.log('✅ Audio loaded successfully:', session.audioFiles[0].url)}
                    onError={(e) => {
                      console.error('❌ Audio failed to load:', session.audioFiles[0].url);
                      const errorDiv = e.target.parentNode.querySelector('.media-error');
                      if (errorDiv) {
                        e.target.style.display = 'none';
                        errorDiv.style.display = 'block';
                      }
                    }}
                    onCanPlay={() => console.log('🎵 Audio ready to play')}
                    preload="none"
                  >
                    <source src={session.audioFiles[0].url} type="audio/webm" />
                    <source src={session.audioFiles[0].url} type="audio/mp4" />
                    <source src={session.audioFiles[0].url} type="audio/wav" />
                    <source src={session.audioFiles[0].url} type="audio/mpeg" />
                    Your browser does not support audio playback.
                  </audio>
                  <div className="media-error" style={{display: 'none'}}>
                    <div className="error-icon">🎵</div>
                    <div className="error-text">Audio file not accessible</div>
                    <div className="error-suggestion">S3 bucket CORS policy blocks audio access.</div>
                  </div>
                  <div className="audio-tip">
                    Listen to your image description recording
                  </div>
                </div>
              ) : (
                <div className="no-media">
                  <div className="error-icon">🎤</div>
                  <div className="error-text">No audio available</div>
                </div>
              )}
            </div>
          </div>

          <div className="analytics-right">
            {session.conversationHistory && session.conversationHistory.some(conv => conv.user) && (
              <div className="analytics-card user-description-card">
                <h3>Your Description</h3>
                <div className="description-content">
                  {session.conversationHistory.map((conv, idx) => (
                    conv.user && (
                      <p key={idx} className="user-text">{conv.user}</p>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Feedback Section */}
        {session.conversationHistory && session.conversationHistory.some(conv => conv.agent) && (
          <div className="feedback-section-bottom">
            <div className="analytics-card feedback-card">
              <h3>AI Feedback & Analysis</h3>
              <div className="feedback-content">
                {session.conversationHistory.map((conv, idx) => (
                  conv.agent && (
                    <div key={idx} className="feedback-item">
                      {conv.agent.split('\n').map((line, lineIdx) => (
                        line.trim() && <p key={lineIdx} className="feedback-line">{line}</p>
                      ))}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHistoryContent = () => {
    if (selectedSession) {
      return (
        <div className="session-analytics-view">
          <div className="analytics-header">
            <button className="back-btn" onClick={() => setSelectedSession(null)}>← Back to History</button>
            <h2>Image to Speak Conversation — {selectedSession.sessionId}</h2>
            <p className="analytics-subtitle">View complete conversation history</p>
          </div>

          <div className="analytics-card">
            <h3>Session Information</h3>
            <div className="session-info-header">
              <p><strong>Session ID:</strong> {selectedSession.sessionId}</p>
              <p><strong>Date:</strong> {new Date(selectedSession.timestamp).toLocaleString()}</p>
              <p><strong>Messages:</strong> {selectedSession.conversationHistory?.length || 0}</p>
            </div>
          </div>

          {selectedSession.conversationHistory && selectedSession.conversationHistory.length > 0 ? (
            <div className="analytics-card">
              <h3>Conversation History</h3>
              <div className="conversation-messages">
                {selectedSession.conversationHistory.map((conv, idx) => (
                  <div key={idx}>
                    {conv.user && (
                      <div className="message user">
                        <div className="message-sender">You</div>
                        <div className="message-text">{conv.user}</div>
                      </div>
                    )}
                    {conv.agent && (
                      <div className="message ai">
                        <div className="message-sender">AI Assistant</div>
                        <div className="message-text">
                          {conv.agent.split('\n').map((line, lineIdx) => (
                            line.trim() && <p key={lineIdx}>{line}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="analytics-card">
              <div className="no-data">No conversation history available for this session</div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div>
        <h2>Image to Speak History</h2>
        {renderFilterHeader()}
        {loading ? (
          <div className="loading">Loading sessions...</div>
        ) : (
          <div className="sessions-list">
            {filteredSessions.map(session => (
              <div 
                key={session.sessionId} 
                className="session-card"
                onClick={() => setSelectedSession(session)}
                style={{ cursor: 'pointer' }}
              >
                <div className="session-info">
                  <div className="session-id">{session.sessionId}</div>
                  <div className="session-details">
                    <span className="session-type">Image to Speak</span>
                    <span className="session-date">{new Date(session.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="session-metrics">
                  <div className="session-conversations">{session.conversationHistory?.length || 0} messages</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Click to view conversation</div>
                </div>
              </div>
            )) || <div className="no-data">No sessions found</div>}
          </div>
        )}
      </div>
    );
  };

  const renderAnalyticsContent = () => {
    if (selectedSession) {
      return renderSessionAnalytics();
    }

    return (
      <div>
        <h2>Image to Speak Analytics</h2>
        {renderFilterHeader()}
        {loading ? (
          <div className="loading">Loading sessions...</div>
        ) : (
          <div className="sessions-list">
            {filteredSessions.map(session => (
              <div
                key={session.sessionId}
                className="session-card analytics-session-card"
                onClick={() => setSelectedSession(session)}
              >
                <div className="session-info">
                  <div className="session-id">{session.sessionId}</div>
                  <div className="session-details">
                    <span className="session-type">Image to Speak</span>
                    <span className="session-date">{new Date(session.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="session-metrics">
                  <div className="analytics-indicator">📊 View Analytics</div>
                </div>
              </div>
            )) || <div className="no-data">No sessions found</div>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-text">Skill Route</span>
            <div className="nav-links">
              <a href="#" onClick={() => navigate('/student-dashboard')}>Back to Main Dashboard</a>
              {/* <a href="#" onClick={() => navigate('/practice')}>Practice</a>
              <a href="#" onClick={() => navigate('/student-leaderboard')}>Leaderboard</a> */}
            </div>
          </div>
          <div className="auth-buttons">
            {/* <button 
              className="btn-signup"
              onClick={() => {
                localStorage.removeItem('email');
                navigate('/signup');
              }}
            >
              Logout
            </button> */}
          </div>
        </div>
      </header>
      
      <div style={{ padding: '20px', marginTop: '80px' }}>
        <div className="dashboard-main">
          <div className="dashboard-header">
            <h1>Image to Speak Dashboard</h1>
            <p className="dashboard-subtitle">Analyze your image description sessions</p>
          </div>
          
          <div className="dashboard-actions">
            <button 
              className="action-btn history-btn"
              onClick={() => setActiveSection('history')}
            >
              <span className="btn-icon">📊</span>
              History
            </button>
            <button 
              className="action-btn analytics-btn"
              onClick={() => setActiveSection('analytics')}
            >
              <span className="btn-icon">📈</span>
              Analytics
            </button>
          </div>
          
          {activeSection === 'history' && (
            <div style={{ marginTop: '30px' }}>
              {renderHistoryContent()}
            </div>
          )}
          
          {activeSection === 'analytics' && (
            <div style={{ marginTop: '30px' }}>
              {renderAnalyticsContent()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageSpeakDashboard;