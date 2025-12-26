import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

function JAMDashboard() {
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

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Not available';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleString();
    } catch (error) {
      return dateTimeString;
    }
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return 'Not available';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleDateString('en-IN');
    } catch (error) {
      return dateTimeString;
    }
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return 'Not available';
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-IN', { 
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/am|pm/g, match => match.toUpperCase());
    } catch (error) {
      return dateTimeString;
    }
  };

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
    const fetchJAMData = async () => {
      if (!userEmail) return;
      
      setLoading(true);
      try {
        const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_retrivalapi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            college_email: userEmail,
            test_type: 'JAM'
          })
        });
        
        const data = await response.json();
        const parsedData = JSON.parse(data.body);
        setApiData(parsedData);
      } catch (error) {
        console.error('Error fetching JAM data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJAMData();
  }, [userEmail]);

  useEffect(() => {
    if (!apiData.sessions) {
      setFilteredSessions([]);
      return;
    }

    let filtered = apiData.sessions.filter(session => {
      const matchesSearch = searchTerm === '' || 
        session.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDateTime(session.start_time).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = dateFilter === '' || 
        formatDate(session.start_time) === new Date(dateFilter).toLocaleDateString();
      
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
            placeholder="Search by JAM ID or time..."
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

  const loadTranscriptData = (transcriptUrl) => {
    console.log('🔄 Loading JAM transcript from:', transcriptUrl);
    
    // Create iframe to load JSON (similar to how audio/images bypass CORS)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = transcriptUrl;
    
    iframe.onload = () => {
      try {
        const transcriptJson = JSON.parse(iframe.contentDocument.body.textContent);
        
        const items = transcriptJson.results?.items || [];
        const words = items.filter(item => item.type === 'pronunciation');
        
        let totalConfidence = 0;
        const wordAnalysis = words.map(word => {
          const confidence = parseFloat(word.alternatives?.[0]?.confidence || 0);
          totalConfidence += confidence;
          return {
            content: word.alternatives?.[0]?.content || '',
            confidence: confidence,
            startTime: parseFloat(word.start_time || 0),
            endTime: parseFloat(word.end_time || 0)
          };
        });
        
        const analytics = {
          avgConfidence: Math.round((totalConfidence / words.length) * 100),
          wordCount: words.length,
          duration: Math.round(Math.max(...words.map(w => parseFloat(w.end_time || 0)))),
          words: wordAnalysis
        };
        
        setSelectedSession(prev => ({ ...prev, transcriptAnalytics: analytics }));
        console.log('✅ JAM transcript analytics loaded:', analytics);
        document.body.removeChild(iframe);
      } catch (error) {
        console.error('❌ Failed to parse transcript:', error);
        document.body.removeChild(iframe);
        alert('Transcript file format error or CORS restrictions.');
      }
    };
    
    iframe.onerror = () => {
      console.error('❌ Failed to load transcript via iframe');
      document.body.removeChild(iframe);
      alert('Transcript file is not accessible due to CORS restrictions.');
    };
    
    document.body.appendChild(iframe);
  };

  const renderSessionAnalytics = () => {
    const session = selectedSession;

    return (
      <div className="session-analytics-view">
        <div className="analytics-header">
          <button className="back-btn" onClick={() => setSelectedSession(null)}>← Back to Sessions</button>
          <h2>JAM Session Analytics — {session.sessionId}</h2>
          <p className="analytics-subtitle">Just A Minute speech analysis and feedback</p>
        </div>


        <div className="session-summary">
          <div className="summary-card">
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-label">Start Date:</span>
                <span className="stat-value">{formatDate(session.start_time)}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Start Time:</span>
                <span className="stat-value">{formatTime(session.start_time)}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Test Type:</span>
                <span className="stat-value">JAM Session</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Session ID:</span>
                <span className="stat-value">{session.sessionId}</span>
              </div>
              {session.transcriptAnalytics && (
                <div className="summary-stat">
                  <span className="stat-label">Speech Quality:</span>
                  <span className="stat-value">{session.transcriptAnalytics.avgConfidence}% confidence</span>
                </div>
              )}
            </div>
          </div>
        </div><br></br>


        {/* Audio Section */}
        <div className="analytics-grid-layout">
          <div className="analytics-left">
            <div className="analytics-card audio-card">
              <h3>Audio Recording</h3>
              {session.audioFiles && session.audioFiles.length > 0 ? (
                <div className="media-container">
                  <audio 
                    controls 
                    style={{width: '100%'}}
                    onLoadedData={() => console.log('✅ JAM Audio loaded successfully:', session.audioFiles[0].url)}
                    onError={(e) => {
                      console.error('❌ JAM Audio failed to load:', session.audioFiles[0].url);
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
                    <div className="error-suggestion">S3 bucket CORS policy blocks audio access. Audio files are available but cannot be played in browser due to security restrictions.</div>
                    <a href={session.audioFiles[0].url} download className="download-link">Download Audio File</a>
                  </div>
                  <div className="audio-tip">
                    Listen to your JAM session recording
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
            {/* JAM Topic */}
            {session.conversationHistory && session.conversationHistory.some(conv => conv.user) && (
              <div className="analytics-card user-description-card">
                <h3>Your JAM Speech</h3>
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
              <h3>AI Feedback & JAM Score</h3>
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

        
        {session.transcriptAnalytics && (
          <div className="analytics-card">
            <div className="transcript-results">
                  <div className="analytics-overview">
                    <div className="metric">
                      <span className="metric-label">Confidence:</span>
                      <span className="metric-value">{session.transcriptAnalytics.avgConfidence}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Words:</span>
                      <span className="metric-value">{session.transcriptAnalytics.wordCount}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Duration:</span>
                      <span className="metric-value">{session.transcriptAnalytics.duration}s</span>
                    </div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto'}}>
                    {session.transcriptAnalytics.words?.map((word, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px',
                        borderRadius: '10px',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005))',
                        transition: 'transform 0.12s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                      >
                        <div style={{minWidth: '110px', fontWeight: '700', color: 'var(--text-primary)'}}>
                          {word.content}
                        </div>
                        <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                          <div style={{
                            height: '10px',
                            borderRadius: '999px',
                            background: 'rgba(255,255,255,0.03)',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${word.confidence * 100}%`,
                              background: word.confidence >= 0.85 ? 
                                'linear-gradient(90deg, #10b981, #34d399)' :
                                word.confidence >= 0.6 ?
                                'linear-gradient(90deg, #f59e0b, #ffd28a)' :
                                'linear-gradient(90deg, #ef4444, #ff7b7b)'
                            }}></div>
                          </div>
                        </div>
                        <div style={{
                          width: '140px',
                          textAlign: 'right',
                          fontSize: '13px',
                          color: 'var(--text-muted)'
                        }}>
                          {Math.round(word.confidence * 100)}%<br/>
                          <small style={{color: 'var(--text-muted)'}}>
                            {word.startTime.toFixed(2)}s - {word.endTime.toFixed(2)}s
                          </small>
                        </div>
                        {(word.confidence < 0.75) && (
                          <div style={{
                            marginLeft: '12px',
                            fontSize: '13px',
                            color: 'var(--text-muted)',
                            fontStyle: 'italic',
                            minWidth: '200px'
                          }}>
                            {word.confidence < 0.6 ? 'Tip: slow down & stress vowel sounds' :
                            'Tip: focus on consonant ending'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{marginTop: '20px'}}>
                    <h4>Confidence Over Time</h4>
                    <svg width="100%" height="200" viewBox="0 0 800 200" style={{background: 'rgba(255,255,255,0.02)', borderRadius: '8px'}}>
                      <defs>
                        <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1"/>
                        </linearGradient>
                      </defs>
                      {session.transcriptAnalytics.words?.length > 1 && (
                        <>
                          <polyline
                            fill="none"
                            stroke="#60a5fa"
                            strokeWidth="2"
                            points={session.transcriptAnalytics.words.map((word, i) => 
                              `${(i / (session.transcriptAnalytics.words.length - 1)) * 780 + 10},${190 - (word.confidence * 170)}`
                            ).join(' ')}
                          />
                          <polygon
                            fill="url(#confidenceGradient)"
                            points={`10,190 ${session.transcriptAnalytics.words.map((word, i) => 
                              `${(i / (session.transcriptAnalytics.words.length - 1)) * 780 + 10},${190 - (word.confidence * 170)}`
                            ).join(' ')} 790,190`}
                          />
                          {session.transcriptAnalytics.words.map((word, i) => (
                            <circle
                              key={i}
                              cx={(i / (session.transcriptAnalytics.words.length - 1)) * 780 + 10}
                              cy={190 - (word.confidence * 170)}
                              r="3"
                              fill={word.confidence > 0.85 ? '#10b981' : word.confidence > 0.6 ? '#f59e0b' : '#ef4444'}
                            />
                          ))}
                        </>
                      )}
                      <line x1="10" y1="190" x2="790" y2="190" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                      <line x1="10" y1="20" x2="790" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                      <text x="15" y="15" fill="#94a3b8" fontSize="12">100%</text>
                      <text x="15" y="200" fill="#94a3b8" fontSize="12">0%</text>
                    </svg>
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
            <h2>JAM Session Conversation — {selectedSession.sessionId}</h2>
            <p className="analytics-subtitle">View complete conversation history</p>
          </div>

          <div className="analytics-card">
            <h3>Session Information</h3>
            <div className="session-info-header">
              <p><strong>Session ID:</strong> {selectedSession.sessionId}</p>
              <p><strong>Start Date:</strong> {formatDate(selectedSession.start_time)}</p>
              <p><strong>Start Time:</strong> {formatTime(selectedSession.start_time)}</p>
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
        <h2>JAM Sessions History</h2>
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
                    <span className="session-type">JAM Session</span>
                    <div className="session-datetime">
                      <div className="session-date">{formatDate(session.start_time)}</div>
                      <div className="session-time">
                        Start: {formatTime(session.start_time)}
                      </div>
                    </div>
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
        <h2>JAM Sessions Analytics</h2>
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
                    <span className="session-type">JAM Session</span>
                    <div className="session-datetime">
                      <div className="session-date">{formatDate(session.start_time)}</div>
                      <div className="session-time">
                        Start: {formatTime(session.start_time)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="session-metrics">
                  <div className="analytics-indicator">View Analytics</div>
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
            <h1>
              JAM Sessions Dashboard
            </h1>
            <p className="dashboard-subtitle">Self-analyze your Just A Minute sessions</p>
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

export default JAMDashboard;