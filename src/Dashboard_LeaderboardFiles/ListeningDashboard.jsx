import React, { useState, useEffect } from 'react';
import BaseDashboard from './BaseDashboard';
import './dashboard.css';

function ListeningDashboardContent({ activeSection, userType, testType, userEmail }) {
  const [selectedSession, setSelectedSession] = useState(null);
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sessionDetails, setSessionDetails] = useState({});
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
    const fetchListeningData = async () => {
      if (!userEmail) return;
      
      setLoading(true);
      try {
        const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_idretrivalapi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            college_email: userEmail,
            test_type: 'LISTENING'
          })
        });
        
        const data = await response.json();
        const parsedData = JSON.parse(data.body);
        setApiData(parsedData);
      } catch (error) {
        console.error('Error fetching LISTENING data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListeningData();
  }, [userEmail]);

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
          test_type: 'LISTENING',
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

  if (activeSection === 'main') {
    return null;
  }

  if (activeSection === 'analytics' && userType !== 'premium') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>🔒 Premium Feature Required</h3>
        <p>Analytics are available for Premium users only.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Listening {activeSection === 'history' ? 'History' : 'Analytics'}</h2>
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
                  <span className="session-type">Listening Test</span>
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
      
      {selectedSession && (
        <div className="modal-overlay" onClick={() => setSelectedSession(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Listening Test Details: {selectedSession.sessionId}</h3>
              <button className="close-btn" onClick={() => setSelectedSession(null)}>×</button>
            </div>
            <div className="modal-body">
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
                  <span className="label">Score:</span>
                  <span className="value">{selectedSession.score || 'N/A'}</span>
                </div>
              </div>
              <div className="conversation-history">
                <h4>Test Results</h4>
                <div className="messages-container">
                  {selectedSession.conversationHistory?.map((msg, index) => (
                    <div key={index} className="message-group">
                      {msg.user && (
                        <div className="message user-message">
                          <div className="message-label">Your Answer:</div>
                          <div className="message-content">{msg.user}</div>
                        </div>
                      )}
                      {msg.agent && (
                        <div className="message agent-message">
                          <div className="message-label">Feedback:</div>
                          <div className="message-content">{msg.agent}</div>
                        </div>
                      )}
                    </div>
                  )) || <div className="no-messages">No test results available</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ListeningDashboard() {
  return (
    <BaseDashboard
      testType="listening"
      testTitle="Listening"
      testDescription="Enhance your listening comprehension skills"
      apiTestType="LISTENING"
    >
      <ListeningDashboardContent />
    </BaseDashboard>
  );
}

export default ListeningDashboard;