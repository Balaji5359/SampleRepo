import React, { useState, useEffect } from 'react';
import Login_Navbar from '../RegisterFiles/Login_Navbar.jsx';
import './dashboard.css';

const SpeechConfidenceGraph = ({ transcriptUrl }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = transcriptUrl;
    
    iframe.onload = () => {
      try {
        const json = JSON.parse(iframe.contentDocument.body.textContent);
        const items = json.results?.items || [];
        const words = items.filter(item => item.type === 'pronunciation').map(word => ({
          content: word.alternatives?.[0]?.content || '',
          confidence: parseFloat(word.alternatives?.[0]?.confidence || 0),
          startTime: parseFloat(word.start_time || 0),
          endTime: parseFloat(word.end_time || 0)
        }));
        setData(words);
        document.body.removeChild(iframe);
      } catch (error) {
        console.error('Failed to parse transcript:', error);
        document.body.removeChild(iframe);
      }
      setLoading(false);
    };
    
    iframe.onerror = () => {
      console.error('Failed to load transcript via iframe');
      document.body.removeChild(iframe);
      setLoading(false);
    };
    
    document.body.appendChild(iframe);
  };

  useEffect(() => {
    loadData();
  }, [transcriptUrl]);

  if (loading) return <div style={{padding: '20px', textAlign: 'center'}}>Loading speech analysis...</div>;
  if (!data || data.length === 0) return null;

  const avgConfidence = data.reduce((sum, word) => sum + word.confidence, 0) / data.length;
  const goodWords = data.filter(w => w.confidence > 0.85).length;
  const badWords = data.filter(w => w.confidence < 0.6).length;

  return (
    <div className="analytics-card" style={{marginTop: '20px'}}>
      <h3>Speech Confidence Analysis</h3>
      
      <div style={{display: 'flex', gap: '20px', marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px'}}>
        <div style={{flex: 1, textAlign: 'center'}}>
          <div style={{fontSize: '24px', fontWeight: 'bold', color: '#60a5fa'}}>{Math.round(avgConfidence * 100)}%</div>
          <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>avg confidence</div>
        </div>
        <div style={{flex: 1, textAlign: 'center'}}>
          <div style={{fontSize: '24px', fontWeight: 'bold', color: '#10b981'}}>{goodWords}</div>
          <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>good words (&gt;85%)</div>
        </div>
        <div style={{flex: 1, textAlign: 'center'}}>
          <div style={{fontSize: '24px', fontWeight: 'bold', color: '#ef4444'}}>{badWords}</div>
          <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>low words (&lt;60%)</div>
        </div>
      </div>

      <div style={{maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px'}}>
        {data.map((word, idx) => {
          const pct = Math.round(word.confidence * 100);
          const bgColor = word.confidence >= 0.85 ? 
            'linear-gradient(90deg, #10b981, #34d399)' :
            word.confidence >= 0.6 ?
            'linear-gradient(90deg, #f59e0b, #ffd28a)' :
            'linear-gradient(90deg, #ef4444, #ff7b7b)';
          
          return (
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
                    width: `${pct}%`,
                    background: bgColor
                  }}></div>
                </div>
              </div>
              <div style={{
                width: '140px',
                textAlign: 'right',
                fontSize: '13px',
                color: 'var(--text-muted)'
              }}>
                {pct}%<br/>
                <small style={{color: 'var(--text-muted)'}}>
                  {word.startTime.toFixed(2)}s - {word.endTime.toFixed(2)}s
                </small>
              </div>
              {word.confidence < 0.75 && (
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
          );
        })}
      </div>
    </div>
  );
};

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
                    <div className="error-suggestion">S3 bucket CORS policy blocks image access. Image files are available but cannot be displayed in browser due to security restrictions.</div>
                    <a href={session.images[0].url} target="_blank" rel="noopener noreferrer" className="download-link" style={{color: 'var(--accent-blue)', textDecoration: 'underline', fontSize: '0.9rem', marginTop: '8px', display: 'block'}}>Open Image in New Tab</a>
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
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
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
                    <div className="error-text">Audio not accessible</div>
                    <div className="error-suggestion">S3 bucket CORS policy blocks audio access. Audio files are available but cannot be played in browser due to security restrictions.</div>
                    <a href={session.audioFiles[0].url} target="_blank" rel="noopener noreferrer" className="download-link" style={{color: 'var(--accent-blue)', textDecoration: 'underline', fontSize: '0.9rem', marginTop: '8px', display: 'block'}}>Open Audio File in New Tab</a>
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
          <SpeechConfidenceGraph transcriptUrl={session.transcripts[0].url} />
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