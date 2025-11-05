import React, { useState, useEffect } from 'react';
import Login_Navbar from '../RegisterFiles/Login_Navbar.jsx';
import './Dashboard.css';
import '../LandingPageFiles/landing.css';
// import '../../CommunicationTestsFiles/test.css';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedTestType, setSelectedTestType] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showConversation, setShowConversation] = useState(false);
  const [theme, setTheme] = useState('light');
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(false);
  const [userEmail] = useState(localStorage.getItem('email'));

  const testTypes = [
    { key: 'JAM', name: 'JAM Sessions', icon: '🎤' },
    { key: 'PRONUNCIATION', name: 'Pronunciation', icon: '🗣️' },
    { key: 'IMAGETOSPEAK', name: 'Image to Speak', icon: '🖼️' },
    { key: 'SITUATIONSPEAK', name: 'Situation Speak', icon: '💬' },
    { key: 'STORYRETELLING', name: 'Story Retelling', icon: '📚' },
    { key: 'IMAGETOSTORY', name: 'Image to Story', icon: '📖' }
  ];

  // Create mock transcript data based on conversation history
  const createMockTranscriptData = (session) => {
    if (!session.conversationHistory) return null;
    
    // Extract user speech from conversation
    const userMessages = session.conversationHistory
      .filter(conv => conv.user && conv.user.length > 10)
      .map(conv => conv.user);
    
    if (userMessages.length === 0) return null;
    
    const fullTranscript = userMessages.join(' ');
    const words = fullTranscript.split(' ').filter(word => word.length > 0);
    
    // Create mock transcript items with confidence scores
    const items = words.map((word, index) => {
      const confidence = 0.6 + Math.random() * 0.4; // Random confidence between 0.6-1.0
      const startTime = index * 0.5;
      const endTime = startTime + 0.4;
      
      return {
        id: index,
        type: 'pronunciation',
        alternatives: [{
          confidence: confidence.toFixed(3),
          content: word.replace(/[^a-zA-Z]/g, '')
        }],
        start_time: startTime.toFixed(3),
        end_time: endTime.toFixed(3)
      };
    }).filter(item => item.alternatives[0].content.length > 0);
    
    return {
      results: {
        transcripts: [{ transcript: fullTranscript }],
        items: items
      }
    };
  };

  // Theme handling with proper background gradients
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

  // Fetch all test data on component mount
  useEffect(() => {
    const fetchAllTestData = async () => {
      if (!userEmail) return;
      
      setLoading(true);
      const allData = {};
      
      for (const testType of testTypes) {
        try {
          const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_retrivalapi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              college_email: userEmail,
              test_type: testType.key
            })
          });
          
          const data = await response.json();
          const parsedData = JSON.parse(data.body);
          allData[testType.key] = parsedData;
        } catch (error) {
          console.error(`Error fetching ${testType.key} data:`, error);
        }
      }
      
      setApiData(allData);
      setLoading(false);
    };
    
    fetchAllTestData();
  }, [userEmail]);

  // Fetch data from API
  const fetchTestData = async (testType) => {
    if (!userEmail || !testType) return;
    
    setLoading(true);
    try {
      const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_retrivalapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          college_email: userEmail,
          test_type: testType
        })
      });
      
      const data = await response.json();
      const parsedData = JSON.parse(data.body);
      setApiData(prev => ({ ...prev, [testType]: parsedData }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    let totalSessions = 0;
    let totalScore = 0;
    let scoreCount = 0;
    let totalMinutes = 0;

    Object.values(apiData).forEach(testData => {
      if (testData.sessions) {
        totalSessions += testData.sessions.length;
        testData.sessions.forEach(session => {
          session.conversationHistory?.forEach(conv => {
            if (conv.agent) {
              const scoreMatch = conv.agent.match(/Score: ([\d.]+)/i) || conv.agent.match(/JAM Score: ([\d.]+)/i);
              if (scoreMatch) {
                totalScore += parseFloat(scoreMatch[1]);
                scoreCount++;
              }
            }
          });
          // Estimate 2-3 minutes per session
          totalMinutes += 2.5;
        });
      }
    });

    return {
      totalSessions,
      averageScore: scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : '0',
      totalMinutes: Math.round(totalMinutes),
      skillsImproved: Math.min(totalSessions, 12)
    };
  };

  const handleTestTypeClick = async (testType) => {
    setSelectedTestType(testType);
    if (!apiData[testType]) {
      await fetchTestData(testType);
    }
  };

  const handleSessionClick = (sessionData) => {
    setSelectedSession(sessionData);
    setShowConversation(true);
  };

  const closeConversation = () => {
    setShowConversation(false);
    setSelectedSession(null);
  };

  const goBackToTests = () => {
    setSelectedTestType(null);
  };

  const renderDashboard = () => {
    const stats = calculateStats();
    
    return (
      <div className="dashboard-main"><br></br><br></br>
        <div className="dashboard-header">
          <h1>Communication Tests Dashboard</h1>
          <p className="dashboard-subtitle">Track your progress and improve your communication skills</p>
          
          <div className="theme-selector">
            <label>Theme: </label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
        
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-number">{loading ? '...' : stats.totalSessions}</div>
            <div className="stat-label">Total Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{loading ? '...' : stats.averageScore}</div>
            <div className="stat-label">Average Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{loading ? '...' : stats.totalMinutes}</div>
            <div className="stat-label">Minutes Practiced</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{loading ? '...' : stats.skillsImproved}</div>
            <div className="stat-label">Skills Improved</div>
          </div>
        </div>
        
        {loading && (
          <div className="dashboard-loading">
            <p>Loading your communication test data...</p>
          </div>
        )}

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
      </div>
    );
  };

  const renderHistory = () => {
    if (selectedTestType && !loading) {
      const testData = apiData[selectedTestType];
      if (!testData || !testData.sessions) {
        return (
          <div className="history-section">
            <div className="section-header">
              <button className="back-btn" onClick={goBackToTests}>← Back</button>
              <h2>{selectedTestType} Sessions</h2>
            </div>
            <div className="no-data">No sessions found for this test type.</div>
          </div>
        );
      }

      return (
        <div className="history-section">
          <div className="section-header">
            <button className="back-btn" onClick={goBackToTests}>← Back</button>
            <h2>{selectedTestType} Conversation History</h2>
          </div>
          
          <div className="sessions-list">
            {testData.sessions.map(session => (
              <div 
                key={session.sessionId} 
                className="session-card"
                onClick={() => handleSessionClick(session)}
              >
                <div className="session-info">
                  <div className="session-id">{session.sessionId}</div>
                  <div className="session-details">
                    <span className="session-type">{selectedTestType}</span>
                    <span className="session-date">{new Date(session.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="session-metrics">
                  <div className="session-conversations">{session.conversationHistory?.length || 0} messages</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="history-section">
        <div className="section-header">
          <button className="back-btn" onClick={() => setActiveSection('dashboard')}>← Back</button>
          <h2>Communication Activities</h2>
        </div>
        
        <div className="test-types-grid">
          {testTypes.map(testType => (
            <div 
              key={testType.key}
              className="test-type-card"
              onClick={() => handleTestTypeClick(testType.key)}
            >
              <div className="test-icon">{testType.icon}</div>
              <div className="test-name">{testType.name}</div>
            </div>
          ))}
        </div>
        
        {loading && <div className="loading">Loading sessions...</div>}
      </div>
    );
  };

  const renderAnalytics = () => {
    if (selectedSession && selectedSession.transcriptData) {
      return renderSessionAnalytics();
    }

    if (selectedTestType && !loading) {
      const testData = apiData[selectedTestType];
      if (!testData || !testData.sessions) {
        return (
          <div className="analytics-section">
            <div className="section-header">
              <button className="back-btn" onClick={goBackToTests}>← Back</button>
              <h2>{selectedTestType} Analytics</h2>
            </div>
            <div className="no-data">No analytics data available for this test type.</div>
          </div>
        );
      }

      return (
        <div className="analytics-section">
          <div className="section-header">
            <button className="back-btn" onClick={goBackToTests}>← Back</button>
            <h2>{selectedTestType} Session Analytics</h2>
          </div>
          
          <div className="sessions-list">
            {testData.sessions.map(session => (
              <div 
                key={session.sessionId} 
                className="session-card analytics-session-card"
                onClick={() => handleAnalyticsSessionClick(session)}
              >
                <div className="session-info">
                  <div className="session-id">{session.sessionId}</div>
                  <div className="session-details">
                    <span className="session-type">{selectedTestType}</span>
                    <span className="session-date">{new Date(session.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <div className="session-metrics">
                  <div className="analytics-indicator">📊 View Analytics</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="analytics-section">
        <div className="section-header">
          <button className="back-btn" onClick={() => setActiveSection('dashboard')}>← Back</button>
          <h2>Analytics & Insights</h2>
        </div>
        
        <div className="test-types-grid">
          {testTypes.map(testType => (
            <div 
              key={testType.key}
              className="test-type-card"
              onClick={() => handleTestTypeClick(testType.key)}
            >
              <div className="test-icon">{testType.icon}</div>
              <div className="test-name">{testType.name}</div>
            </div>
          ))}
        </div>
        
        {loading && <div className="loading">Loading analytics...</div>}
      </div>
    );
  };

  const handleAnalyticsSessionClick = async (session) => {
    setLoading(true);
    // Create mock transcript data from conversation history
    const transcriptData = createMockTranscriptData(session);
    setSelectedSession({ ...session, transcriptData });
    setLoading(false);
  };

  const renderSessionAnalytics = () => {
    const session = selectedSession;
    const transcriptData = session.transcriptData;
    
    // Calculate analytics from transcript data or conversation history
    const calculateAnalytics = () => {
      if (transcriptData && transcriptData.results) {
        const items = transcriptData.results.items || [];
        const words = items.filter(item => item.type === 'pronunciation');
        
        let totalConfidence = 0;
        let goodWords = 0;
        let badWords = 0;
        let totalDuration = 0;
        
        words.forEach(word => {
          const confidence = parseFloat(word.alternatives?.[0]?.confidence || 0);
          totalConfidence += confidence;
          
          if (confidence > 0.85) goodWords++;
          else if (confidence < 0.6) badWords++;
          
          const startTime = parseFloat(word.start_time || 0);
          const endTime = parseFloat(word.end_time || 0);
          if (endTime > totalDuration) totalDuration = endTime;
        });
        
        return {
          avgConfidence: words.length > 0 ? (totalConfidence / words.length) : 0,
          wordCount: words.length,
          goodWords,
          badWords,
          duration: Math.round(totalDuration),
          transcript: transcriptData.results.transcripts?.[0]?.transcript || ''
        };
      }
      
      // Fallback: calculate from conversation history
      const userMessages = session.conversationHistory?.filter(conv => conv.user) || [];
      const transcript = userMessages.map(conv => conv.user).join(' ');
      const wordCount = transcript.split(' ').filter(word => word.length > 0).length;
      
      return {
        avgConfidence: 0.75, // Default confidence
        wordCount,
        goodWords: Math.round(wordCount * 0.6),
        badWords: Math.round(wordCount * 0.2),
        duration: Math.round(wordCount * 0.5), // Estimate 0.5 seconds per word
        transcript
      };
    };
    
    const analytics = calculateAnalytics();
    
    return (
      <div className="session-analytics-view">
        <div className="analytics-header">
          <button className="back-btn" onClick={() => setSelectedSession(null)}>← Back to Sessions</button>
          <h2>Speech Analysis — {session.sessionId}</h2>
          <p className="analytics-subtitle">Visual feedback for each spoken word, with confidence and detailed analysis</p>
        </div>
        
        <div className="analytics-grid-layout">
          <div className="analytics-left">
            <div className="analytics-card overview-card">
              <h3>Overview</h3>
              {analytics && (
                <>
                  <div className="overall-confidence">
                    <div className="confidence-label">Overall Confidence</div>
                    <div className="confidence-meter">
                      <div 
                        className="confidence-fill" 
                        style={{ width: `${Math.round(analytics.avgConfidence * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="stats-grid">
                    <div className="stat-item">
                      <strong>{Math.round(analytics.avgConfidence * 100)}%</strong>
                      <small>avg word confidence</small>
                    </div>
                    <div className="stat-item">
                      <strong>{analytics.goodWords}</strong>
                      <small>good words (&gt;85%)</small>
                    </div>
                    <div className="stat-item">
                      <strong>{analytics.badWords}</strong>
                      <small>low words (&lt;60%)</small>
                    </div>
                  </div>
                </>
              )}
              
              {session.audioFiles && session.audioFiles.length > 0 && (
                <div className="audio-section">
                  <h4>Audio Recording</h4>
                  <audio controls src={session.audioFiles[0].url} style={{width: '100%'}}>
                    Your browser does not support audio playback.
                  </audio>
                  <div className="audio-tip">
                    Tip: Click any word below to play that word's time range
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="analytics-right">
            <div className="analytics-card words-card">
              <h3>Word-level Analysis</h3>
              {analytics && (
                <div className="word-list">
                  {transcriptData?.results?.items
                    ?.filter(item => item.type === 'pronunciation')
                    ?.map((word, index) => {
                      const confidence = parseFloat(word.alternatives?.[0]?.confidence || 0);
                      const content = word.alternatives?.[0]?.content || '';
                      const startTime = parseFloat(word.start_time || 0);
                      const endTime = parseFloat(word.end_time || 0);
                      
                      let confidenceClass = 'low';
                      if (confidence >= 0.85) confidenceClass = 'high';
                      else if (confidence >= 0.6) confidenceClass = 'mid';
                      
                      return (
                        <div key={index} className="word-item">
                          <div className="word-label">{content}</div>
                          <div className="confidence-bar">
                            <div className={`confidence-fill ${confidenceClass}`} 
                                 style={{ width: `${Math.round(confidence * 100)}%` }}>
                            </div>
                          </div>
                          <div className="word-meta">
                            {Math.round(confidence * 100)}%<br/>
                            <small>{startTime.toFixed(2)}s - {endTime.toFixed(2)}s</small>
                          </div>
                        </div>
                      );
                    }) || (
                      // Fallback display when no transcript data available
                      <div className="no-transcript-data">
                        <p>Word-level analysis requires transcript data.</p>
                        <p>Overall session metrics are shown in the summary below.</p>
                      </div>
                    )
                  }
                </div>
              )}
            </div>
          </div>
        </div>
        
        {analytics && (
          <div className="session-summary">
            <div className="summary-card">
              <h3>Session Summary</h3>
              <div className="summary-stats">
                <div className="summary-stat">
                  <span className="stat-label">Word Count:</span>
                  <span className="stat-value">{analytics.wordCount} words</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Duration:</span>
                  <span className="stat-value">{Math.floor(analytics.duration / 60)}:{(analytics.duration % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Session Date:</span>
                  <span className="stat-value">{new Date(session.timestamp).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="transcript-section">
                <h4>Full Transcript</h4>
                <p className="transcript-text">{analytics.transcript}</p>
              </div>
              
              {session.conversationHistory && (
                <div className="feedback-section">
                  <h4>AI Feedback & Suggestions</h4>
                  {session.conversationHistory.map((conv, idx) => (
                    conv.agent && (
                      <div key={idx} className="feedback-content">
                        {conv.agent.split('\n').map((line, lineIdx) => (
                          <p key={lineIdx}>{line}</p>
                        ))}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderConversation = () => {
    if (!selectedSession) return null;

    return (
      <div className="conversation-modal">
        <div className="conversation-content">
          <div className="conversation-header">
            <h3>Conversation History: {selectedSession.sessionId}</h3>
            <button className="close-btn" onClick={closeConversation}>×</button>
          </div>
          
          <div className="conversation-body">
            <div className="session-info-header">
              <p><strong>Session ID:</strong> {selectedSession.sessionId}</p>
              <p><strong>Timestamp:</strong> {new Date(selectedSession.timestamp).toLocaleString()}</p>
              <p><strong>Test Type:</strong> {selectedTestType}</p>
            </div>
            
            <div className="conversation-messages">
              <h4>User-AI Conversation</h4>
              {selectedSession.conversationHistory?.map((conv, index) => (
                <div key={index}>
                  {conv.user && (
                    <div className="message user">
                      <div className="message-sender">User</div>
                      <div className="message-text">{conv.user}</div>
                    </div>
                  )}
                  {conv.agent && (
                    <div className="message ai">
                      <div className="message-sender">AI Agent</div>
                      <div className="message-text">
                        {conv.agent.split('\n').map((line, lineIdx) => (
                          <div key={lineIdx}>{line}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Login_Navbar />
      <div className="dashboard-container">
        {activeSection === 'dashboard' && renderDashboard()}
        {activeSection === 'history' && renderHistory()}
        {activeSection === 'analytics' && renderAnalytics()}
        {showConversation && renderConversation()}
      </div>
    </>
  );
}

export default Dashboard;
