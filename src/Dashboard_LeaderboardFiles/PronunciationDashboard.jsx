import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

function PronunciationDashboard() {
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
    const fetchPronunciationData = async () => {
      if (!userEmail) return;
      
      setLoading(true);
      try {
        const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_retrivalapi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            college_email: userEmail,
            test_type: 'PRONUNCIATION'
          })
        });
        
        const data = await response.json();
        const parsedData = JSON.parse(data.body);
        setApiData(parsedData);
      } catch (error) {
        console.error('Error fetching PRONUNCIATION data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPronunciationData();
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

  const renderHistoryContent = () => (
    <div>
      <h2>Pronunciation History</h2>
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
                  <span className="session-type">Pronunciation Test</span>
                  <span className="session-date">{new Date(session.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <div className="session-metrics">
                <div className="session-conversations">{session.conversationHistory?.length || 0} messages</div>
              </div>
            </div>
          )) || <div className="no-data">No sessions found</div>}
        </div>
      )}
    </div>
  );

  const renderAnalyticsContent = () => (
    <div>
      <h2>Pronunciation Analytics</h2>
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
                  <span className="session-type">Pronunciation Test</span>
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

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-text">Skill Route</span>
            <div className="nav-links">
              <a href="#" onClick={() => navigate('/student-dashboard')}>Back to Main Dashboard</a>
              <a href="#" onClick={() => navigate('/practice')}>Practice</a>
              <a href="#" onClick={() => navigate('/student-leaderboard')}>Leaderboard</a>
            </div>
          </div>
          <div className="auth-buttons">
            <button 
              className="btn-signup"
              onClick={() => {
                localStorage.removeItem('email');
                navigate('/signup');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <div style={{ padding: '20px', marginTop: '80px' }}>
        <div className="dashboard-main">
          <div className="dashboard-header">
            <h1>Pronunciation Dashboard</h1>
            <p className="dashboard-subtitle">Perfect your pronunciation with detailed analysis</p>
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

export default PronunciationDashboard;