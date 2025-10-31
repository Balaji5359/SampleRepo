import React, { useState, useEffect } from 'react';
import './dashboard.css';

const testTypes = [
  { name: 'JAM', display: 'Just A Minute (JAM)', gradient: 'gradient-purple' },
  { name: 'PRONUNCIATION', display: 'Pronunciation Test', gradient: 'gradient-blue' },
  { name: 'IMAGETOSPEAK', display: 'Image to Speak', gradient: 'gradient-green' },
  { name: 'SITUATIONSPEAK', display: 'Situational Speaking', gradient: 'gradient-orange' },
  { name: 'STORYRETELLING', display: 'Story Retelling', gradient: 'gradient-pink' },
  { name: 'IMAGETOSTORY', display: 'Image to Story', gradient: 'gradient-teal' }
];

const Dashboard = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [historyData, setHistoryData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [transcriptData, setTranscriptData] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const collegeEmail = localStorage.getItem('email') || 'mailto:22691a2828@mits.ac.in';

  const fetchHistory = async (testType) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_retrivalapi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          college_email: collegeEmail,
          test_type: testType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch history data');
      }

      const data = await response.json();
      const parsedBody = JSON.parse(data.body);
      setHistoryData(parsedBody);
      setSelectedSession(null);
      setShowHistoryModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTranscriptData = async (transcriptUrl) => {
    try {
      // Use proxy to bypass CORS
      const proxyUrl = transcriptUrl.replace('https://students-recording-communication-activities-transcribe-startup.s3.amazonaws.com', '/s3-proxy');
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch transcript data');
      }
      const data = await response.json();
      setTranscriptData(data);
    } catch (err) {
      console.error('Error fetching transcript:', err);
      setTranscriptData(null);
    }
  };

  const fetchAnalytics = async (testType) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://ibxdsy0e40.execute-api.ap-south-1.amazonaws.com/dev/studentcommunicationtests_retrivalapi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          college_email: collegeEmail,
          test_type: testType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      const parsedBody = JSON.parse(data.body);
      setHistoryData(parsedBody);
      setSelectedSession(null);

      // Fetch transcript data for word analysis
      if (parsedBody.sessions && parsedBody.sessions[0] && parsedBody.sessions[0].transcripts && parsedBody.sessions[0].transcripts[0]) {
        await fetchTranscriptData(parsedBody.sessions[0].transcripts[0].url);
      }

      setShowAnalyticsModal(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
      {testTypes.map((test) => (
        <div key={test.name} className="test-card">
          <div className={`test-card-header ${test.gradient}`}>
            <h3 style={{fontSize: '20px', fontWeight: 'bold', color: 'white', margin: '0 0 8px 0'}}>{test.display}</h3>
            <p style={{color: 'rgba(255,255,255,0.8)', margin: '0', fontSize: '14px'}}>Practice and improve your skills</p>
          </div>
          <div style={{padding: '24px'}}>
            <div style={{display: 'flex', gap: '12px'}}>
              <button
                onClick={() => fetchHistory(test.name)}
                className="btn-primary"
                disabled={loading}
                style={{flex: 1}}
              >
                {loading ? 'Loading...' : 'History'}
              </button>
              <button
                onClick={() => fetchAnalytics(test.name)}
                className="btn-secondary"
                disabled={loading}
                style={{flex: 1}}
              >
                Analytics
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderHistory = () => {
    if (!historyData) return null;

    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <h2 className="gradient-text" style={{fontSize: '24px', fontWeight: 'bold', margin: '0'}}>Test History</h2>
          <button
            onClick={() => setShowHistoryModal(false)}
            className="btn-secondary"
          >
            Close
          </button>
        </div>

        <div className="stats-card" style={{padding: '24px'}}>
          <h3 style={{fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0'}}>Summary</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
            <div style={{textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '8px'}}>
              <div style={{fontSize: '24px', fontWeight: 'bold', color: '#1f2937'}}>{historyData.tests_count}</div>
              <div style={{fontSize: '14px', color: '#6b7280'}}>Total Sessions</div>
            </div>
            <div style={{textAlign: 'center', padding: '16px', background: '#f0f9ff', borderRadius: '8px'}}>
              <div style={{fontSize: '24px', fontWeight: 'bold', color: '#0369a1'}}>{historyData.sessions.length}</div>
              <div style={{fontSize: '14px', color: '#6b7280'}}>Available Records</div>
            </div>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px'}}>
          {historyData.sessions.map((session, index) => (
            <div key={session.sessionId} className="history-item" 
                 style={{
                   background: 'white', 
                   borderRadius: '12px', 
                   boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
                   border: '1px solid #e5e7eb',
                   padding: '20px',
                   cursor: 'pointer',
                   transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                 }}
                 onClick={() => setSelectedSession(session)}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.transform = 'translateY(-2px)';
                   e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.transform = 'translateY(0)';
                   e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                 }}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
                <h4 style={{fontSize: '18px', fontWeight: '600', margin: '0', color: '#1f2937'}}>ID: {session.sessionId}</h4>
                <span style={{fontSize: '12px', color: '#6b7280', background: '#f3f4f6', padding: '4px 8px', borderRadius: '12px'}}>
                  {new Date(session.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <div style={{marginBottom: '12px'}}>
                <div style={{fontSize: '14px', color: '#6b7280', marginBottom: '4px'}}>Messages</div>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: '#059669'}}>
                  {session.conversationHistory ? session.conversationHistory.length : 0}
                </div>
              </div>
              
              <div style={{fontSize: '14px', color: '#374151', marginBottom: '12px'}}>
                Last activity: {new Date(session.timestamp).toLocaleTimeString()}
              </div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontSize: '12px', color: '#6b7280'}}>Click to view conversation</span>
                <div style={{width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{color: 'white', fontSize: '12px'}}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedSession && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} onClick={() => setSelectedSession(null)}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '800px',
              maxHeight: '80vh',
              overflow: 'auto',
              margin: '20px'
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h3 style={{fontSize: '20px', fontWeight: 'bold', margin: '0'}}>Session: {selectedSession.sessionId}</h3>
                <button 
                  onClick={() => setSelectedSession(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >×</button>
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {selectedSession.conversationHistory && selectedSession.conversationHistory.map((msg, msgIndex) => (
                  <div key={msgIndex} style={{
                    padding: '16px',
                    borderRadius: '12px',
                    marginLeft: msg.user ? '40px' : '0',
                    marginRight: msg.user ? '0' : '40px',
                    background: msg.user ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0fdf4',
                    color: msg.user ? 'white' : '#374151'
                  }}>
                    <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        background: msg.user ? 'rgba(255,255,255,0.2)' : '#10b981'
                      }}>
                        {msg.user ? 'U' : 'AI'}
                      </div>
                      <div style={{flex: 1}}>
                        <p style={{fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0', opacity: 0.9}}>
                          {msg.user ? 'You' : 'AI Assistant'}
                        </p>
                        <p style={{margin: '0', whiteSpace: 'pre-wrap', lineHeight: '1.5'}}>{msg.user || msg.agent}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const [sessionTranscripts, setSessionTranscripts] = useState({});
  const [transcriptLoading, setTranscriptLoading] = useState(false);

  const fetchSessionTranscript = async (session) => {
    if (!session.transcripts || session.transcripts.length === 0) return;

    const sessionId = session.sessionId;
    if (sessionTranscripts[sessionId]) return; // Already fetched

    setTranscriptLoading(true);
    try {
      // Use proxy to bypass CORS
      const proxyUrl = session.transcripts[0].url.replace('https://students-recording-communication-activities-transcribe-startup.s3.amazonaws.com', '/s3-proxy');
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data.results && data.results.items) {
        const words = data.results.items
          .filter(item => item.type === 'pronunciation')
          .map(item => ({
            text: item.alternatives[0].content,
            confidence: parseFloat(item.alternatives[0].confidence) || 0,
            start: parseFloat(item.start_time) || 0,
            end: parseFloat(item.end_time) || 0
          }));
        
        setSessionTranscripts(prev => ({
          ...prev,
          [sessionId]: words
        }));
      }
    } catch (error) {
      console.error('Error fetching transcript:', error);
    } finally {
      setTranscriptLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSession) {
      fetchSessionTranscript(selectedSession);
    }
  }, [selectedSession]);

  const renderWordAnalysis = () => {
    if (!selectedSession) {
      return (
        <div style={{textAlign: 'center', color: '#6b7280', padding: '32px'}}>
          No session selected
        </div>
      );
    }

    if (!selectedSession.transcripts || selectedSession.transcripts.length === 0) {
      return (
        <div style={{textAlign: 'center', color: '#6b7280', padding: '32px'}}>
          No transcript available for session: {selectedSession.sessionId}
        </div>
      );
    }

    if (transcriptLoading) {
      return (
        <div style={{textAlign: 'center', color: '#6b7280', padding: '32px'}}>
          Loading word analysis for {selectedSession.sessionId}...
        </div>
      );
    }

    const sessionWords = sessionTranscripts[selectedSession.sessionId] || [];
    
    if (sessionWords.length === 0) {
      return (
        <div style={{textAlign: 'center', color: '#6b7280', padding: '32px'}}>
          No word analysis data for session: {selectedSession.sessionId}
        </div>
      );
    }

    const avgConfidence = sessionWords.reduce((sum, word) => sum + word.confidence, 0) / sessionWords.length;
    const goodWords = sessionWords.filter(w => w.confidence > 0.85).length;
    const badWords = sessionWords.filter(w => w.confidence < 0.7).length;
    const totalWords = sessionWords.length;

    return (
      <div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'}}>
          <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'white'}}>
            <div style={{fontSize: '28px', fontWeight: 'bold'}}>{Math.round(avgConfidence * 100)}%</div>
            <div style={{fontSize: '14px', opacity: 0.9}}>Avg Confidence</div>
          </div>
          <div style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'white'}}>
            <div style={{fontSize: '28px', fontWeight: 'bold'}}>{goodWords}</div>
            <div style={{fontSize: '14px', opacity: 0.9}}>Excellent (85%+)</div>
          </div>
          <div style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'white'}}>
            <div style={{fontSize: '28px', fontWeight: 'bold'}}>{badWords}</div>
            <div style={{fontSize: '14px', opacity: 0.9}}>Needs Work (70%+)</div>
          </div>
          <div style={{background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'white'}}>
            <div style={{fontSize: '28px', fontWeight: 'bold'}}>{totalWords}</div>
            <div style={{fontSize: '14px', opacity: 0.9}}>Total Words</div>
          </div>
        </div>

        <div style={{background: '#f8fafc', padding: '20px', borderRadius: '12px'}}>
          <h4 style={{fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0'}}>Word Confidence Analysis</h4>
          <div style={{maxHeight: '300px', overflowY: 'auto'}}>
            {sessionWords.map((word, index) => {
              const confidence = word.confidence;
              let barColor = '#ef4444';
              let bgColor = '#fef2f2';
              if (confidence >= 0.85) {
                barColor = '#10b981';
                bgColor = '#f0fdf4';
              } else if (confidence >= 0.7) {
                barColor = '#f59e0b';
                bgColor = '#fffbeb';
              }

              return (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  background: bgColor,
                  border: `1px solid ${barColor}20`,
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{minWidth: '100px', fontWeight: '600', color: '#374151'}}>{word.text}</div>
                  <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <div style={{
                      height: '12px',
                      borderRadius: '6px',
                      background: '#e5e7eb',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: `${confidence * 100}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${barColor}, ${barColor}dd)`,
                        borderRadius: '6px',
                        transition: 'width 1s ease'
                      }}></div>
                    </div>
                    <div style={{fontSize: '12px', color: '#6b7280', marginTop: '4px'}}>
                      Frequency: {word.frequency}x
                    </div>
                  </div>
                  <div style={{minWidth: '70px', textAlign: 'right', fontSize: '16px', fontWeight: '600', color: barColor}}>
                    {Math.round(confidence * 100)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const extractAIFeedback = (session) => {
    if (!session || !session.conversationHistory) return null;

    // Find the AI feedback message (usually the last agent message with scores)
    const feedbackMessage = session.conversationHistory
      .filter(msg => msg.agent && (msg.agent.includes('DETAILED SCORES') || msg.agent.includes('JAM Score')))
      .pop();

    if (!feedbackMessage) return null;

    const feedbackText = feedbackMessage.agent;
    
    // Extract scores using regex
    const jamScoreMatch = feedbackText.match(/JAM Score: ([\d.]+)/i);
    const grammarMatch = feedbackText.match(/Grammar: (\d+)/i);
    const vocabularyMatch = feedbackText.match(/Vocabulary: (\d+)/i);
    const fluencyMatch = feedbackText.match(/Fluency & Flow: (\d+)/i);
    const wordCountMatch = feedbackText.match(/WORD COUNT: (\d+)/i);
    
    // Extract improvement tips
    const tipsSection = feedbackText.split('IMPROVEMENT TIPS:')[1];
    const suggestions = tipsSection ? 
      tipsSection.split('\n').filter(line => line.trim().match(/^\d+\./)).map(tip => tip.replace(/^\d+\.\s*/, '').trim()) : [];
    
    // Extract summary for strengths
    const summarySection = feedbackText.split('SUMMARY:')[1]?.split('DETAILED SCORES:')[0];
    const strengths = summarySection ? [summarySection.trim()] : ['Good participation in the session'];

    return {
      overallScore: jamScoreMatch ? Math.round(parseFloat(jamScoreMatch[1]) * 10) : 75,
      grammar: grammarMatch ? parseInt(grammarMatch[1]) * 10 : 70,
      vocabulary: vocabularyMatch ? parseInt(vocabularyMatch[1]) * 10 : 70,
      fluency: fluencyMatch ? parseInt(fluencyMatch[1]) * 10 : 70,
      wordCount: wordCountMatch ? parseInt(wordCountMatch[1]) : 0,
      suggestions: suggestions.length > 0 ? suggestions : [
        'Continue practicing regular conversations',
        'Focus on clear pronunciation'
      ],
      strengths: strengths
    };
  };

  const renderAIFeedback = (session) => {
    if (!session) return null;

    const feedback = extractAIFeedback(session);
    
    if (!feedback) {
      return (
        <div style={{textAlign: 'center', color: '#6b7280', padding: '32px'}}>
          No AI feedback available for this session
        </div>
      );
    }

    return (
      <div>
        {/* Score Overview */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'}}>
          <div style={{background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'white'}}>
            <div style={{fontSize: '32px', fontWeight: 'bold'}}>{feedback.overallScore}</div>
            <div style={{fontSize: '14px', opacity: 0.9}}>Overall Score</div>
          </div>
          <div style={{background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'white'}}>
            <div style={{fontSize: '32px', fontWeight: 'bold'}}>{feedback.grammar}</div>
            <div style={{fontSize: '14px', opacity: 0.9}}>Grammar</div>
          </div>
          <div style={{background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'white'}}>
            <div style={{fontSize: '32px', fontWeight: 'bold'}}>{feedback.vocabulary}</div>
            <div style={{fontSize: '14px', opacity: 0.9}}>Vocabulary</div>
          </div>
          <div style={{background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'white'}}>
            <div style={{fontSize: '32px', fontWeight: 'bold'}}>{feedback.fluency}</div>
            <div style={{fontSize: '14px', opacity: 0.9}}>Fluency</div>
          </div>
        </div>

        {/* Word Count Analysis */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px'}}>
          <div style={{background: '#f0f9ff', padding: '20px', borderRadius: '12px', border: '1px solid #e0f2fe'}}>
            <h4 style={{fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0', color: '#0369a1'}}>📊 Word Statistics</h4>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span style={{color: '#374151'}}>Word Count:</span>
              <span style={{fontWeight: '600', color: '#0369a1'}}>{feedback.wordCount}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span style={{color: '#374151'}}>Messages:</span>
              <span style={{fontWeight: '600', color: '#0369a1'}}>{session.conversationHistory?.length || 0}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: '#374151'}}>Session ID:</span>
              <span style={{fontWeight: '600', color: '#0369a1', fontSize: '12px'}}>{session.sessionId}</span>
            </div>
          </div>
          
          <div style={{background: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '1px solid #dcfce7'}}>
            <h4 style={{fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0', color: '#059669'}}>🎯 Performance Level</h4>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#059669', marginBottom: '8px'}}>
              {feedback.overallScore >= 90 ? 'Excellent' : 
               feedback.overallScore >= 70 ? 'Good' : 
               feedback.overallScore >= 50 ? 'Average' : 'Needs Improvement'}
            </div>
            <div style={{fontSize: '14px', color: '#374151'}}>
              {feedback.overallScore >= 70 ? 'Great job! Keep practicing to improve further.' : 'Keep practicing - every session helps you improve!'}
            </div>
          </div>
        </div>

        {/* Suggestions and Strengths */}
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
          <div style={{background: '#fff7ed', padding: '20px', borderRadius: '12px', border: '1px solid #fed7aa'}}>
            <h4 style={{fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0', color: '#ea580c', display: 'flex', alignItems: 'center'}}>
              💡 Suggestions for Improvement
            </h4>
            <ul style={{margin: '0', paddingLeft: '20px'}}>
              {feedback.suggestions.map((suggestion, index) => (
                <li key={index} style={{color: '#374151', marginBottom: '8px', lineHeight: '1.5'}}>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
          
          <div style={{background: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '1px solid #bbf7d0'}}>
            <h4 style={{fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0', color: '#059669', display: 'flex', alignItems: 'center'}}>
              ⭐ Your Strengths
            </h4>
            <ul style={{margin: '0', paddingLeft: '20px'}}>
              {feedback.strengths.map((strength, index) => (
                <li key={index} style={{color: '#374151', marginBottom: '8px', lineHeight: '1.5'}}>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    if (!historyData) return null;

    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <h2 className="gradient-text" style={{fontSize: '24px', fontWeight: 'bold', margin: '0'}}>Analytics Dashboard</h2>
          <button
            onClick={() => setShowAnalyticsModal(false)}
            className="btn-secondary"
          >
            Close
          </button>
        </div>

        {/* Session Selection */}
        <div className="analytics-card" style={{padding: '24px'}}>
          <h3 style={{fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0'}}>Select Session for Analysis</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px'}}>
            {historyData.sessions.map((session, index) => (
              <div key={session.sessionId} 
                   style={{
                     padding: '16px',
                     border: selectedSession?.sessionId === session.sessionId ? '2px solid #10b981' : '1px solid #e5e7eb',
                     borderRadius: '8px',
                     cursor: 'pointer',
                     background: selectedSession?.sessionId === session.sessionId ? '#f0fdf4' : 'white',
                     transition: 'all 0.2s ease'
                   }}
                   onClick={() => {
                     console.log('Selected session:', session.sessionId);
                     setSelectedSession(session);
                     if (session.transcripts && session.transcripts.length > 0) {
                       fetchSessionTranscript(session);
                     }
                   }}>
                <div style={{fontWeight: '600', marginBottom: '8px'}}>ID: {session.sessionId}</div>
                <div style={{fontSize: '14px', color: '#6b7280'}}>
                  {new Date(session.timestamp).toLocaleDateString()}
                </div>
                <div style={{fontSize: '12px', color: '#059669', marginTop: '4px'}}>
                  {session.conversationHistory ? session.conversationHistory.length : 0} messages
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedSession && (
          <>
            {/* Session Info */}
            <div className="analytics-card" style={{padding: '24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
              <h3 style={{fontSize: '20px', fontWeight: '600', margin: '0 0 8px 0'}}>Session: {selectedSession.sessionId}</h3>
              <p style={{margin: '0', opacity: 0.9}}>Timestamp: {selectedSession.timestamp}</p>
            </div>

            {/* Audio Section */}
            {selectedSession.audioFiles && selectedSession.audioFiles.length > 0 && (
              <div className="analytics-card" style={{padding: '24px'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0'}}>🎵 Audio Recording</h3>
                <div style={{background: '#f8fafc', padding: '20px', borderRadius: '12px'}}>
                  <audio controls style={{width: '100%', marginBottom: '12px'}}>
                    <source src={selectedSession.audioFiles[0].url} type="audio/webm" />
                    Your browser does not support the audio element.
                  </audio>
                  <div style={{fontSize: '14px', color: '#6b7280'}}>
                    File: {selectedSession.audioFiles[0].key}
                  </div>
                </div>
              </div>
            )}

            {/* Transcript Section */}
            <div className="analytics-card" style={{padding: '24px'}}>
              <h3 style={{fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0'}}>📝 Transcript for {selectedSession.sessionId}</h3>
              <div style={{background: '#f9fafb', padding: '20px', borderRadius: '12px', maxHeight: '400px', overflowY: 'auto'}}>
                {selectedSession.conversationHistory && selectedSession.conversationHistory.map((msg, index) => (
                  <div key={`${selectedSession.sessionId}-${index}`} style={{
                    padding: '12px',
                    marginBottom: '8px',
                    background: msg.user ? '#e0f2fe' : '#f3e5f5',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${msg.user ? '#0277bd' : '#7b1fa2'}`
                  }}>
                    <div style={{fontWeight: '600', fontSize: '14px', marginBottom: '4px'}}>
                      {msg.user ? '👤 User' : '🤖 AI Assistant'}
                    </div>
                    <div style={{color: '#374151', whiteSpace: 'pre-wrap'}}>{msg.user || msg.agent}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Word Analysis Section */}
            {selectedSession.transcripts && selectedSession.transcripts.length > 0 && (
              <div className="analytics-card" style={{padding: '24px'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0'}}>📊 Word Analysis</h3>
                {renderWordAnalysis()}
              </div>
            )}

            {/* AI Feedback Section */}
            <div className="analytics-card" style={{padding: '24px'}}>
              <h3 style={{fontSize: '18px', fontWeight: '600', margin: '0 0 16px 0'}}>🎯 AI Feedback for {selectedSession.sessionId}</h3>
              {renderAIFeedback(selectedSession)}
            </div>
          </>
        )}

        {!selectedSession && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '2px dashed #d1d5db'
          }}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}>📊</div>
            <h3 style={{fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0', color: '#374151'}}>Select a Session</h3>
            <p style={{color: '#6b7280', margin: '0'}}>Choose a session from above to view detailed analytics</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '24px'}}>
        <header style={{marginBottom: '32px'}}>
          <h1 className="gradient-text" style={{fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0'}}>Communication Tests Dashboard</h1>
          <p style={{color: '#6b7280', margin: '0', fontSize: '16px'}}>Track your progress and analyze your speaking skills</p>
        </header>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            Error: {error}
          </div>
        )}

        {activeTab === 'overview' && renderOverview()}
        
        {/* History Modal */}
        {showHistoryModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} onClick={() => setShowHistoryModal(false)}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '0',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'hidden',
              margin: '20px'
            }} onClick={(e) => e.stopPropagation()}>
              {renderHistory()}
            </div>
          </div>
        )}
        
        {/* Analytics Modal */}
        {showAnalyticsModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} onClick={() => setShowAnalyticsModal(false)}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '0',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              margin: '20px'
            }} onClick={(e) => e.stopPropagation()}>
              {renderAnalytics()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
