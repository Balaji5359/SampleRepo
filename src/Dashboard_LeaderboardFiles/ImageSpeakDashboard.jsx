import React, { useState, useEffect } from 'react';
import Login_Navbar from '../RegisterFiles/Login_Navbar.jsx';
import './dashboard.css';

function ImageSpeakDashboard() {
  const [activeSection, setActiveSection] = useState('main');
  const [selectedSession, setSelectedSession] = useState(null);
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(false);
  const [userEmail] = useState(localStorage.getItem('email'));
  const [theme, setTheme] = useState('light');

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

  const loadTranscriptData = async (transcriptUrl) => {
    try {
      console.log('🔄 Loading transcript from:', transcriptUrl);
      const response = await fetch(transcriptUrl);
      const transcriptJson = await response.json();
      
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
      console.log('✅ Transcript analytics loaded:', analytics);
    } catch (error) {
      console.error('❌ Failed to load transcript:', error);
    }
  };

  const renderSessionAnalytics = () => {
    const session = selectedSession;

    return (
      <div className="session-analytics-view">
        <div className="analytics-header">
          <button className="back-btn" onClick={() => setSelectedSession(null)}>← Back to Sessions</button>
          <h2>IMAGETOSPEAK Analytics — {session.sessionId}</h2>
          <p className="analytics-subtitle">Image prompt, audio recording, and AI feedback analysis</p>
        </div>

        <div className="imagetospeak-layout">
          {/* Left side - Image and Audio */}
          <div className="media-section">
            <div className="analytics-card image-card">
              <h3>Image Prompt</h3>
              {session.images && session.images.length > 0 ? (
                <div className="media-container">
                  <img
                    src={session.images[0].url}
                    alt="IMAGESPEAK prompt"
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
                    <div className="error-url">{session.images[0].url}</div>
                    <div className="error-suggestion">Check S3 bucket permissions or file existence</div>
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
                    src={session.audioFiles[0].url} 
                    style={{width: '100%'}}
                    onLoadedData={() => console.log('✅ Audio loaded successfully:', session.audioFiles[0].url)}
                    onError={(e) => {
                      console.error('❌ Audio failed to load:', session.audioFiles[0].url);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  >
                    Your browser does not support audio playback.
                  </audio>
                  <div className="media-error" style={{display: 'none'}}>
                    <div className="error-icon">🎵</div>
                    <div className="error-text">Audio not accessible</div>
                    <div className="error-url">{session.audioFiles[0].url}</div>
                    <div className="error-suggestion">Check S3 bucket permissions or file existence</div>
                  </div>
                  <div className="audio-tip">
                    Listen to your recorded speech
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

          {/* Right side - User and AI Descriptions */}
          <div className="descriptions-section">
            {session.conversationHistory && session.conversationHistory.some(conv => conv.user) && (
              <div className="analytics-card user-description-card">
                <h3>Your Description of the Image</h3>
                <div className="description-content">
                  {session.conversationHistory.map((conv, idx) => (
                    conv.user && (
                      <p key={idx} className="user-text">{conv.user}</p>
                    )
                  ))}
                </div>
              </div>
            )}

            {session.conversationHistory && session.conversationHistory.length > 0 && session.conversationHistory[0].agent && (
              <div className="analytics-card ai-description-card">
                <h3>AI Description of the Image</h3>
                <div className="description-content">
                  <div className="ai-text">
                    <p>{session.conversationHistory[0].agent}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Feedback Section */}
        {session.conversationHistory && session.conversationHistory.length > 1 && session.conversationHistory[1].agent && (
          <div className="feedback-section-bottom">
            <div className="analytics-card feedback-card">
              <h3>AI Feedback & Suggestions</h3>
              <div className="feedback-content">
                <div className="feedback-item">
                  {session.conversationHistory[1].agent.split('\n').map((line, lineIdx) => (
                    line.trim() && <p key={lineIdx} className="feedback-line">{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transcript Analytics */}
        {session.transcripts && session.transcripts.length > 0 && (
          <div className="transcript-analytics-section">
            <div className="analytics-card transcript-card">
              <h3>Speech Analysis (JSON Transcript)</h3>
              <div className="transcript-url-info">
                <p><strong>Transcript File:</strong> {session.transcripts[0].url}</p>
                <button 
                  className="load-transcript-btn"
                  onClick={() => loadTranscriptData(session.transcripts[0].url)}
                >
                  Load Detailed Analysis
                </button>
              </div>
              {session.transcriptAnalytics && (
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
                  <div className="word-analysis">
                    {session.transcriptAnalytics.words?.map((word, idx) => (
                      <div key={idx} className="word-confidence-item">
                        <span className="word">{word.content}</span>
                        <div className="confidence-bar">
                          <div 
                            className={`confidence-fill ${
                              word.confidence > 0.85 ? 'high' : 
                              word.confidence > 0.6 ? 'mid' : 'low'
                            }`}
                            style={{width: `${word.confidence * 100}%`}}
                          ></div>
                        </div>
                        <span className="confidence-score">{Math.round(word.confidence * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="session-summary">
          <div className="summary-card">
            <h3>Session Summary</h3>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-label">Session Date:</span>
                <span className="stat-value">{new Date(session.timestamp).toLocaleString()}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">Test Type:</span>
                <span className="stat-value">IMAGETOSPEAK</span>
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
        </div>
      </div>
    );
  };

  if (activeSection === 'history') {
    return (
      <>
        <Login_Navbar />
        <div className="dashboard-container">
          <div className="dashboard-main">
            <div className="dashboard-header">
              <button className="back-btn" onClick={() => setActiveSection('main')}>← Back</button>
              <h1>🖼️ Image to Speak History</h1>
              <div className="theme-selector">
                <label>Theme: </label>
                <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="loading">Loading sessions...</div>
            ) : (
              <div className="sessions-list">
                {apiData.sessions?.map(session => (
                  <div key={session.sessionId} className="session-card">
                    <div className="session-info">
                      <div className="session-id">{session.sessionId}</div>
                      <div className="session-details">
                        <span className="session-type">IMAGETOSPEAK</span>
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
        </div>
      </>
    );
  }

  if (activeSection === 'analytics') {
    if (selectedSession) {
      return (
        <>
          <Login_Navbar />
          <div className="dashboard-container">
            {renderSessionAnalytics()}
          </div>
        </>
      );
    }

    return (
      <>
        <Login_Navbar />
        <div className="dashboard-container">
          <div className="dashboard-main">
            <div className="dashboard-header">
              <button className="back-btn" onClick={() => setActiveSection('main')}>← Back</button>
              <h1>🖼️ Image to Speak Analytics</h1>
              <div className="theme-selector">
                <label>Theme: </label>
                <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="loading">Loading sessions...</div>
            ) : (
              <div className="sessions-list">
                {apiData.sessions?.map(session => (
                  <div
                    key={session.sessionId}
                    className="session-card analytics-session-card"
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="session-info">
                      <div className="session-id">{session.sessionId}</div>
                      <div className="session-details">
                        <span className="session-type">IMAGETOSPEAK</span>
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
        </div>
      </>
    );
  }

  return (
    <>
      <Login_Navbar />
      <div className="dashboard-container">
        <div className="dashboard-main">
          <div className="dashboard-header">
            <h1>🖼️ Image to Speak Dashboard</h1>
            <p className="dashboard-subtitle">Analyze your image description sessions</p>
            <div className="theme-selector">
              <label>Theme: </label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="custom">Custom</option>
              </select>
            </div>
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
        </div>
      </div>
    </>
  );
}

export default ImageSpeakDashboard;