import React, { useState, useEffect } from 'react';
import SpeechAnalysis from './SpeechAnalysis';
import AIFeedback from './AIFeedback';
import './advanced-dashboard.css';
import './modern-graphs.css';

    // Format AI message content with proper styling
    const formatAIMessage = (content) => {
        return content
            // Assessment Report Headers
            .replace(/ASSESSMENT REPORT/g, '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 20px; border-radius: 12px; font-weight: 700; font-size: 18px; margin: 15px 0; text-align: center; font-family: Inter, sans-serif; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">📊 ASSESSMENT REPORT</div>')
            .replace(/SITUATIONAL ASSESSMENT REPORT/g, '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 20px; border-radius: 12px; font-weight: 700; font-size: 18px; margin: 15px 0; text-align: center; font-family: Inter, sans-serif; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">📊 SITUATIONAL ASSESSMENT REPORT</div>')
            
            // Topic and Scenario headers
            .replace(/TOPIC:/g, '<div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); color: #1565c0; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #1565c0;">🎯 TOPIC:</div>')
            .replace(/SCENARIO:/g, '<div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); color: #2e7d32; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #2e7d32;">🎭 SCENARIO:</div>')
            .replace(/Situation:/g, '<div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); color: #2e7d32; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #2e7d32;">🎭 Situation:</div>')
            
            // Performance and Analysis sections
            .replace(/PERFORMANCE SUMMARY:/g, '<div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); color: #ef6c00; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #ef6c00;">📈 PERFORMANCE SUMMARY:</div>')
            .replace(/RESPONSE ANALYSIS:/g, '<div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); color: #ef6c00; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #ef6c00;">📈 RESPONSE ANALYSIS:</div>')
            .replace(/DETAILED EVALUATION:/g, '<div style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); color: #7b1fa2; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #7b1fa2;">🔍 DETAILED EVALUATION:</div>')
            
            // Development and Readiness sections
            .replace(/PROFESSIONAL DEVELOPMENT AREAS:/g, '<div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); color: #388e3c; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #388e3c;">🚀 DEVELOPMENT AREAS:</div>')
            .replace(/INTERVIEW READINESS ASSESSMENT:/g, '<div style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); color: #388e3c; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; border-left: 4px solid #388e3c;">💼 INTERVIEW READINESS:</div>')
            
            // Placement sections
            .replace(/PLACEMENT READINESS:/g, '<div style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);">🎯 PLACEMENT READINESS:</div>')
            .replace(/PLACEMENT EVALUATION:/g, '<div style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 12px 16px; border-radius: 10px; font-weight: 700; margin: 12px 0; font-family: Inter, sans-serif; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);">🎯 PLACEMENT EVALUATION:</div>')
            
            // Scores with highlighting
            .replace(/(JAM Score:|Situational Score:)\s*(\d+\.\d+)\s*\/\s*(\d+\.\d+)/g, '<div style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; padding: 8px 14px; border-radius: 20px; display: inline-block; font-weight: 700; margin: 6px 0; font-family: Inter, sans-serif; box-shadow: 0 3px 10px rgba(255, 152, 0, 0.4);">⭐ $1 $2/$3</div>')
            
            // Bullet points with better styling
            .replace(/^- /gm, '<span style="color: #667eea; font-weight: 600; margin-right: 8px;">•</span> ')
            .replace(/^\d+\. /gm, (match) => `<span style="color: #667eea; font-weight: 700; background: rgba(102, 126, 234, 0.1); padding: 2px 8px; border-radius: 12px; margin-right: 8px; font-size: 13px;">${match}</span>`)
            
            // Better paragraph spacing
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/\n/g, '<br/>');
    };
