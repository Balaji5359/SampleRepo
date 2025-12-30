import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import './modern-graphs.css';


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
  const [sessionDetails, setSessionDetails] = useState({});
  const [showConfidenceModal, setShowConfidenceModal] = useState(false);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [confidenceData, setConfidenceData] = useState(null);

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
        const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_idretrivalapi', {
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

  const fetchSessionDetails = async (sessionId) => {
    if (sessionDetails[sessionId]) {
      setSelectedSession({ ...apiData.sessions.find(s => s.sessionId === sessionId), ...sessionDetails[sessionId] });
      return;
    }

    try {
      const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_dataretrivalapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          college_email: userEmail,
          test_type: 'JAM',
          sessionId: sessionId
        })
      });
      
      const data = await response.json();
      const parsedData = JSON.parse(data.body);
      
      setSessionDetails(prev => ({ ...prev, [sessionId]: parsedData }));
      setSelectedSession({ ...apiData.sessions.find(s => s.sessionId === sessionId), ...parsedData });
    } catch (error) {
      console.error('Error fetching session details:', error);
    }
  };

  const fetchConfidenceData = async (sessionId) => {
    try {
      console.log('Fetching confidence data for:', sessionId);
      const transcriptUrl = `https://students-recording-communication-activities-transcribe-startup.s3.ap-south-1.amazonaws.com/transcribe-${sessionId}.json`;
      console.log('Transcript URL:', transcriptUrl);
      
      const response = await fetch(transcriptUrl);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const confidenceDataResult = await response.json();
      console.log('Confidence data loaded:', confidenceDataResult);
      
      // Filter only pronunciation items
      const pronunciationItems = confidenceDataResult.results.items.filter(item => item.type === 'pronunciation');
      console.log('Pronunciation items:', pronunciationItems.length);
      
      const processedData = {
        results: {
          transcripts: confidenceDataResult.results.transcripts,
          items: pronunciationItems
        }
      };
      
      setConfidenceData(processedData);
      setShowConfidenceModal(true);
    } catch (error) {
      console.error('Error fetching confidence data:', error);
      console.error('Error details:', error.message);
    }
  };

  useEffect(() => {
    if (!apiData.sessions) {
      setFilteredSessions([]);
      return;
    }

    const filtered = apiData.sessions.filter(session => {
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

  const renderHistoryContent = () => {
    if (selectedSession) {
      return (
        <div className="modal-overlay" style={{zIndex: 1000}} onClick={() => setSelectedSession(null)}>
          <div className="modal-content" style={{maxHeight: '85vh', overflow: 'hidden'}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>JAM Session Details: {selectedSession.sessionId}</h3>
              <button className="close-btn" onClick={() => setSelectedSession(null)}>×</button>
            </div>
            
            <div className="modal-body" style={{maxHeight: 'calc(85vh - 120px)', overflowY: 'auto', padding: '20px'}}>
              <div className="session-overview">
                <div className="overview-item">
                  <span className="label">Session ID:</span>
                  <span className="value">{selectedSession.sessionId}</span>
                </div>
                <div className="overview-item">
                  <span className="label">Start Date:</span>
                  <span className="value">{formatDate(selectedSession.start_time)}</span>
                </div>
                <div className="overview-item">
                  <span className="label">Start Time:</span>
                  <span className="value">{formatTime(selectedSession.start_time)}</span>
                </div>
                <div className="overview-item">
                  <span className="label">End Time:</span>
                  <span className="value">{formatTime(selectedSession.end_time)}</span>
                </div>
                <div className="overview-item">
                  <span className="label">Score:</span>
                  <span className="value">{selectedSession.score || 'N/A'}</span>
                </div>
                <div className="overview-item">
                  <span className="label">Total Messages:</span>
                  <span className="value">{selectedSession.conversationHistory?.length || 0}</span>
                </div>
              </div>

              <div className="conversation-history">
                <h4>Conversation History</h4>
                <div className="messages-container">
                  {selectedSession.conversationHistory?.map((msg, index) => (
                    <div key={index} className="message-group">
                      {msg.user && (
                        <div className="message user-message">
                          <div className="message-label">User:</div>
                          <div className="message-content">{msg.user}</div>
                        </div>
                      )}
                      {msg.agent && (
                        <div className="message agent-message">
                          <div className="message-label">Agent:</div>
                          <div className="message-content" style={{wordBreak: 'break-word', whiteSpace: 'pre-wrap', lineHeight: '1.5'}}>
                            {msg.agent.split('\n').map((line, lineIdx) => (
                              line.trim() && <p key={lineIdx} style={{margin: '8px 0'}}>{line}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )) || <div className="no-messages">No conversation history available</div>}
                </div>
              </div>


            </div>
          </div>
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
                onClick={() => fetchSessionDetails(session.sessionId)}
                style={{ cursor: 'pointer' }}
              >
                <div className="session-info">
                  <div className="session-id">{session.sessionId}</div>
                  <div className="session-details">
                    <span className="session-type">JAM Session</span>
                    <div className="session-datetime">
                      <div className="session-date">{formatDate(session.start_time)}</div>
                      <div className="session-time">
                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="session-metrics">
                  <div className="session-conversations">Score: {session.score || 'N/A'}</div>
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
      return (
        <div className="modal-overlay" style={{zIndex: 1000}} onClick={() => setSelectedSession(null)}>
          <div className="modal-content" style={{maxHeight: '85vh', overflow: 'hidden'}} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>JAM Analytics: {selectedSession.sessionId}</h3>
              <button className="close-btn" onClick={() => setSelectedSession(null)}>×</button>
            </div>
            
            <div className="modal-body" style={{maxHeight: 'calc(85vh - 120px)', overflowY: 'auto', padding: '20px'}}>
              <div className="session-overview">
                <div className="overview-item">
                  <span className="label">Start Date:</span>
                  <span className="stat-value">{formatDate(selectedSession.start_time)}</span>
                </div>
                <div className="overview-item">
                  <span className="label">Start Time:</span>
                  <span className="stat-value">{formatTime(selectedSession.start_time)}</span>
                </div>
                <div className="overview-item">
                  <span className="label">End Time:</span>
                  <span className="stat-value">{formatTime(selectedSession.end_time)}</span>
                </div>
                <div className="overview-item">
                  <span className="label">Score:</span>
                  <span className="stat-value">{selectedSession.score || 'N/A'}</span>
                </div>
                <div className="overview-item">
                  <span className="label">Test Type:</span>
                  <span className="stat-value">JAM Session</span>
                </div>
              </div>

              {selectedSession.audioFiles && selectedSession.audioFiles.length > 0 && (
                <div className="audio-files">
                  <h4>Audio Recording</h4>
                  <audio 
                    controls 
                    style={{width: '100%'}}
                    preload="none"
                  >
                    <source src={selectedSession.audioFiles[0].url} type="audio/webm" />
                    <source src={selectedSession.audioFiles[0].url} type="audio/mp4" />
                    <source src={selectedSession.audioFiles[0].url} type="audio/wav" />
                    <source src={selectedSession.audioFiles[0].url} type="audio/mpeg" />
                    Your browser does not support audio playback.
                  </audio>
                </div>
              )}

              <div className="confidence-analysis">
                <button 
                  className="confidence-btn"
                  onClick={() => fetchConfidenceData(selectedSession.sessionId)}
                >
                  Click here to See Confidence Graph of Your Speech
                </button>
              </div>

              {selectedSession.conversationHistory && selectedSession.conversationHistory.some(conv => conv.user) && (
                <div className="user-speech">
                  <h4>Your JAM Speech</h4>
                  <div className="speech-content">
                    {selectedSession.conversationHistory.map((conv, idx) => (
                      conv.user && (
                        <p key={idx} className="user-text" style={{wordBreak: 'break-word', whiteSpace: 'pre-wrap', lineHeight: '1.5'}}>{conv.user}</p>
                      )
                    ))}
                  </div>
                </div>
              )}

              {selectedSession.conversationHistory && selectedSession.conversationHistory.some(conv => conv.agent) && (
                <div className="ai-feedback">
                  <h4>AI Feedback & JAM Score</h4>
                  <div className="feedback-content">
                    {selectedSession.conversationHistory.map((conv, idx) => (
                      conv.agent && (
                        <div key={idx} className="feedback-item">
                          {conv.agent.split('\n').map((line, lineIdx) => (
                            line.trim() && <p key={lineIdx} className="feedback-line" style={{wordBreak: 'break-word', whiteSpace: 'pre-wrap', lineHeight: '1.5', margin: '8px 0'}}>{line}</p>
                          ))}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
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
                onClick={() => fetchSessionDetails(session.sessionId)}
              >
                <div className="session-info">
                  <div className="session-id">{session.sessionId}</div>
                  <div className="session-details">
                    <span className="session-type">JAM Session</span>
                    <div className="session-datetime">
                      <div className="session-date">{formatDate(session.start_time)}</div>
                      <div className="session-time">
                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="session-metrics">
                  <div className="analytics-indicator">📊 Score: {session.score || 'N/A'}</div>
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
            </div>
          </div>
        </div>
      </header>
      
      <div style={{ padding: '20px', marginTop: '80px' }}>
        <div className="dashboard-main">
          <div className="dashboard-header">
            <h1>JAM Sessions Dashboard</h1>
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
      
      {showConfidenceModal && confidenceData && (
        <div className="confidence-modal-overlay" style={{zIndex: 2000}} onClick={() => {setShowConfidenceModal(false); setConfidenceData(null);}}>
          <div className="confidence-modal" style={{maxHeight: '90vh', overflow: 'hidden'}} onClick={(e) => e.stopPropagation()}>
            <div className="confidence-modal-header">
              <h3>Speech Confidence Analysis</h3>
              <button className="close-btn" onClick={() => {setShowConfidenceModal(false); setConfidenceData(null);}}>×</button>
            </div>
            <div className="confidence-modal-body" style={{maxHeight: 'calc(90vh - 120px)', overflowY: 'auto', padding: '20px'}}>
              <div className="graphs-side-by-side">
                <div className="graph-section left-graph">
                  <h4>Word Confidence Analysis</h4>
                  <div className="modern-bar-chart">
                    {confidenceData.results?.items?.map((item, idx) => {
                      const confidence = parseFloat(item.alternatives[0].confidence) * 100;
                      const getColor = (conf) => {
                        if (conf >= 85) return '#10b981';
                        if (conf >= 70) return '#f59e0b';
                        return '#ef4444';
                      };
                      return (
                        <div key={idx} className="modern-bar-item" style={{'--delay': `${idx * 0.02}s`}}>
                          <span className="modern-word-label">{item.alternatives[0].content}</span>
                          <div className="modern-bar-container">
                            <div 
                              className="modern-progress-bar" 
                              style={{
                                width: `${confidence}%`,
                                backgroundColor: getColor(confidence)
                              }}
                            ></div>
                            <span className="modern-confidence-score">{confidence.toFixed(1)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="graph-section right-graph">
                  <h4>Confidence Trend Analysis</h4>
                  <div className="modern-line-chart-container">
                    <svg className="modern-line-chart" viewBox="0 0 600 300">
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
                        </linearGradient>
                        <filter id="dropShadow">
                          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1"/>
                        </filter>
                      </defs>
                      
                      {[0, 25, 50, 75, 100].map(y => (
                        <line key={y} x1="55" y1={250 - (y * 2)} x2="555" y2={250 - (y * 2)} stroke="#e5e7eb" strokeWidth="1" opacity="0.5" />
                      ))}
                      
                      <path
                        d={`M 55,250 ${confidenceData.results?.items?.map((item, idx) => {
                          const x = 55 + (idx / (confidenceData.results.items.length - 1)) * 500;
                          const y = 250 - (parseFloat(item.alternatives[0].confidence) * 200);
                          return `L ${x},${y}`;
                        }).join(' ')} L 555,250 Z`}
                        fill="url(#areaGradient)"
                      />
                      
                      <path
                        d={`M ${confidenceData.results?.items?.map((item, idx) => {
                          const x = 55 + (idx / (confidenceData.results.items.length - 1)) * 500;
                          const y = 250 - (parseFloat(item.alternatives[0].confidence) * 200);
                          return `${x},${y}`;
                        }).join(' L ')}`}
                        fill="none"
                        stroke="#0ea5e9"
                        strokeWidth="3"
                        filter="url(#dropShadow)"
                      />
                      
                      {confidenceData.results?.items?.map((item, idx) => {
                        const confidence = parseFloat(item.alternatives[0].confidence);
                        const x = 55 + (idx / (confidenceData.results.items.length - 1)) * 500;
                        const y = 250 - (confidence * 200);
                        const isLowConfidence = confidence < 0.7;
                        return (
                          <circle
                            key={idx}
                            cx={x}
                            cy={y}
                            r={isLowConfidence ? "6" : "4"}
                            fill={isLowConfidence ? "#ef4444" : "#0ea5e9"}
                            stroke="white"
                            strokeWidth="2"
                            className="confidence-point"
                          >
                            <title>{item.alternatives[0].content}: {(confidence * 100).toFixed(1)}%</title>
                          </circle>
                        );
                      })}
                      
                      {[0, 25, 50, 75, 100].map(y => (
                        <text key={y} x="50" y={255 - (y * 2)} fontSize="12" fill="#6b7280" textAnchor="end">{y}%</text>
                      ))}
                      
                      <text x="300" y="285" fontSize="14" fill="#374151" textAnchor="middle">Word Index (Speech Timeline)</text>
                      <text x="20" y="150" fontSize="14" fill="#374151" textAnchor="middle" transform="rotate(-90 20 150)">Confidence Score</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JAMDashboard;