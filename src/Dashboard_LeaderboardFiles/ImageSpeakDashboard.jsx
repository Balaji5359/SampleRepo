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
  const [sessionDetails, setSessionDetails] = useState({});

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
        const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_idretrivalapi', {
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
          test_type: 'IMAGETOSPEAK',
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

  useEffect(() => {
    if (!apiData.sessions) {
      setFilteredSessions([]);
      return;
    }

    let filtered = apiData.sessions.filter(session => {
      const matchesSearch = searchTerm === '' || 
        session.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(session.start_time).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = dateFilter === '' || 
        new Date(session.start_time).toDateString() === new Date(dateFilter).toDateString();
      
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

  const renderSessionModal = () => {
    if (!selectedSession) return null;

    return (
      <div className="modal-overlay" onClick={() => setSelectedSession(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Image to Speak Details: {selectedSession.sessionId}</h3>
            <button className="close-btn" onClick={() => setSelectedSession(null)}>×</button>
          </div>
          
          <div className="modal-body">
            <div className="session-overview">
              <div className="overview-item">
                <span className="label">Session ID:</span>
                <span className="value">{selectedSession.sessionId}</span>
              </div>
              <div className="overview-item">
                <span className="label">Start Time:</span>
                <span className="value">{new Date(selectedSession.start_time).toLocaleString()}</span>
              </div>
              <div className="overview-item">
                <span className="label">End Time:</span>
                <span className="value">{new Date(selectedSession.end_time).toLocaleString()}</span>
              </div>
              <div className="overview-item">
                <span className="label">Score:</span>
                <span className="value">{selectedSession.score || 'N/A'}</span>
              </div>
              <div className="overview-item">
                <span className="label">Test Type:</span>
                <span className="value">Image to Speak</span>
              </div>
              <div className="overview-item">
                <span className="label">Total Messages:</span>
                <span className="value">{selectedSession.conversationHistory?.length || 0}</span>
              </div>
            </div>

            {selectedSession.images && selectedSession.images.length > 0 && (
              <div className="image-section">
                <h4>Image Prompt</h4>
                <div className="image-container">
                  <img
                    src={selectedSession.images[0].url}
                    alt="Image prompt"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="image-error" style={{display: 'none'}}>
                    <div className="error-icon">🖼️</div>
                    <div className="error-text">Image not accessible</div>
                  </div>
                </div>
              </div>
            )}

            {selectedSession.conversationHistory && selectedSession.conversationHistory.some(conv => conv.user) && (
              <div className="user-description">
                <h4>Your Description</h4>
                <div className="description-content">
                  {selectedSession.conversationHistory.map((conv, idx) => (
                    conv.user && (
                      <p key={idx} className="user-text">{conv.user}</p>
                    )
                  ))}
                </div>
              </div>
            )}

            {selectedSession.conversationHistory && selectedSession.conversationHistory.some(conv => conv.agent) && (
              <div className="ai-feedback">
                <h4>AI Feedback & Analysis</h4>
                <div className="feedback-content">
                  {selectedSession.conversationHistory.map((conv, idx) => (
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
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderHistoryContent = () => (
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
              onClick={() => fetchSessionDetails(session.sessionId)}
              style={{ cursor: 'pointer' }}
            >
              <div className="session-info">
                <div className="session-id">{session.sessionId}</div>
                <div className="session-details">
                  <span className="session-type">Image to Speak</span>
                  <span className="session-date">{new Date(session.start_time).toLocaleString()} - {new Date(session.end_time).toLocaleString()}</span>
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

  const renderAnalyticsContent = () => (
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
              onClick={() => fetchSessionDetails(session.sessionId)}
            >
              <div className="session-info">
                <div className="session-id">{session.sessionId}</div>
                <div className="session-details">
                  <span className="session-type">Image to Speak</span>
                  <span className="session-date">{new Date(session.start_time).toLocaleString()} - {new Date(session.end_time).toLocaleString()}</span>
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
      
      {renderSessionModal()}
    </div>
  );
}

export default ImageSpeakDashboard;