const TestModal = ({ test, onClose, testType, userEmail }) => {
    const [showHistory, setShowHistory] = useState(false);
    const [showConfidenceModal, setShowConfidenceModal] = useState(false);
    const [transcriptData, setTranscriptData] = useState(null);
    const [loadingTranscript, setLoadingTranscript] = useState(false);

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
                minute: '2-digit'
            }).replace(/am|pm/g, match => match.toUpperCase());
        } catch (error) {
            return dateTimeString;
        }
    };

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
                        <button className="close-btn" onClick={() => setShowConfidenceModal(false)} style={{color: '#000000', backgroundColor: 'rgba(0,0,0,0.1)'}}>×</button>
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
                                            
                                            {/* Y-axis */}
                                            <line x1="20" y1="20" x2="20" y2="180" stroke="#374151" strokeWidth="2"/>
                                            
                                            {/* X-axis */}
                                            <line x1="20" y1="180" x2="375" y2="180" stroke="#374151" strokeWidth="2"/>
                                            
                                            {/* Y-axis labels and grid lines */}
                                            <g>
                                                <line x1="15" y1="30" x2="375" y2="30" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2"/>
                                                <text x="25" y="35" fontSize="11" fill="#6b7280" textAnchor="end">100%</text>
                                                
                                                <line x1="15" y1="67.5" x2="375" y2="67.5" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2"/>
                                                <text x="25" y="72" fontSize="11" fill="#6b7280" textAnchor="end">75%</text>
                                                
                                                <line x1="15" y1="105" x2="375" y2="105" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2"/>
                                                <text x="25" y="110" fontSize="11" fill="#6b7280" textAnchor="end">50%</text>
                                                
                                                <line x1="15" y1="142.5" x2="375" y2="142.5" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="2,2"/>
                                                <text x="25" y="147" fontSize="11" fill="#6b7280" textAnchor="end">25%</text>
                                                
                                                <line x1="15" y1="180" x2="375" y2="180" stroke="#e5e7eb" strokeWidth="0.5"/>
                                                <text x="25" y="185" fontSize="11" fill="#6b7280" textAnchor="end">0%</text>
                                            </g>
                                            
                                            {/* X-axis labels */}
                                            <g>
                                                <text x="20" y="195" fontSize="10" fill="#6b7280" textAnchor="middle">Start</text>
                                                <text x="197.5" y="195" fontSize="10" fill="#6b7280" textAnchor="middle">Middle</text>
                                                <text x="375" y="195" fontSize="10" fill="#6b7280" textAnchor="middle">End</text>
                                            </g>
                                            
                                            {/* Data points and lines */}
                                            {words.map((word, index) => {
                                                const x = (index / (words.length - 1)) * 355 + 20;
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
                                                                x1={(index - 1) / (words.length - 1) * 355 + 20}
                                                                y1={180 - (parseFloat(words[index - 1].alternatives?.[0]?.confidence || 0) * 150)}
                                                                x2={x}
                                                                y2={y}
                                                                stroke="#60a5fa"
                                                                strokeWidth="3"
                                                            />
                                                        )}
                                                    </g>
                                                );
                                            })}
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

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Test Details - {test.sessionId}</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="modal-body">
                    {/* Metadata Section */}
                    <div className="section">
                        <h4>📊 Test Metadata</h4>
                        <div className="metadata-grid">
                            <div className="meta-item">
                                <span>Session ID:</span> {test.sessionId}
                            </div>
                            <div className="meta-item">
                                <span>Date:</span> {formatDate(test.start_time)}
                            </div>
                            <div className="meta-item">
                                <span>Time:</span> {formatTime(test.start_time)} - {formatTime(test.end_time)}
                            </div>
                            <div className="meta-item">
                                <span>Score:</span> {test.score || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Audio Section */}
                    {(testType === 'JAM' || testType === 'SITUATIONSPEAK') && test.audioFiles && test.audioFiles.length > 0 && (
                        <div className="section">
                            <h4>🎵 Audio Recording</h4>
                            <div className="files-list">
                                {test.audioFiles.map((file, index) => (
                                    <div key={index} className="file-item">
                                        <span className="file-icon">🎧</span>
                                        <span className="file-name">{file.filename || `Audio ${index + 1}`}</span>
                                        <audio controls className="audio-player">
                                            <source src={file.url} type="audio/mpeg" />
                                            Your browser does not support audio playback.
                                        </audio>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Transcript Card */}
                            {test.conversationHistory && test.conversationHistory.length > 0 && (
                                <div className="transcript-card">
                                    <h5>📝 Audio Transcript</h5>
                                    <div className="transcript-content">
                                        {test.conversationHistory
                                            .filter(item => item.user && !['hi', 'yes', '1', 'ok', 'okay'].includes(item.user.toLowerCase().trim()))
                                            .map((item, index) => (
                                                <p key={index}>{item.user}</p>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Speech Analysis Section */}
                    {(testType === 'JAM' || testType === 'SITUATIONSPEAK') && test.transcripts && test.transcripts.length > 0 && (
                        <div className="section">
                            <h4>📈 Speech Analysis</h4>
                            <div className="action-buttons">
                                <button 
                                    className="modern-btn speech-btn"
                                    onClick={() => {
                                        if (test.transcripts[0]?.url) {
                                            loadTranscriptData(test.transcripts[0].url);
                                            setShowConfidenceModal(true);
                                        }
                                    }}
                                    disabled={loadingTranscript}
                                >
                                    {loadingTranscript ? 'Loading...' : '📈 View Audio & Speech Analysis'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Conversation History Section - Centered */}
                    <div className="section conversation-section">
                        <h4>Conversation History</h4>
                        <div className="conversation-container">
                            {test.conversationHistory && test.conversationHistory.length > 0 ? (
                                test.conversationHistory.map((item, index) => (
                                    <div key={index} className="conversation-item">
                                        {item.user && (
                                            <div className="message user-message">
                                                <div className="message-label">User:</div>
                                                <div className="message-content">{item.user}</div>
                                            </div>
                                        )}
                                        {item.agent && (
                                            <div className="message agent-message">
                                                <div className="message-label">Agent:</div>
                                                <div className="message-content" 
                                                    style={{
                                                        fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
                                                        fontSize: '15px',
                                                        lineHeight: '1.6',
                                                        letterSpacing: '0.3px'
                                                    }}
                                                    dangerouslySetInnerHTML={{ __html: formatAIMessage(item.agent) }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="no-conversation">No conversation history available</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {showConfidenceModal && renderConfidenceGraphs()}
        </div>
    );
};

export default TestModal;