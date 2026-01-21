import React, { useState, useEffect } from 'react';
import BaseDashboard from './BaseDashboard';
import './dashboard.css';

function SituationSpeakDashboardContent({ activeSection, userType, testType, userEmail }) {
  const [selectedSession, setSelectedSession] = useState(null);
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sessionDetails, setSessionDetails] = useState({});
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [showConfidenceModal, setShowConfidenceModal] = useState(false);
  const [transcriptData, setTranscriptData] = useState(null);
  const [loadingTranscript, setLoadingTranscript] = useState(false);

  const loadTranscriptData = async (transcriptUrl) => {
    if (!transcriptUrl) return;
    
    setLoadingTranscript(true);
    try {
      const response = await fetch(transcriptUrl);
      const data = await response.json();
      setTranscriptData(data);
    } catch (error) {
      console.error('Error loading transcript:', error);
    } finally {
      setLoadingTranscript(false);
    }
  };

  const renderConfidenceGraphs = () => {
    if (!transcriptData?.results?.items) return null;

    const words = transcriptData.results.items
      .filter(item => item.type === 'pronunciation')
      .slice(0, 20);

    return (
      <div className="confidence-modal-overlay" onClick={() => setShowConfidenceModal(false)}>
        <div className="confidence-modal" onClick={(e) => e.stopPropagation()}>
          <div className="confidence-modal-header">
            <h3>🎤 Audio & Speech Analysis</h3>
            <button className="close-btn" onClick={() => setShowConfidenceModal(false)}>×</button>
          </div>
          <div className="confidence-modal-body">
            <div className="graphs-side-by-side">
              <div className="left-graph">
                <div className="graph-section">
                  <h4>📊 Word Confidence Levels</h4>
                  <div className="modern-bar-chart">
                    {words.map((word, index) => {
                      const confidence = parseFloat(word.alternatives?.[0]?.confidence || 0);
                      const width = confidence * 100;
                      let colorClass = 'low';
                      if (confidence > 0.8) colorClass = 'high';
                      else if (confidence > 0.6) colorClass = 'mid';
                      
                      return (
                        <div key={index} className="modern-bar-item" style={{'--delay': `${index * 0.1}s`}}>
                          <div className="modern-word-label">{word.alternatives?.[0]?.content || 'Unknown'}</div>
                          <div className="modern-bar-container">
                            <div 
                              className={`modern-progress-bar ${colorClass}`}
                              style={{
                                width: `${width}%`,
                                background: colorClass === 'high' ? 'linear-gradient(90deg, #10b981, #34d399)' :
                                          colorClass === 'mid' ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' :
                                          'linear-gradient(90deg, #ef4444, #f87171)'
                              }}
                            />
                          </div>
                          <div className="modern-confidence-score">{(confidence * 100).toFixed(1)}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="right-graph">
                <div className="graph-section">
                  <h4>📈 Speech Confidence Trend</h4>
                  <div className="modern-line-chart-container">
                    <svg className="modern-line-chart" viewBox="0 0 400 200">
                      <defs>
                        <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1"/>
                        </linearGradient>
                      </defs>
                      {words.map((word, index) => {
                        const x = (index / (words.length - 1)) * 350 + 25;
                        const confidence = parseFloat(word.alternatives?.[0]?.confidence || 0);
                        const y = 180 - (confidence * 150);
                        
                        return (
                          <g key={index}>
                            <circle 
                              cx={x} 
                              cy={y} 
                              r="4" 
                              fill="#60a5fa"
                              className="confidence-point"
                            />
                            {index > 0 && (
                              <line
                                x1={(index - 1) / (words.length - 1) * 350 + 25}
                                y1={180 - (parseFloat(words[index - 1].alternatives?.[0]?.confidence || 0) * 150)}
                                x2={x}
                                y2={y}
                                stroke="#60a5fa"
                                strokeWidth="2"
                              />
                            )}
                          </g>
                        );
                      })}
                      <line x1="25" y1="30" x2="25" y2="180" stroke="#e5e7eb" strokeWidth="1"/>
                      <line x1="25" y1="180" x2="375" y2="180" stroke="#e5e7eb" strokeWidth="1"/>
                      <text x="15" y="35" fontSize="12" fill="#6b7280">100%</text>
                      <text x="15" y="185" fontSize="12" fill="#6b7280">0%</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
    const fetchSituationSpeakData = async () => {
      if (!userEmail) return;
      
      setLoading(true);
      try {
        const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_idretrivalapi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            college_email: userEmail,
            test_type: 'SITUATIONSPEAK'
          })
        });
        
        const data = await response.json();
        const parsedData = JSON.parse(data.body);
        setApiData(parsedData);
      } catch (error) {
        console.error('Error fetching SITUATIONSPEAK data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSituationSpeakData();
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
          test_type: 'SITUATIONSPEAK',
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
      <h2>Situation Speak {activeSection === 'history' ? 'History' : 'Analytics'}</h2>
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
                  <span className="session-type">Situation Speak</span>
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
              <h3>Situation Speak Details: {selectedSession.sessionId}</h3>
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
              
              {selectedSession.audioFiles && selectedSession.audioFiles.length > 0 && (
                <div className="audio-files">
                  <h4>🎧 Audio Files</h4>
                  <div className="files-list">
                    {selectedSession.audioFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <span className="file-icon">🎧</span>
                        <span className="file-name">{file.filename || `Audio ${index + 1}`}</span>
                        <audio controls style={{marginLeft: 'auto'}}>
                          <source src={file.url} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedSession.transcripts && selectedSession.transcripts.length > 0 && (
                <div className="transcripts">
                  <h4>📝 Speech Analysis</h4>
                  <div className="confidence-analysis">
                    <button 
                      className="confidence-btn"
                      onClick={() => {
                        if (selectedSession.transcripts[0]?.url) {
                          loadTranscriptData(selectedSession.transcripts[0].url);
                          setShowConfidenceModal(true);
                        }
                      }}
                      disabled={loadingTranscript}
                    >
                      {loadingTranscript ? 'Loading...' : '📈 View Audio & Speech Analysis'}
                    </button>
                  </div>
                  <div className="transcripts-list">
                    {selectedSession.transcripts.map((transcript, index) => (
                      <div key={index} className="transcript-item">
                        <div className="transcript-content">
                          {transcript.content || 'Transcript analysis available'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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
                          <div className="message-content">{msg.agent}</div>
                        </div>
                      )}
                    </div>
                  )) || <div className="no-messages">No conversation history available</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showConfidenceModal && renderConfidenceGraphs()}
    </div>
  );
}

function SituationSpeakDashboard() {
  return (
    <BaseDashboard
      testType="situational"
      testTitle="Situation Speak"
      testDescription="Practice speaking in different scenarios"
      apiTestType="SITUATIONSPEAK"
    >
      <SituationSpeakDashboardContent />
    </BaseDashboard>
  );
}

export default SituationSpeakDashboard;